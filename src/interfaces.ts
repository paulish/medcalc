export type ValueType = number | boolean;

export interface BaseValues {
    [key: string]: ValueType
}

export enum RiskLevel {
    Low = 0,
    Average = 1,
    High = 2,
    Critical = 3
}

export interface CalculationResult {
    /**
     * calculation result value
     */
    value: ValueType;
    /**
     * additional result values
     */
    additionalValues?: { [key: string]: ValueType };
    /**
     * risk grade (if applicable)
     */
    riskLevel?: RiskLevel;
}

export interface CalculatorMeta {
    /**
     * minimal result value
     */
    minValue: number;
    /**
     * maximal result value
     */
    maxValue: number;
}

export interface Calculator {
    readonly meta: CalculatorMeta;
    calculate(values: BaseValues): CalculationResult;
}
