import {
    BaseValues, CalculationResult, Calculator, Gender
} from '../interfaces';

export enum ActivityLevel {
    Bmr = 0,
    Sedentary = 1,
    Light = 2,
    Moderate = 3,
    Intensive = 4,
    Everyday = 5,
    EverydayIntensive = 6,
    Hard = 7
}

export interface CalorieValues extends BaseValues {
    /**
     * years
     */
    age: number;
    /**
     * male / female
     */
    gender: Gender;
    /**
     * centimeters
     */
    height: number;
    /**
     * kilograms
     */
    weight: number;
    activityLevel: ActivityLevel;
}

const ActivityMultiplier = {
    [ActivityLevel.Bmr]: 1,
    [ActivityLevel.Sedentary]: 1.2,
    [ActivityLevel.Light]: 1.375,
    [ActivityLevel.Moderate]: 1.4625,
    [ActivityLevel.Intensive]: 1.550,
    [ActivityLevel.Everyday]: 1.6375,
    [ActivityLevel.EverydayIntensive]: 1.725,
    [ActivityLevel.Hard]: 1.9
};

export interface CalorieCalculationResult extends CalculationResult {
    additionalValues: {
        HarrisBenedict: number;
        MiffinJeor: number;
        TomVenuto: number;
    }
}

/**
 * The number of calories a person needs to consume each day
 */
export class Calorie implements Calculator {
    get meta() {
        return {
            minValue: 0,
            maxValue: 300
        };
    }

    calculate(values: CalorieValues): CalorieCalculationResult {
        const HarrisBenedict = values.gender === Gender.Male
            ? 66.5 + (13.75 * values.weight) + (5.003 * values.height) - (6.775 * values.age)
            : 655.1 + (9.563 * values.weight) + (1.85 * values.height) - (4.676 * values.age);
        const MiffinJeor = values.gender === Gender.Male
            ? 10 * values.weight + 6.25 * values.height - 5 * values.age + 5
            : 10 * values.weight + 6.25 * values.height - 5 * values.age - 161;
        const TomVenuto = values.gender === Gender.Male
            ? 66 + (13.7 * values.weight) + (5 * values.height) - (6.8 * values.age)
            : 665 + (9.6 * values.weight) + (1.8 * values.height) - (4.7 * values.age);

        const multiplier = ActivityMultiplier[values.activityLevel];

        return {
            value: 0,
            additionalValues: {
                HarrisBenedict: Math.round(HarrisBenedict * multiplier),
                MiffinJeor: Math.round(MiffinJeor * multiplier),
                TomVenuto: Math.round(TomVenuto * multiplier)
            }
        };
    }
}
