// frontend/src/api/bmiService.ts
import { API_HOST } from '../constants/env'

export interface BMICalculationRequest {
  height: number
  weight: number
  age: number
  user_id?: string
}

export interface BMICalculationResponse {
  message: string
  data: {
    id: number
    height: number
    weight: number
    age: number
    bmi_value: number
    bmi_category: string
    user_id: string
    created_at: string
    updated_at: string
  }
}

export const calculateAndSaveBMI = async (data: BMICalculationRequest): Promise<BMICalculationResponse> => {
  // Since API_HOST is already 'http://localhost:5000/api', just add '/bmi'
  const url = `${API_HOST}/bmi`
  console.log('Calling URL:', url)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        user_id: data.user_id || 'anonymous'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('API Response:', result)
    return result
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export const getBMIHistory = async (userId: string = 'anonymous') => {
  const url = `${API_HOST}/bmi?user_id=${userId}`
  console.log('Calling URL:', url)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('API Response:', result)
    return result
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export const getLatestBMI = async (userId: string = 'anonymous') => {
  const url = `${API_HOST}/bmi/latest?user_id=${userId}`
  console.log('Calling URL:', url)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('API Response:', result)
    return result
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}