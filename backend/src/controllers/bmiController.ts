import { Request, Response, NextFunction } from 'express'
import * as bmiService from '../services/bmiService'
export const calculateAndSaveBMI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { height, weight, age, user_id } = req.body
    
    // Validation
    if (!height || !weight || !age) {
      return res.status(400).json({
        message: 'Height, weight, and age are required',
        errors: {
          height: !height ? 'Height is required' : null,
          weight: !weight ? 'Weight is required' : null,
          age: !age ? 'Age is required' : null
        }
      })
    }
    
    if (height <= 0 || weight <= 0 || age <= 0) {
      return res.status(400).json({
        message: 'Height, weight, and age must be positive numbers'
      })
    }
    
    const bmiData = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: parseInt(age),
      user_id: user_id || 'anonymous'
    }
    
    const savedRecord = await bmiService.saveBMIRecord(bmiData)
    
    res.status(201).json({
      message: 'BMI calculated and saved successfully',
      data: savedRecord
    })
  } catch (error) {
    next(error)
  }
}

export const getBMIHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.query
    const limit = parseInt(req.query.limit as string) || 10
    
    const records = await bmiService.getBMIRecords(user_id as string, limit)
    
    res.status(200).json({
      message: 'BMI records fetched successfully',
      data: records,
      count: records.length
    })
  } catch (error) {
    next(error)
  }
}

export const getLatestBMI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.query
    
    const record = await bmiService.getLatestBMIRecord(user_id as string)
    
    if (!record) {
      return res.status(404).json({
        message: 'No BMI records found'
      })
    }
    
    res.status(200).json({
      message: 'Latest BMI record fetched successfully',
      data: record
    })
  } catch (error) {
    next(error)
  }
}

export const calculateBMIOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { height, weight } = req.body
    
    if (!height || !weight) {
      return res.status(400).json({
        message: 'Height and weight are required'
      })
    }
    
    if (height <= 0 || weight <= 0) {
      return res.status(400).json({
        message: 'Height and weight must be positive numbers'
      })
    }
    
    const result = bmiService.calculateBMI(parseFloat(height), parseFloat(weight))
    
    res.status(200).json({
      message: 'BMI calculated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}
