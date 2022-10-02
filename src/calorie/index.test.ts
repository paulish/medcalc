import { ActivityLevel, Calorie } from '.';
import { Gender } from '../interfaces';

describe('Calorie', () => {
    test('first', () => {
        const calorie = new Calorie();
        const result = calorie.calculate({
            age: 42,
            gender: Gender.Male,
            height: 170,
            weight: 72,
            activityLevel: ActivityLevel.Sedentary
        });
        expect(result.additionalValues.HarrisBenedict).toBe(1947);
        expect(result.additionalValues.MiffinJeor).toBe(1893);
        expect(result.additionalValues.TomVenuto).toBe(1940);
    });
});
