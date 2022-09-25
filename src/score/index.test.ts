import { Score } from '.';
import { Gender, RiskLevel } from '../interfaces';

describe('Score', () => {
    test('test1', () => {
        const score = new Score();
        const result = score.calculate({
            age: 45,
            systolicBP: 120,
            gender: Gender.Male,
            cholesterol: 10,
            smoker: false,
            highRiskCountry: true
        });

        expect(result.value).toBe(2.28);
        expect(result.riskLevel).toBe(RiskLevel.Moderate);
        expect(result.additionalValues.color).toBe('#ffff00');
    });
});
