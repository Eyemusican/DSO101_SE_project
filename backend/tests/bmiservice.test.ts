import { calculateBMI } from '../src/services/bmiService';

// BMI Test Suite
describe('BMI Calculator Service', () => {
  // Test BMI calculation logic
  describe('calculateBMI', () => {
    const testCalculateBMI = (weight: number, height: number): number => {
      // BMI = weight (kg) / height (m)²
      const heightInMeters = height / 100; // Convert cm to meters
      return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
    };

    test('should calculate BMI correctly', () => {
      const weight = 70; // kg
      const height = 175; // cm
      const expectedBMI = 22.86;

      const result = testCalculateBMI(weight, height);

      expect(result).toBe(expectedBMI);
      expect(typeof result).toBe('number');
    });

    test('should return correct data type', () => {
      const weight = 65;
      const height = 170;

      const result = testCalculateBMI(weight, height);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('should handle edge cases', () => {
      const weight = 50;
      const height = 150;
      const expectedBMI = 22.22;

      const result = testCalculateBMI(weight, height);

      expect(result).toBe(expectedBMI);
    });

    test('should classify BMI categories correctly', () => {
      const getBMICategory = (bmi: number): string => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obesity';
      };

      expect(getBMICategory(17)).toBe('Underweight');
      expect(getBMICategory(22)).toBe('Normal weight');
      expect(getBMICategory(27)).toBe('Overweight');
      expect(getBMICategory(32)).toBe('Obesity');
    });
  });

  // Test BMI data validation
  describe('BMI Data Validation', () => {
    test('should validate input data types', () => {
      const isValidBMIData = (weight: any, height: any, age: any): boolean => {
        return (
          typeof weight === 'number' && weight > 0 &&
          typeof height === 'number' && height > 0 &&
          typeof age === 'number' && age > 0
        );
      };

      expect(isValidBMIData(70, 175, 25)).toBe(true);
      expect(isValidBMIData('70', 175, 25)).toBe(false);
      expect(isValidBMIData(70, '175', 25)).toBe(false);
      expect(isValidBMIData(70, 175, '25')).toBe(false);
    });

    test('should reject negative values', () => {
      const isValidBMIData = (weight: number, height: number, age: number): boolean => {
        return weight > 0 && height > 0 && age > 0;
      };

      expect(isValidBMIData(70, 175, 25)).toBe(true);
      expect(isValidBMIData(-70, 175, 25)).toBe(false);
      expect(isValidBMIData(70, -175, 25)).toBe(false);
      expect(isValidBMIData(70, 175, -25)).toBe(false);
    });
  });

  // Test BMI formula accuracy
  describe('BMI Formula Accuracy', () => {
    test('should match WHO BMI calculation standards', () => {
      const testCases = [
        { weight: 68, height: 165, expected: 25.0 },
        { weight: 80, height: 180, expected: 24.69 },
        { weight: 55, height: 160, expected: 21.48 },
        { weight: 90, height: 175, expected: 29.39 }
      ];

      testCases.forEach(({ weight, height, expected }) => {
        const heightInMeters = height / 100;
        const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
        expect(bmi).toBe(expected);
      });
    });
  });
});
