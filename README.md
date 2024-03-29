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
* Calorie - The number of calories a person needs to consume each day
* Sofa - Sequential Organ Failure Assessment (SOFA) severity of illness score for hospital mortality
* Saps2 - Simplified Acute Physiology Score (SAPS) II calculator to predict hospital mortality
* CkdEpi - Chronic kidney disease epidemiology collaboration (CKD-EPI) formula to estimate the glomerular filtration rate (GFR)
* Grace - Global Registry of Acute Coronary Events
* HasBled - HAS-BLED (Hypertension, Abnormal Renal/Liver Function, Stroke, Bleeding History or Predisposition, Labile INR, Elderly, Drugs/Alcohol Concomitantly) score
* Cha2Ds2Vasc - CHA2DS2VASc score are clinical prediction rules for estimating the risk of stroke in people with non-rheumatic atrial fibrillation (AF), a common and serious heart arrhythmia associated with thromboembolic stroke
* SMRT-CO - systolic blood pressure, multilobar chest radiography involvement, respiratory rate, tachycardia, confusion, and oxygenation
* Precise DAPT - The PRECISE-DAPT Risk Calculator was developed to predict the risk of bleeding in individual patients with coronary artery disease, treated with coronary stenting and subsequent dual antiplatelet therapy
* SCORE - Systematic COronary Risk Evaluation
* NEWS 2 - National Early Warning Score