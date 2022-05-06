import {
    BaseValues, CalculationResult, Calculator, RiskLevel
} from '../interfaces';

export interface BmiValues extends BaseValues {
    /**
     * centimeters
     */
    height: number;
    /**
     * kilograms
     */
    weight: number;
}

/**
 * WHO values for adults
 */
export enum BmiLevel {
    SevereThinness = 0,
    ModerateThinness = 1,
    MildThinness = 2,
    Normal = 3,
    Overweight = 4,
    ObeseClass1 = 5,
    ObeseClass2 = 6,
    ObeseClass3 = 7
}

export interface BmiCalculationResult extends CalculationResult {
    additionalValues: {
        level: BmiLevel
    }
}

/**
 * Body Mass Index
 */
export class Bmi implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 300
        };
    }

    private getRisk(value: number) {
        // Result interpretation
        if (value <= 16) {
            // < 16
            return { level: BmiLevel.SevereThinness, riskLevel: RiskLevel.Critical };
        }
        if (value <= 17) {
            // 16-17
            return { level: BmiLevel.ModerateThinness, riskLevel: RiskLevel.High };
        }
        if (value <= 18.5) {
            // 17-18.5
            return { level: BmiLevel.MildThinness, riskLevel: RiskLevel.Moderate };
        }
        if (value <= 25) {
            // 18.5-25
            return { level: BmiLevel.Normal, riskLevel: RiskLevel.Low };
        }
        if (value <= 30) {
            // 25-30
            return { level: BmiLevel.Overweight, riskLevel: RiskLevel.Moderate };
        }
        if (value <= 35) {
            // 30-35
            return { level: BmiLevel.ObeseClass1, riskLevel: RiskLevel.High };
        }
        if (value <= 40) {
            // 35-40
            return { level: BmiLevel.ObeseClass2, riskLevel: RiskLevel.Critical };
        }
        return { level: BmiLevel.ObeseClass3, riskLevel: RiskLevel.Critical };
    }

    calculate(values: BmiValues): BmiCalculationResult {
        const h = values.height / 100;
        const value = Math.round((values.weight * 100) / (h * h)) / 100;
        const risk = this.getRisk(value);
        return {
            value,
            additionalValues: {
                level: risk.level
            },
            riskLevel: risk.riskLevel
        };
    }
}
