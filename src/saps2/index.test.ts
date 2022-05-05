import { Saps2, Saps2Admission, Saps2Disesases } from '.';

describe('Saps2', () => {
    test('test1', () => {
        const saps2 = new Saps2();
        const result = saps2.calculate({
            age: 45,
            mechanicalVentilation: true,
            fio2: 90,
            pao2: 85,
            heartRate: 70,
            systolicBP: 120,
            temperature: 37,
            glazgow: 9,
            diuresis: 1,
            urea: 12,
            sodium: 100,
            potassium: 4,
            bicarbonate: 80,
            bilirubin: 33,
            leukocyte: 25,
            admissionType: Saps2Admission.Medical,
            chronicDiseases: Saps2Disesases.No
        });
        expect(result.value).toBe(45);
        expect(Math.round(result.additionalValues.mortality * 100)).toBe(35);
    });
});
