import {
    BaseValues, CalculationResult, Calculator, Gender, RiskLevel
} from '../interfaces';

export interface Cha2Ds2VascValues extends BaseValues {
    /**
     * Congestive heart failure (or Left ventricular systolic dysfunction)
     */
    congestive: boolean;
    /**
     * Hypertension: blood pressure consistently above 140/90 mmHg
     * (or treated hypertension on medication)
     */
    hypertension: boolean;
    /**
     * Age in years
     */
    age: number;
    /**
     * Diabetes Mellitus
     */
    diabetes: boolean;
    /**
     * Prior Stroke or TIA or thromboembolism
     */
    stroke: boolean;
    /**
     *  Vascular disease (e.g. peripheral artery disease, myocardial infarction, aortic plaque)
     */
    vascular: boolean;
    /**
     * sex category
     */
    gender: Gender;
}

export interface Cha2Ds2VascCalculationResult extends CalculationResult {
    additionalValues: {
        /**
         * Expected frequency of strokes per year percent
         */
        percent: number;
    }
}

/**
 * CHA2DS2VASc
 */
export class Cha2Ds2Vasc implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 9
        };
    }

    calculate(values: Cha2Ds2VascValues): Cha2Ds2VascCalculationResult {
        let value = 0;

        // age
        if (values.age >= 75) value += 2;
        else if (values.age >= 65) value += 1;

        if (values.gender === Gender.Female) {
            value++;
        }

        value += values.stroke ? 2 : 0;
        value += values.hypertension ? 1 : 0;
        value += values.diabetes ? 1 : 0;
        value += values.congestive ? 1 : 0;
        value += values.vascular ? 1 : 0;

        // Expected frequency of strokes per year percent
        const percent = [0, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 5.2][value];

        let riskLevel = RiskLevel.Low;
        if (value >= 2) riskLevel = RiskLevel.High;
        else if (value === 1) riskLevel = RiskLevel.Moderate;

        return {
            value,
            additionalValues: {
                percent
            },
            riskLevel
        };
    }
}
