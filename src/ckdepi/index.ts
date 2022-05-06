import {
    BaseValues, CalculationResult, Calculator, Gender, RiskLevel
} from '../interfaces';

export enum CkdEpiRace {
    Other = 0,
    AfricanAmerican = 1
}

export interface CkdEpiValues extends BaseValues {
    /**
     * years
     */
    age: number;
    /**
     * μmol/L
     */
    creatinine: number;
    /**
     * male / female
     */
    gender: Gender;
    /**
     * human race
     */
    race: CkdEpiRace;
}

export enum CkdStage {
    C1 = 0,
    C2 = 1,
    C3A = 2,
    C3B = 3,
    C4 = 4,
    C5 = 5
}

export interface CkdEpiCalculationResult extends CalculationResult {
    additionalValues: {
        stage: CkdStage
    }
}

/**
 * Chronic kidney disease epidemiology collaboration
 */
export class CkdEpi implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 300
        };
    }

    private getRisk(value: number) {
        // Result interpretation
        if (value <= 15) {
            return { stage: CkdStage.C5, riskLevel: RiskLevel.Critical };
        }
        if (value <= 29) {
            return { stage: CkdStage.C4, riskLevel: RiskLevel.High };
        }
        if (value <= 44) {
            return { stage: CkdStage.C3B, riskLevel: RiskLevel.Moderate };
        }
        if (value <= 59) {
            return { stage: CkdStage.C3A, riskLevel: RiskLevel.Moderate };
        }
        if (value <= 89) {
            return { stage: CkdStage.C2, riskLevel: RiskLevel.Low };
        }
        return { stage: CkdStage.C1, riskLevel: RiskLevel.Low };
    }

    calculate(values: CkdEpiValues): CkdEpiCalculationResult {
        const scr = values.creatinine / 88.4;
        const alpha = values.gender === Gender.Male ? -0.411 : -0.329;
        const k = values.gender === Gender.Male ? 0.9 : 0.7;
        const value = Math.round(141
            * (values.gender === Gender.Female ? 1.018 : 1)
            * (values.race === CkdEpiRace.AfricanAmerican ? 1.159 : 1)
            * (0.993 ** values.age)
            * ((scr / k) ** (scr <= k ? alpha : -1.209)));
        const risk = this.getRisk(value);
        return {
            value,
            additionalValues: {
                stage: risk.stage
            },
            riskLevel: risk.riskLevel
        };
    }
}
