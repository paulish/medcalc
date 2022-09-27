import {
    BaseValues, CalculationResult, Calculator, RiskLevel
} from '../interfaces';

export interface News2Values extends BaseValues {
    /**
     * bpm
     */
    respiratoryRate: number;
    /**
     * %
     */
    spO2: number;
    /**
     * yes / no
     */
    supplementalO2: boolean;
    /**
     * mmHg
     */
    systolicBP: number;
    /**
     * bpm
     */
    heartRate: number;
    /**
     * С
     */
    temperature: number;
    /**
     * Glasgow coma score
     */
    glazgow: number;
}

export interface News2CalculationResult extends CalculationResult {
    additionalValues: {
        /**
         * hours
         */
        monitoringFrequency: number;
    }
}

interface New2Risk {
    riskLevel: RiskLevel | undefined;
    monitoringFrequency: number;
}

/**
 * National Early Warning Score
 */
export class News2 implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 300
        };
    }

    private getRisk(value: number, isHigh: boolean): New2Risk {
        // Result interpretation
        if (value >= 7 || isHigh) {
            return {
                riskLevel: RiskLevel.High,
                monitoringFrequency: 0
            };
        }
        if (value >= 5) return { riskLevel: RiskLevel.Moderate, monitoringFrequency: 1 };
        if (value >= 1) return { riskLevel: RiskLevel.Low, monitoringFrequency: 6 };
        return { riskLevel: undefined, monitoringFrequency: 12 };
    }

    calculate(values: News2Values): CalculationResult {
        let value = 0;
        let isHigh = false;

        if (values.respiratoryRate <= 8) {
            value += 3;
            isHigh = true;
        } else if (values.respiratoryRate <= 11) value += 1;
        else if (values.respiratoryRate >= 21 && values.respiratoryRate <= 24) value += 2;
        else if (values.respiratoryRate >= 25) {
            value += 3;
            isHigh = true;
        }

        if (values.supplementalO2) value += 2;

        if (values.spO2 <= 91) {
            value += 3;
            isHigh = true;
        } else if (values.spO2 <= 93) value += 2;
        else if (values.spO2 <= 95) value += 1;

        if (values.temperature <= 35) {
            value += 3;
            isHigh = true;
        } else if (values.temperature <= 36) value += 1;
        else if (values.temperature > 38 && values.temperature <= 39) value += 1;
        else if (values.temperature > 39) value += 2;

        if (values.systolicBP <= 90) {
            value += 3;
            isHigh = true;
        } else if (values.systolicBP <= 100) value += 2;
        else if (values.systolicBP <= 110) value += 1;
        else if (values.systolicBP >= 220) {
            value += 3;
            isHigh = true;
        }

        if (values.heartRate <= 40) {
            value += 3;
            isHigh = true;
        } else if (values.heartRate <= 50) value += 1;
        else if (values.heartRate > 90 && values.heartRate <= 110) value += 1;
        else if (values.heartRate > 110 && values.heartRate <= 130) value += 2;
        else if (values.heartRate >= 131) {
            value += 3;
            isHigh = true;
        }

        if (values.glazgow < 15) {
            value += 3;
            isHigh = true;
        }

        const { riskLevel, monitoringFrequency } = this.getRisk(value, isHigh);

        return {
            value,
            riskLevel,
            additionalValues: {
                monitoringFrequency
            }
        };
    }
}
