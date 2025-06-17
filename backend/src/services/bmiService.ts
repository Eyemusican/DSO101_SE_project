import knex from 'knex'
import { databaseConfig } from '../config'

const db = knex(databaseConfig)

export interface BMIData {
  id?: number
  user_id?: string
  height: number
  weight: number
  age: number
  bmi_value?: number
  bmi_category?: string
  created_at?: Date
  updated_at?: Date
}

export interface BMICalculationResult {
  bmi: number
  category: string
}

export const calculateBMI = (height: number, weight: number): BMICalculationResult => {
  // Height should be in meters, weight in kg
  const heightInMeters = height / 100 // Convert cm to meters
  const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2))
  
  let category: string
  if (bmi < 18.5) {
    category = 'Underweight'
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight'
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight'
  } else {
    category = 'Obese'
  }
  
  return { bmi, category }
}

export const saveBMIRecord = async (bmiData: BMIData): Promise<BMIData> => {
  try {
    const { bmi, category } = calculateBMI(bmiData.height, bmiData.weight)
    
    const recordToSave = {
      user_id: bmiData.user_id || 'anonymous',
      height: bmiData.height,
      weight: bmiData.weight,
      age: bmiData.age,
      bmi_value: bmi,
      bmi_category: category,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const [savedRecord] = await db('bmi_records').insert(recordToSave).returning('*')
    return savedRecord
  } catch (error) {
    console.error('Error saving BMI record:', error)
    throw new Error('Failed to save BMI record')
  }
}

export const getBMIRecords = async (userId: string = 'anonymous', limit: number = 10): Promise<BMIData[]> => {
  try {
    const records = await db('bmi_records')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
    return records
  } catch (error) {
    console.error('Error fetching BMI records:', error)
    throw new Error('Failed to fetch BMI records')
  }
}

export const getLatestBMIRecord = async (userId: string = 'anonymous'): Promise<BMIData | null> => {
  try {
    const record = await db('bmi_records')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .first()
    return record || null
  } catch (error) {
    console.error('Error fetching latest BMI record:', error)
    throw new Error('Failed to fetch latest BMI record')
  }
}