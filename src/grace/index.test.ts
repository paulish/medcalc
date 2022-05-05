import { Grace } from '.';
import { RiskLevel } from '../interfaces';

describe('Sofa', () => {
    test('test1', () => {
        const grace = new Grace();
        const result = grace.calculate({
            age: 45,
            heartRate: 90,
            systolicBP: 120,
            creatinine: 100,
            killip: 1,
            cardiacArrest: false,
            elevatedCardiacEnzymes: false,
            segmentSTDeviation: false
        });

        expect(result.value).toBe(81);
        expect(result.additionalValues.raiseST.inHospital.riskLevel).toBe(RiskLevel.Low);
        expect(result.additionalValues.raiseST.inHospital.mortality).toBe('< 2%');
    });
});
