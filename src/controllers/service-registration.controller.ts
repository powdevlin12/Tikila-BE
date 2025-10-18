import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ServiceRegistrationServiceTypeORM } from '~/services/service-registration-typeorm.service'

interface CreateServiceRegistrationBody {
  customer_name: string
  phone: string
  address?: string
  notes?: string
  duration_months: number
}

interface UpdateServiceRegistrationBody {
  customer_name?: string
  phone?: string
  address?: string
  notes?: string
  duration_months?: number
  status?: string
}

interface FilterQuery {
  status?: string
  expiring_in_days?: string
  start_date?: string
  end_date?: string
  page?: string
  limit?: string
}

export class ServiceRegistrationController {
  // Get all service registrations with filters
  async getServiceRegistrations(req: Request, res: Response) {
    try {
      const filters: any = {}

      if (req.query.status && typeof req.query.status === 'string') filters.status = req.query.status
      if (req.query.expiring_in_days && typeof req.query.expiring_in_days === 'string')
        filters.expiring_in_days = parseInt(req.query.expiring_in_days)
      if (req.query.start_date && typeof req.query.start_date === 'string')
        filters.start_date = new Date(req.query.start_date)
      if (req.query.end_date && typeof req.query.end_date === 'string') filters.end_date = new Date(req.query.end_date)
      if (req.query.page && typeof req.query.page === 'string') filters.page = parseInt(req.query.page)
      if (req.query.limit && typeof req.query.limit === 'string') filters.limit = parseInt(req.query.limit)

      const result = await ServiceRegistrationServiceTypeORM.getServiceRegistrations(filters)

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách đăng ký dịch vụ thành công',
        data: result
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đăng ký dịch vụ',
        error: error.message
      })
    }
  }

  // Get service registration by ID
  async getServiceRegistrationById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const registration = await ServiceRegistrationServiceTypeORM.getServiceRegistrationById(id)

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin đăng ký dịch vụ thành công',
        data: registration
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin đăng ký dịch vụ',
        error: error.message
      })
    }
  }

  // Create new service registration
  async createServiceRegistration(req: Request, res: Response) {
    try {
      const registration = await ServiceRegistrationServiceTypeORM.createServiceRegistration(req.body)

      return res.status(200).json({
        success: true,
        message: 'Tạo đăng ký dịch vụ thành công',
        data: registration
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đăng ký dịch vụ',
        error: error.message
      })
    }
  }

  // Update service registration
  async updateServiceRegistration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const registration = await ServiceRegistrationServiceTypeORM.updateServiceRegistration(id, req.body)

      return res.status(200).json({
        success: true,
        message: 'Cập nhật đăng ký dịch vụ thành công',
        data: registration
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật đăng ký dịch vụ',
        error: error.message
      })
    }
  }

  // Delete service registration (soft delete)
  async deleteServiceRegistration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const registration = await ServiceRegistrationServiceTypeORM.deleteServiceRegistration(id)

      return res.status(200).json({
        success: true,
        message: 'Xóa đăng ký dịch vụ thành công',
        data: registration
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa đăng ký dịch vụ',
        error: error.message
      })
    }
  }

  // Permanent delete service registration
  async permanentDeleteServiceRegistration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await ServiceRegistrationServiceTypeORM.permanentDeleteServiceRegistration(id)

      return res.status(200).json({
        success: true,
        message: 'Xóa vĩnh viễn đăng ký dịch vụ thành công',
        data: result
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa vĩnh viễn đăng ký dịch vụ',
        error: error.message
      })
    }
  }

  // Get registrations expiring soon
  async getExpiringSoon(req: Request, res: Response) {
    try {
      const days = req.query.days && typeof req.query.days === 'string' ? parseInt(req.query.days) : 30
      const result = await ServiceRegistrationServiceTypeORM.getExpiringSoon(days)

      return res.status(200).json({
        success: true,
        message: `Lấy danh sách đăng ký sắp hết hạn trong ${days} ngày thành công`,
        data: result
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đăng ký sắp hết hạn',
        error: error.message
      })
    }
  }

  // Get expired registrations
  async getExpiredRegistrations(req: Request, res: Response) {
    try {
      const expired = await ServiceRegistrationServiceTypeORM.getExpiredRegistrations()

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách đăng ký đã hết hạn thành công',
        data: expired
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đăng ký đã hết hạn',
        error: error.message
      })
    }
  }

  // Update expired registrations status
  async updateExpiredRegistrations(req: Request, res: Response) {
    try {
      const result = await ServiceRegistrationServiceTypeORM.updateExpiredRegistrations()

      return res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái đăng ký hết hạn thành công',
        data: result
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái đăng ký hết hạn',
        error: error.message
      })
    }
  }

  // Get statistics
  async getStatistics(req: Request, res: Response) {
    try {
      const stats = await ServiceRegistrationServiceTypeORM.getStatistics()

      return res.status(200).json({
        success: true,
        message: 'Lấy thống kê đăng ký dịch vụ thành công',
        data: stats
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê đăng ký dịch vụ',
        error: error.message
      })
    }
  }
}

export default new ServiceRegistrationController()
