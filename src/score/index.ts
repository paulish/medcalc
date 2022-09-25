import {
    BaseValues, CalculationResult, Calculator, Gender, RiskLevel
} from '../interfaces';

interface ScoreCoefPair {
    alpha: number;
    p: number;
}

interface ScoreGenderCoefPair {
    male: ScoreCoefPair;
    female: ScoreCoefPair;
}

interface ScoreCoefs {
    low: ScoreGenderCoefPair;
    high: ScoreGenderCoefPair;
    smoker: number;
    cholesterol: number;
    systolicBP: number;
}

const coefsCHD: ScoreCoefs = {
    low: {
        male: {
            alpha: -22.1,
            p: 4.71
        },
        female: {
            alpha: -29.8,
            p: 6.36
        }
    },
    high: {
        male: {
            alpha: -21.0,
            p: 4.62
        },
        female: {
            alpha: -28.1,
            p: 6.23
        }
    },
    smoker: 0.71,
    cholesterol: 0.24,
    systolicBP: 0.018
};

const coefsNonCHD: ScoreCoefs = {
    low: {
        male: {
            alpha: -26.7,
            p: 5.64
        },
        female: {
            alpha: -31.0,
            p: 6.62
        }
    },
    high: {
        male: {
            alpha: -25.7,
            p: 5.47
        },
        female: {
            alpha: -30.0,
            p: 6.42
        }
    },
    smoker: 0.63,
    cholesterol: 0.02,
    systolicBP: 0.022
};

export interface ScoreValues extends BaseValues {
    /**
     * years
     */
    age: number;
    /**
    * male / female
    */
    gender: Gender;
    /**
     * mmol/L
     */
    cholesterol: number;
    /**
     * mmHg
     */
    systolicBP: number;
    /**
     * true / false
     */
    smoker: boolean;
    /**
     * true / false
     */
    highRiskCountry: boolean;
}

export interface ScoreCalculationResult extends CalculationResult {
    additionalValues: {
        color: string;
    }
}

/**
 * SCORE - Systematic COronary Risk Evaluation
 */
export class Score implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 100
        };
    }

    calcRisk(value: number): { risk: RiskLevel, color: string } {
        if (value < 1) return { risk: RiskLevel.Low, color: '#00b050' };
        if (value < 2) return { risk: RiskLevel.Moderate, color: '#92d050' };
        if (value < 3) return { risk: RiskLevel.Moderate, color: '#ffff00' };
        if (value < 5) return { risk: RiskLevel.Moderate, color: '#ffc000' };
        if (value < 10) return { risk: RiskLevel.High, color: '#ff0000' };
        if (value < 15) return { risk: RiskLevel.Critical, color: '#e20000' };
        return { risk: RiskLevel.Critical, color: '#c00000' };
    }

    calculate(values: ScoreValues): ScoreCalculationResult {
        const { alpha: a1, p: p1 } = coefsCHD[values.highRiskCountry ? 'high' : 'low'][values.gender === Gender.Male ? 'male' : 'female'];

        const chd0 = Math.exp(-Math.exp(a1) * (values.age - 20.0) ** p1);
        const chd10 = Math.exp(-Math.exp(a1) * (values.age - 10.0) ** p1);

        const { alpha: a2, p: p2 } = coefsNonCHD[values.highRiskCountry ? 'high' : 'low'][values.gender === Gender.Male ? 'male' : 'female'];

        const nchd0 = Math.exp(-Math.exp(a2) * (values.age - 20.0) ** p2);
        const nchd10 = Math.exp(-Math.exp(a2) * (values.age - 10.0) ** p2);

        const wc = coefsCHD.cholesterol * (values.cholesterol - 6.0)
            + coefsCHD.systolicBP * (values.systolicBP - 120.0)
            + (values.smoker ? coefsCHD.smoker : 0);
        const wnc = coefsNonCHD.cholesterol * (values.cholesterol - 6.0)
            + coefsNonCHD.systolicBP * (values.systolicBP - 120.0)
            + (values.smoker ? coefsNonCHD.smoker : 0);

        const cs = chd0 ** Math.exp(wc);
        const cs1 = chd10 ** Math.exp(wc);
        const ncs = nchd0 ** Math.exp(wnc);
        const ncs1 = nchd10 ** Math.exp(wnc);

        const r = 1.0 - (cs1 / cs);
        const r1 = 1.0 - (ncs1 / ncs);
        const value = Math.round((r + r1) * 10000) / 100;
        const { risk, color } = this.calcRisk(value);
        return {
            value,
            riskLevel: risk,
            additionalValues: {
                color
            }
        };
    }
}
