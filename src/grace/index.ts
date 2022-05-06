import {
    BaseValues, CalculationResult,
    Calculator, RiskLevel
} from '../interfaces';

export interface GraceValues extends BaseValues {
    /**
     * years
     */
    age: number;
    /**
     * bpm
     */
    heartRate: number;
    /**
     * mmHg
     */
    systolicBP: number;
    /**
     * μmol/L
     */
    creatinine: number;
    /**
     * Killip class (I - IV)
     */
    killip: number;
    /**
     * Heart attack on presentation
     */
    cardiacArrest: boolean;
    /**
     * Segment ST deviation
     */
    segmentSTDeviation: boolean;
    /**
     * Elevated cardiac enzymes
     */
    elevatedCardiacEnzymes: boolean;
}

export interface GraceCalculationResult extends CalculationResult {
    additionalValues: {
        raiseST: {
            inHospital: {
                riskLevel: RiskLevel,
                mortality: string
            },
            sixMonth: {
                riskLevel: RiskLevel,
                mortality: string
            }
        },
        noRaiseST: {
            inHospital: {
                riskLevel: RiskLevel,
                mortality: string
            },
            sixMonth: {
                riskLevel: RiskLevel,
                mortality: string
            }
        }
    }
}

export class Grace implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 300
        };
    }

    private calcRisk(grace: number, raiseST: boolean, inHospital: boolean) {
        if (raiseST) {
            if (inHospital) {
                if (grace > 154) return { riskLevel: RiskLevel.High, mortality: '> 5%' };
                if (grace >= 126) return { riskLevel: RiskLevel.Moderate, mortality: '2-5%' };
                return { riskLevel: RiskLevel.Low, mortality: '< 2%' };
            }
            if (grace > 127) return { riskLevel: RiskLevel.High, mortality: '> 11%' };
            if (grace >= 100) return { riskLevel: RiskLevel.Moderate, mortality: '4.5-11%' };
            return { riskLevel: RiskLevel.Low, mortality: '< 4.5%' };
        }
        if (inHospital) {
            if (grace > 140) return { riskLevel: RiskLevel.High, mortality: '> 3%' };
            if (grace >= 109) return { riskLevel: RiskLevel.Moderate, mortality: '1-3%' };
            return { riskLevel: RiskLevel.Low, mortality: '< 1%' };
        }
        if (grace > 118) return { riskLevel: RiskLevel.High, mortality: '> 8%' };
        if (grace >= 89) return { riskLevel: RiskLevel.Moderate, mortality: '3-8%' };
        return { riskLevel: RiskLevel.Low, mortality: '< 3%' };
    }

    calculate(values: GraceValues): GraceCalculationResult {
        let value = 0;

        // age
        if (values.age > 90) value += 100;
        else if (values.age >= 80) value += 91;
        else if (values.age >= 70) value += 75;
        else if (values.age >= 60) value += 58;
        else if (values.age >= 50) value += 41;
        else if (values.age >= 40) value += 25;
        else if (values.age >= 30) value += 8;

        // heart rate
        if (values.heartRate > 250) value += 46;
        else if (values.heartRate > 200) value += 46;
        else if (values.heartRate >= 150) value += 38;
        else if (values.heartRate >= 110) value += 24;
        else if (values.heartRate >= 90) value += 15;
        else if (values.heartRate >= 70) value += 9;
        else if (values.heartRate >= 50) value += 3;

        // Systolic blood preasure
        if (values.systolicBP < 80) value += 58;
        else if (values.systolicBP < 100) value += 53;
        else if (values.systolicBP < 120) value += 43;
        else if (values.systolicBP < 140) value += 34;
        else if (values.systolicBP < 160) value += 24;
        else if (values.systolicBP < 200) value += 10;

        // creatinine
        if (values.creatinine < 35.36) value += 1;
        else if (values.creatinine <= 70.71) value += 4;
        else if (values.creatinine <= 106.07) value += 7;
        else if (values.creatinine <= 141.43) value += 10;
        else if (values.creatinine <= 176.7) value += 13;
        else if (values.creatinine <= 353) value += 21;
        else value += 28;

        // Killip
        switch (values.killip) {
            case 2:
                value += 20;
                break;
            case 3:
                value += 39;
                break;
            case 4:
                value += 59;
                break;
        }

        // other
        value += values.cardiacArrest ? 39 : 0;
        value += values.segmentSTDeviation ? 28 : 0;
        value += values.elevatedCardiacEnzymes ? 14 : 0;

        return {
            value,
            additionalValues: {
                raiseST: {
                    inHospital: this.calcRisk(value, true, true),
                    sixMonth: this.calcRisk(value, true, false)
                },
                noRaiseST: {
                    inHospital: this.calcRisk(value, false, true),
                    sixMonth: this.calcRisk(value, false, false)
                }
            }
        };
    }
}
