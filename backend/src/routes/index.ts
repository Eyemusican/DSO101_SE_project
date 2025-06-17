import { Router } from 'express'
import heartbeat from './heartbeat'
import uploads from './uploads'
import bmi from './bmi'  // Add this import
import bmiRoutes from './bmi'


const router = Router()

// Add your existing routes here
// router.use('/auth', authRoutes)
// router.use('/users', userRoutes)

// Add BMI routes
router.use('/bmi', bmiRoutes)
router.use(heartbeat)
router.use(uploads)
router.use('/bmi', bmi)

export default router