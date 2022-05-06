import { Smrtco } from '.';
import { ConsciousnessLevel, RiskLevel } from '../interfaces';

describe('SMRT-CO', () => {
    test('test1', () => {
        const calc = new Smrtco();
        const result = calc.calculate({
            age: 60,
            fiO2: 60,
            paO2: 90,
            multipleLobesInvolvedOnChestXray: false,
            systolicBP: 140,
            respiratoryRate: 20,
            heartRate: 60,
            consciousnessLevel: ConsciousnessLevel.Clear,
            spO2: 92
        });
        expect(result.value).toBe(2);
        expect(result.riskLevel).toBe(RiskLevel.Moderate);
    });
});
