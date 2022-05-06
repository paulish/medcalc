import { Sofa, SofaHypotension } from '.';

describe('Sofa', () => {
    test('test1', () => {
        const sofa = new Sofa();
        const result = sofa.calculate({
            fiO2: 90,
            paO2: 85,
            mechanicalVentilation: false,
            platelets: 25,
            glazgow: 9,
            bilirubin: 33,
            creatinine: 350,
            hypotension: SofaHypotension.Vasopressors1
        });
        expect(result.value).toBe(15);
    });
});
