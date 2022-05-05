The goal of the project is to gather different medical calculators and provide a simple programming interface to work with them on javascipt and typescript.

All calculators implement the following interface
```typescript
interface Calculator {
    readonly meta: CalculatorMeta;
    calculate(values: BaseValues): CalculationResult;
}
```

Where `meta` returns the base meta information about the calculator and `calculate()` performs the actual result calculation.

At the moment the following calculators are implemented:
* Bmi - Body Mass Index
* Sofa - Sequential Organ Failure Assessment (SOFA) severity of illness score for hospital mortality
* Saps2 - Simplified Acute Physiology Score (SAPS) II calculator to predict hospital mortality

