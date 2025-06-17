import { Router, Request, Response, NextFunction } from 'express'
import * as bmiController from '../controllers/bmiController'

const router = Router({ mergeParams: true })

// POST /api/bmi - Calculate and save BMI
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await bmiController.calculateAndSaveBMI(req, res, next)
})

// GET /api/bmi - Get BMI history
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await bmiController.getBMIHistory(req, res, next)
})

// GET /api/bmi/latest - Get latest BMI record
router.get('/latest', async (req: Request, res: Response, next: NextFunction) => {
  await bmiController.getLatestBMI(req, res, next)
})

// POST /api/bmi/calculate - Calculate BMI only (without saving)
router.post('/calculate', async (req: Request, res: Response, next: NextFunction) => {
  await bmiController.calculateBMIOnly(req, res, next)
})

export default router