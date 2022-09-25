import {
    BaseValues, CalculationResult, Calculator, RiskLevel
} from '../interfaces';

export interface PDAPTValues extends BaseValues {
    /**
     * years
     */
    age: number;
    /**
     * g/L
     */
    hemoglobin: number;
    /**
     * 10⁹/L
     */
    leukocytes: number;
    /**
     * ml/min
     */
    creatinineClearance: number;
    priorBleeding: boolean;
}

/**
 * Precise DAPT
 */
export class PDAPT implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 100
        };
    }

    calculate(values: PDAPTValues): CalculationResult {
        let res = 0;

        if (values.hemoglobin <= 10) res += 14;
        else if (values.hemoglobin <= 10.5) res += 10;
        else if (values.hemoglobin <= 11) res += 6 + 8 * (11 - values.hemoglobin);
        else if (values.hemoglobin <= 12) res += 6 * (12 - values.hemoglobin);

        if (values.leukocytes >= 20) res += 15;
        else if (values.leukocytes >= 18) res += 13 + (values.leukocytes - 18);
        else if (values.leukocytes >= 8) res += 2 + (values.leukocytes - 8) * (11 / 10);
        else if (values.leukocytes >= 5) res += (values.leukocytes - 5) * (2 / 3);

        if (values.age >= 90) res += 19;
        else if (values.age >= 50) res += (19 / 40) * (values.age - 50);

        if (values.creatinineClearance <= 100) {
            res += (25 / 100) * (100 - values.creatinineClearance);
        }

        res += values.priorBleeding ? 26 : 0;

        const value = Math.round(res * 100) / 100;
        return {
            value,
            riskLevel: value >= 25 ? RiskLevel.High : RiskLevel.Low
        };
    }
}
