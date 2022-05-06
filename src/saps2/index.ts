import { BaseValues, CalculationResult, Calculator } from '../interfaces';

export enum Saps2Disesases {
    No = 0,
    MetastaticCancer = 1,
    HematologicMalignancy = 2,
    AIDS = 3
}

export enum Saps2Admission {
    ScheduledSurgical = 0,
    Medical = 1,
    UnscheduledSurgical = 2
}

export interface Saps2Values extends BaseValues {
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
     * С
     */
    temperature: number;
    /**
     * Glasgow coma score
     */
    glazgow: number;
    /**
     * On mechanical ventilation including CPAP
     */
    mechanicalVentilation: boolean;
    /**
     * mmHg
     */
    paO2: number;
    /**
     * %
     */
    fiO2: number;
    /**
     * L/day
     */
    diuresis: number;
    /**
     * BUN
     */
    urea: number;
    /**
     * 10^9/L
     */
    leukocyte: number;
    /**
     * mEq/L
     */
    potassium: number;
    /**
     * mEq/L
     */
    sodium: number;
    /**
     * mEq/L
     */
    bicarbonate: number;
    /**
     * μmol/L
     */
    bilirubin: number;
    chronicDiseases: Saps2Disesases;
    admissionType: Saps2Admission;
}

export interface Saps2CalculationResult extends CalculationResult {
    additionalValues: {
        mortality: number
    }
}

/**
 * Simplified Acute Physiology Score (SAPS) II calculator to predict hospital mortality
 */
export class Saps2 implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 200
        };
    }

    calculate(values: Saps2Values): Saps2CalculationResult {
        let value = 0;

        // age
        if (values.age >= 80) value += 18;
        else if (values.age >= 75) value += 16;
        else if (values.age >= 70) value += 15;
        else if (values.age >= 60) value += 12;
        else if (values.age >= 40) value += 7;

        // hear rate
        if (values.heartRate < 40) value += 11;
        else if (values.heartRate < 60) value += 2;
        else if (values.heartRate >= 160) value += 7;
        else if (values.heartRate >= 120) value += 4;

        // BP
        if (values.systolicBP < 70) value += 13;
        else if (values.systolicBP < 100) value += 5;
        else if (values.systolicBP >= 200) value += 2;

        // temperature
        if (values.temperature >= 39) value += 3;

        // Oxygenation
        if (values.mechanicalVentilation) {
            const respIndex = Math.round((values.paO2 * 100) / values.fiO2);
            if (respIndex < 100) value += 11;
            else if (respIndex >= 200) value += 6;
            else value += 9;
        }

        // renal
        if (values.diuresis < 0.5) value += 11;
        else if (values.diuresis < 1) value += 4;

        if (values.urea >= 30) value += 10;
        else if (values.urea >= 10) value += 6;

        // glazgow
        if (values.glazgow < 6) value += 26;
        else if (values.glazgow < 9) value += 13;
        else if (values.glazgow < 11) value += 7;
        else if (values.glazgow < 14) value += 5;

        // chemistry
        if (values.leukocyte < 1) value += 12;
        else if (values.leukocyte >= 20) value += 3;

        if (values.potassium < 3) value += 3;
        else if (values.potassium >= 5) value += 3;

        if (values.sodium < 125) value += 5;
        else if (values.sodium >= 145) value += 1;

        if (values.bicarbonate < 15) value += 6;
        else if (values.bicarbonate < 20) value += 3;

        if (values.bilirubin >= 102.6) value += 9;
        else if (values.bilirubin >= 68.4) value += 4;

        // admission type
        switch (values.admissionType) {
            case Saps2Admission.Medical:
                value += 6;
                break;
            case Saps2Admission.UnscheduledSurgical:
                value += 8;
                break;
        }

        switch (values.chronicDiseases) {
            case Saps2Disesases.MetastaticCancer:
                value += 9;
                break;
            case Saps2Disesases.HematologicMalignancy:
                value += 10;
                break;
            case Saps2Disesases.AIDS:
                value += 17;
                break;
        }

        const logit = -7.7631 + 0.0737 * value + 0.9971 * Math.log(value + 1);
        const mortality = Math.exp(logit) / (1 + Math.exp(logit));

        return {
            value,
            additionalValues: {
                mortality
            }
        };
    }
}
