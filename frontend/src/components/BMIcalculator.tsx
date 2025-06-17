import React, { useState } from 'react';
import '../styles.scss';
import { calculateAndSaveBMI } from '../api/bmiService';

interface BMIData {
  height: number;
  weight: number;
  age: number;
  bmi: number;
  category: string;
}

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [result, setResult] = useState<BMIData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<string>('');

  // Local BMI calculation as fallback
  const calculateBMILocally = (heightCm: number, weightKg: number): { bmi: number; category: string } => {
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(2));

    let category: string;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    return { bmi, category };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setBackendStatus('');

    // Input validation
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);

    if (!height || !weight || !age) {
      setError('Please fill in all fields');
      return;
    }

    if (heightNum <= 0 || weightNum <= 0 || ageNum <= 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    if (heightNum < 50 || heightNum > 300) {
      setError('Height should be between 50-300 cm');
      return;
    }

    if (weightNum < 10 || weightNum > 500) {
      setError('Weight should be between 10-500 kg');
      return;
    }

    if (ageNum < 1 || ageNum > 120) {
      setError('Age should be between 1-120 years');
      return;
    }

    setLoading(true);

    try {
      // Try to save to backend first
      const response = await calculateAndSaveBMI({
        height: heightNum,
        weight: weightNum,
        age: ageNum,
        user_id: 'anonymous'
      });

      // Use backend response
      const bmiData: BMIData = {
        height: response.data.height,
        weight: response.data.weight,
        age: response.data.age,
        bmi: response.data.bmi_value,
        category: response.data.bmi_category
      };

      setResult(bmiData);
      setBackendStatus('✅ Data saved to database successfully!');
      console.log('BMI saved to database:', response);

    } catch (error) {
      console.error('Backend error:', error);
      
      // Fallback to local calculation if backend fails
      const localResult = calculateBMILocally(heightNum, weightNum);
      const bmiData: BMIData = {
        height: heightNum,
        weight: weightNum,
        age: ageNum,
        bmi: localResult.bmi,
        category: localResult.category
      };
      
      setResult(bmiData);
      setBackendStatus('⚠️ Using local calculation (backend unavailable)');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setResult(null);
    setError('');
    setBackendStatus('');
  };

  return (
    <div className="bmi-calculator-container">
      <div className="bmi-calculator-card">
        <h2>BMI Calculator</h2>
        <p>Calculate your Body Mass Index</p>
        
        <form onSubmit={handleSubmit} className="bmi-form">
          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in centimeters"
              min="1"
              max="300"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kilograms"
              min="1"
              max="500"
              step="0.1"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="age">Age (years)</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="1"
              max="120"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" disabled={loading} className="calculate-btn">
              {loading ? 'Calculating...' : 'Calculate BMI'}
            </button>
            <button type="button" onClick={resetForm} className="reset-btn">
              Reset
            </button>
          </div>
        </form>

        {backendStatus && (
          <div className={`status-message ${backendStatus.includes('✅') ? 'success' : 'warning'}`}>
            {backendStatus}
          </div>
        )}

        {result && (
          <div className="bmi-result">
            <h3>Your BMI Result</h3>
            <div className="result-details">
              <div className="bmi-value">
                <span className="label">BMI:</span>
                <span className={`value ${result.category.toLowerCase().replace(' ', '-')}`}>
                  {result.bmi}
                </span>
              </div>
              <div className="bmi-category">
                <span className="label">Category:</span>
                <span className={`category ${result.category.toLowerCase().replace(' ', '-')}`}>
                  {result.category}
                </span>
              </div>
              <div className="input-summary">
                <p>Height: {result.height} cm | Weight: {result.weight} kg | Age: {result.age} years</p>
              </div>
            </div>

            <div className="bmi-info">
              <h4>BMI Categories:</h4>
              <ul>
                <li><span className="underweight">Underweight:</span> Less than 18.5</li>
                <li><span className="normal-weight">Normal weight:</span> 18.5 - 24.9</li>
                <li><span className="overweight">Overweight:</span> 25 - 29.9</li>
                <li><span className="obese">Obese:</span> 30 or greater</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;