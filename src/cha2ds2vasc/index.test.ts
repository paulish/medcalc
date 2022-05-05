import { Cha2Ds2Vasc } from '.';
import { Gender, RiskLevel } from '../interfaces';

describe('CHA2DS2VACs', () => {
    test('male', () => {
        const calc = new Cha2Ds2Vasc();
        const result = calc.calculate({
            age: 65,
            gender: Gender.Female,
            congestive: true,
            diabetes: false,
            hypertension: true,
            stroke: true,
            vascular: false
        });
        expect(result.value).toBe(6);
        expect(result.additionalValues.percent).toBe(9.8);
        expect(result.riskLevel).toBe(RiskLevel.High);
    });
});
