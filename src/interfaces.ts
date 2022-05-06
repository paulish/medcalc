export type ValueType = number | boolean;

export interface BaseValues {
    [key: string]: ValueType
}

export enum RiskLevel {
    Low = 0,
    Moderate = 1,
    High = 2,
    Critical = 3
}

export enum Gender {
    Male = 0,
    Female = 1
}

export enum ConsciousnessLevel {
    Clear = 0,
    ModerateStun = 1,
    DeepStun = 2,
    Sopor = 3,
    Coma1Degree = 4,
    Coma2Degree = 5,
    Coma3Degree = 6
}

export interface CalculationResult {
    /**
     * calculation result value
     */
    value: ValueType;
    /**
     * additional result values
     */
    additionalValues?: { [key: string]: any };
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
