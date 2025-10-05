import { Request, Response } from 'express'
import { DashboardTypeormService } from '../services/dashboard-typeorm.service'
import HTTP_STATUS from '../constants/httpStatus'

export class DashboardController {
  private dashboardService: DashboardTypeormService

  constructor() {
    this.dashboardService = new DashboardTypeormService()
  }

  // Get basic dashboard statistics
  getDashboardStats = async (req: Request, res: Response): Promise<Response> => {
    const statistics = await this.dashboardService.getDashboardStatistics()

    return res.status(HTTP_STATUS.OK).json({
      message: 'Dashboard statistics retrieved successfully',
      result: statistics
    })
  }

  // Get detailed dashboard statistics with additional data
  getDetailedDashboardStats = async (req: Request, res: Response): Promise<Response> => {
    const detailedStats = await this.dashboardService.getDetailedStatistics()

    return res.status(HTTP_STATUS.OK).json({
      message: 'Detailed dashboard statistics retrieved successfully',
      data: detailedStats
    })
  }

  // Refresh dashboard statistics (force recalculation)
  refreshDashboardStats = async (req: Request, res: Response): Promise<Response> => {
    const refreshedStats = await this.dashboardService.refreshStatistics()

    return res.status(HTTP_STATUS.OK).json({
      message: 'Dashboard statistics refreshed successfully',
      result: refreshedStats
    })
  }
}
