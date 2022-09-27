import { News2 } from '.';
import { RiskLevel } from '../interfaces';

describe('News2', () => {
    test('test1', () => {
        const c = new News2();
        const result = c.calculate({
            respiratoryRate: 9,
            spO2: 92,
            supplementalO2: true,
            systolicBP: 105,
            heartRate: 60,
            temperature: 37,
            glazgow: 15
        });
        expect(result.value).toBe(6);
        expect(result.riskLevel).toBe(RiskLevel.Moderate);
        expect(result.additionalValues?.monitoringFrequency).toBe(1);
    });
});
