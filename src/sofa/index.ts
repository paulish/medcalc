import { BaseValues, CalculationResult, Calculator } from '../interfaces';

export enum SofaHypotension {
    /**
     * No hypotension
     */
    No = 0,
    /**
     * MAP < 70 mmHg
     */
    MapLess70 = 1,
    /**
     * Dopamine ≤ 5 or Dobutamine
     */
    Vasopressors1 = 2,
    /**
     * Dopamine > 5, Epinephrine ≤ 0.1, or Norepinephrine ≤ 0.1
     */
    Vasopressors2 = 3,
    /**
     * Dopamine > 15, Epinephrine > 0.1, or Norepinephrine > 0.1
     */
    Vasopressors3 = 4
}

interface SofaValuesBase extends BaseValues {
    /**
     * mmHg
     */
    pao2: number;
    /**
     * %
     */
    fio2: number;
    /**
     * On mechanical ventilation including CPAP
     */
    mechanicalVentilation: boolean;
    /**
     * 10^3/mm^3
     */
    platelets: number;
    /**
     * μmol/L
     */
    bilirubin: number;
    /**
     * Glasgow coma score
     */
    glazgow: number;
    hypotension: SofaHypotension;
}

interface SofaValuesWithCreatinine extends SofaValuesBase {
    /**
     * μmol/L
     */
    creatinine: number;
}

interface SofaValuesWithDiuresis extends SofaValuesBase {
    diuresis: number;
}

export type SofaValues = SofaValuesWithCreatinine | SofaValuesWithDiuresis;

export interface SofaCalculationResult extends CalculationResult {
    additionalValues: {
        /**
         * Respiratory system
         */
        resperatoryIndex: number;
        breath: number;
        /**
         * Coagulation
         */
        coagulation: number;
        /**
         * Liver
         */
        liver: number;
        /**
         * Renal function
         */
        renal: number;
        /**
         * Central nervous system
         */
        cns: number;
        /**
         * Cardiovascular system
         */
        cvs: number;
        /**
         * Glasgow coma score
         */
        glazgow: number;
    }
}

/**
 * Sequential Organ Failure Assessment (SOFA) severity of illness score for hospital mortality
 */
export class Sofa implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 24
        };
    }

    calculate(values: SofaValues): SofaCalculationResult {
        const result = {
            value: 0,
            additionalValues: {
                resperatoryIndex: Math.round((values.pao2 * 100) / values.fio2),
                breath: 0,
                coagulation: 0,
                liver: 0,
                renal: 0,
                cns: 0,
                cvs: 0,
                glazgow: 0
            }
        };

        // respiratory index
        if (result.additionalValues.resperatoryIndex < 100 && values.mechanicalVentilation) {
            result.additionalValues.breath = 4;
        } else if (result.additionalValues.resperatoryIndex < 200 && values.mechanicalVentilation) {
            result.additionalValues.breath = 3;
        } else if (result.additionalValues.resperatoryIndex < 300) {
            result.additionalValues.breath = 2;
        } else if (result.additionalValues.resperatoryIndex < 400) {
            result.additionalValues.breath = 1;
        }

        // platelets
        if (values.platelets < 20) result.additionalValues.coagulation = 4;
        else if (values.platelets < 50) result.additionalValues.coagulation = 3;
        else if (values.platelets < 100) result.additionalValues.coagulation = 2;
        else if (values.platelets < 150) result.additionalValues.coagulation = 1;

        // bilirubin
        if (values.bilirubin > 204) result.additionalValues.liver = 4;
        else if (values.bilirubin >= 102) result.additionalValues.liver = 3;
        else if (values.bilirubin >= 33) result.additionalValues.liver = 2;
        else if (values.bilirubin >= 20) result.additionalValues.liver = 1;

        if (values.creatinine) {
            // by creatinine
            if (values.creatinine > 440) result.additionalValues.renal = 4;
            else if (values.creatinine >= 300) result.additionalValues.renal = 3;
            else if (values.creatinine >= 171) result.additionalValues.renal = 2;
            else if (values.creatinine >= 110) result.additionalValues.renal = 1;
        } else if (values.diuresis < 0.2) result.additionalValues.renal = 4; // by diuresis
        else if (values.diuresis < 0.5) result.additionalValues.renal = 3;

        // glazgow
        result.additionalValues.glazgow = values.glazgow;
        if (values.glazgow < 6) result.additionalValues.cns = 4;
        else if (values.glazgow < 10) result.additionalValues.cns = 3;
        else if (values.glazgow < 13) result.additionalValues.cns = 2;
        else if (values.glazgow < 15) result.additionalValues.cns = 1;

        result.additionalValues.cvs = values.hypotension;

        result.value = result.additionalValues.breath
            + result.additionalValues.coagulation
            + result.additionalValues.liver
            + result.additionalValues.renal
            + result.additionalValues.cvs
            + result.additionalValues.cns;
        return result;
    }
}
