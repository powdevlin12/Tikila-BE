import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.controller'
import { wrapRequestHandler } from '../utils/handlers'

const dashboardRouter = Router()
const dashboardController = new DashboardController()

// GET /dashboard/stats - Get basic dashboard statistics
dashboardRouter.get('/stats', wrapRequestHandler(dashboardController.getDashboardStats))

// GET /dashboard/detailed - Get detailed dashboard statistics
dashboardRouter.get('/detailed', wrapRequestHandler(dashboardController.getDetailedDashboardStats))

// POST /dashboard/refresh - Refresh dashboard statistics (force recalculation)
dashboardRouter.post('/refresh', wrapRequestHandler(dashboardController.refreshDashboardStats))

export default dashboardRouter
