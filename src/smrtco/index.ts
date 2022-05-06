import {
    BaseValues, CalculationResult, Calculator, ConsciousnessLevel, RiskLevel
} from '../interfaces';

interface SmrtcoValuesBase extends BaseValues {
    /**
     * years
     */
    age: number;
    multipleLobesInvolvedOnChestXray: boolean;
    /**
     * mmHg
     */
    systolicBP: number;
    /**
     * bpm
     */
    heartRate: number;
    /**
     * bpm
     */
    respiratoryRate: number;
    /**
     * %
     */
    spO2: number;
    /**
     * Consciousness Level
     */
    consciousnessLevel: ConsciousnessLevel
}

interface SmrtcoValuesOI extends BaseValues {
    /**
     * mmHg
     */
    paO2: number;
    /**
     * %
     */
    fiO2: number
}

export type SmrtcoValues = SmrtcoValuesBase | (SmrtcoValuesBase & SmrtcoValuesOI);

export class Smrtco implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 8
        };
    }

    calculate(values: SmrtcoValues): CalculationResult {
        let value = 0;

        const paoFio = (values.paO2 && values.fiO2)
            ? (values.paO2 as number * 100) / (values.fiO2 as number)
            : 1000;

        if (values.systolicBP < 90) value += 2;
        if (values.multipleLobesInvolvedOnChestXray) value++;

        if (values.age <= 50) {
            if (values.respiratoryRate >= 25) value++;
            if (values.spO2 < 94 || paoFio < 333) value += 2;
        } else {
            if (values.respiratoryRate >= 30) value++;
            if (values.spO2 < 90 || paoFio < 250) value += 2;
        }
        if (values.heartRate >= 125) value++;
        if (values.consciousnessLevel > ConsciousnessLevel.Clear) value++;

        let riskLevel = RiskLevel.Low;
        if (value >= 4) riskLevel = RiskLevel.Critical;
        else if (value === 3) riskLevel = RiskLevel.High;
        else if (value === 2) riskLevel = RiskLevel.Moderate;

        return {
            value,
            riskLevel
        };
    }
}
