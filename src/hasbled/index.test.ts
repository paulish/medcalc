import { HasBled } from '.';
import { RiskLevel } from '../interfaces';

describe('HasBled', () => {
    test('test1', () => {
        const hb = new HasBled();
        const result = hb.calculate({
            age: 45,
            systolicBP: 120,
            alcohol: true,
            bleeding: false,
            labile: false,
            liver: true,
            medication: false,
            renal: false,
            stroke: false
        });
        expect(result.value).toBe(2);
        expect(result.riskLevel).toBe(RiskLevel.Moderate);
    });
});
