import { PDAPT } from '.';
import { RiskLevel } from '../interfaces';

describe('PRECISE DAPT', () => {
    test('male', () => {
        const pdapt = new PDAPT();
        const result = pdapt.calculate({
            age: 45,
            creatinineClearance: 80,
            hemoglobin: 10,
            leukocytes: 20,
            priorBleeding: false
        });
        expect(result.value).toBe(34);
        expect(result.riskLevel).toBe(RiskLevel.High);
    });
});
