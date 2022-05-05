import { Bmi, BmiLevel } from '.';
import { RiskLevel } from '../interfaces';

describe('Bmi', () => {
    test('normal', () => {
        const bmi = new Bmi();
        const result = bmi.calculate({
            height: 170,
            weight: 70
        });
        expect(result.value).toBe(24.22);
        expect(result.additionalValues.level).toBe(BmiLevel.Normal);
        expect(result.riskLevel).toBe(RiskLevel.Low);
    });

    test('obesse3', () => {
        const bmi = new Bmi();
        const result = bmi.calculate({
            height: 170,
            weight: 170
        });
        expect(result.value).toBe(58.82);
        expect(result.additionalValues.level).toBe(BmiLevel.ObeseClass3);
        expect(result.riskLevel).toBe(RiskLevel.Critical);
    });

    test('thinnes', () => {
        const bmi = new Bmi();
        const result = bmi.calculate({
            height: 170,
            weight: 45
        });
        expect(result.value).toBe(15.57);
        expect(result.additionalValues.level).toBe(BmiLevel.SevereThinness);
        expect(result.riskLevel).toBe(RiskLevel.Critical);
    });
});
