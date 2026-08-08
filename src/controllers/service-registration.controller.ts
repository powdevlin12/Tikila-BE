import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ServiceRegistrationServiceTypeORM } from '~/services/service-registration-typeorm.service'
import ExcelJS from 'exceljs'

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
      if (req.query.payment_status && typeof req.query.payment_status === 'string') {
        filters.payment_status = req.query.payment_status
        console.log('Received payment_status from query:', req.query.payment_status)
      }
      if (req.query.search && typeof req.query.search === 'string') {
        filters.search = req.query.search
        console.log('Received search from query:', req.query.search)
      }

      console.log('Controller filters:', filters)

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

  async extendServiceRegistration(req: Request, res: Response) {
    const { id } = req.params
    const registration = await ServiceRegistrationServiceTypeORM.extendServiceRegistration(id, req.body)

    return res.status(200).json({
      success: true,
      message: 'Gia hạn đăng ký dịch vụ thành công',
      data: registration
    })
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

  // Export all service registrations to an Excel file
  async exportServiceRegistrations(req: Request, res: Response) {
    try {
      const registrations = await ServiceRegistrationServiceTypeORM.getAllForExport()

      // Map id -> customer_name để resolve cột "Thuộc về" mà không cần query thêm
      const nameById = new Map<string, string>()
      registrations.forEach((item) => nameById.set(item.id, item.customer_name))

      console.dir({
        registrations
      })

      const statusLabel = (status: string) => {
        if (status === 'active') return 'Đang hoạt động'
        if (status === 'cancelled') return 'Đã hủy'
        return status
      }

      const parentLabel = (parentId: string) => {
        if (!parentId) return 'Doanh nghiệp chính'
        return nameById.get(parentId) || 'Không tìm thấy'
      }

      const now = Date.now()
      const daysLeft = (endDate: Date) => {
        if (!endDate) return 0
        return Math.ceil((new Date(endDate).getTime() - now) / (1000 * 60 * 60 * 24))
      }

      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('Đăng ký dịch vụ', {
        views: [{ state: 'frozen', ySplit: 1 }]
      })

      sheet.columns = [
        { header: 'Tên khách hàng', key: 'customer_name', width: 28 },
        { header: 'Thuộc về', key: 'parent_name', width: 24 },
        { header: 'Số điện thoại', key: 'phone', width: 16 },
        { header: 'Địa chỉ', key: 'address', width: 36 },
        { header: 'Ghi chú', key: 'notes', width: 36 },
        { header: 'Ngày đăng ký', key: 'registration_date', width: 14, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Số tháng', key: 'duration_months', width: 10 },
        { header: 'Ngày kết thúc', key: 'end_date', width: 14, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Số ngày còn lại', key: 'days_left', width: 15 },
        { header: 'Trạng thái', key: 'status', width: 16 },
        { header: 'Tiền phải trả', key: 'amount_due', width: 16, style: { numFmt: '#,##0' } },
        { header: 'Đã thanh toán', key: 'amount_paid', width: 16, style: { numFmt: '#,##0' } },
        { header: 'Còn thiếu', key: 'amount_remaining', width: 16, style: { numFmt: '#,##0' } },
        { header: 'Ngày tạo', key: 'created_at', width: 14, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Cập nhật cuối', key: 'updated_at', width: 14, style: { numFmt: 'dd/mm/yyyy' } }
      ]

      sheet.getRow(1).font = { bold: true }

      registrations.forEach((item) => {
        // amount_paid / amount_due là cột decimal -> TypeORM trả về string, phải ép Number
        const amountDue = Number(item.amount_due) || 0
        const amountPaid = Number(item.amount_paid) || 0

        sheet.addRow({
          customer_name: item.customer_name,
          parent_name: parentLabel(item.parent_id),
          phone: item.phone,
          address: item.address,
          notes: item.notes,
          registration_date: item.registrationDate,
          duration_months: item.duration_months,
          end_date: item.end_date,
          days_left: daysLeft(item.end_date),
          status: statusLabel(item.status),
          amount_due: amountDue,
          amount_paid: amountPaid,
          amount_remaining: amountDue - amountPaid,
          created_at: item.createdAt,
          updated_at: item.updatedAt
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename="dang-ky-dich-vu.xlsx"')
      return res.status(200).send(Buffer.from(buffer))
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xuất dữ liệu đăng ký dịch vụ',
        error: error.message
      })
    }
  }
}

export default new ServiceRegistrationController()
