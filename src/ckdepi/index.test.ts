import { CkdEpi, CkdEpiRace, CkdStage } from '.';
import { Gender, RiskLevel } from '../interfaces';

describe('CKD-EPi', () => {
    test('male', () => {
        const ckdEpi = new CkdEpi();
        const result = ckdEpi.calculate({
            age: 45,
            gender: Gender.Male,
            race: CkdEpiRace.Other,
            creatinine: 100
        });
        expect(result.value).toBe(78);
        expect(result.additionalValues.stage).toBe(CkdStage.C2);
        expect(result.riskLevel).toBe(RiskLevel.Low);
    });
    test('female', () => {
        const ckdEpi = new CkdEpi();
        const result = ckdEpi.calculate({
            age: 45,
            gender: Gender.Female,
            race: CkdEpiRace.AfricanAmerican,
            creatinine: 120
        });
        expect(result.value).toBe(54);
        expect(result.additionalValues.stage).toBe(CkdStage.C3A);
        expect(result.riskLevel).toBe(RiskLevel.Average);
    });
});
