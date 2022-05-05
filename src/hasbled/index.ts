import {
    BaseValues, CalculationResult,
    Calculator, RiskLevel
} from '../interfaces';

export interface HasBledValues extends BaseValues {
    /**
     * years
     */
    age: number;
    /**
     * mmHg
     */
    systolicBP: number;
    liver: boolean;
    renal: boolean;
    stroke: boolean;
    bleeding: boolean;
    labile: boolean;
    alcohol: boolean;
    medication: boolean;
}

/**
 * The HAS-BLED (Hypertension, Abnormal Renal/Liver Function,
 * Stroke, Bleeding History or Predisposition, Labile INR,
 * Elderly, Drugs/Alcohol Concomitantly) Score
 */
export class HasBled implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 9
        };
    }

    private calcRisk(value: number) {
        if (value >= 3) return RiskLevel.High;
        if (value === 2) return RiskLevel.Average;
        return RiskLevel.Low;
    }

    calculate(values: HasBledValues): CalculationResult {
        let value = 0;

        // age
        if (values.age > 65) value++;
        // hypertension
        if (values.systolicBP > 160) value++;

        // other
        value += values.liver ? 1 : 0;
        value += values.renal ? 1 : 0;
        value += values.stroke ? 1 : 0;
        value += values.bleeding ? 1 : 0;
        value += values.labile ? 1 : 0;
        value += values.alcohol ? 1 : 0;
        value += values.medication ? 1 : 0;

        return {
            value,
            riskLevel: this.calcRisk(value)
        };
    }
}
