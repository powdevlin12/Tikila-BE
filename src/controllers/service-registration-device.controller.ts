import { Request, Response } from 'express'
import { ServiceRegistrationDeviceServiceTypeORM } from '~/services/service-registration-device-typeorm.service'

export class ServiceRegistrationDeviceController {
  // Get all devices for a service registration
  async getDevicesByRegistration(req: Request, res: Response) {
    try {
      const { registrationId } = req.params
      const devices = await ServiceRegistrationDeviceServiceTypeORM.getDevicesByRegistrationId(registrationId)

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách máy thành công',
        data: devices
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách máy',
        error: error.message
      })
    }
  }

  // Get device by ID
  async getDeviceById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const device = await ServiceRegistrationDeviceServiceTypeORM.getDeviceById(id)

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin máy thành công',
        data: device
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin máy',
        error: error.message
      })
    }
  }

  // Create new device
  async createDevice(req: Request, res: Response) {
    try {
      const device = await ServiceRegistrationDeviceServiceTypeORM.createDevice(req.body)

      return res.status(200).json({
        success: true,
        message: 'Thêm máy thành công',
        data: device
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm máy',
        error: error.message
      })
    }
  }

  // Update device
  async updateDevice(req: Request, res: Response) {
    try {
      const { id } = req.params
      const device = await ServiceRegistrationDeviceServiceTypeORM.updateDevice(id, req.body)

      return res.status(200).json({
        success: true,
        message: 'Cập nhật máy thành công',
        data: device
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật máy',
        error: error.message
      })
    }
  }

  // Extend device
  async extendDevice(req: Request, res: Response) {
    try {
      const { id } = req.params
      const device = await ServiceRegistrationDeviceServiceTypeORM.extendDevice(id, req.body)

      return res.status(200).json({
        success: true,
        message: 'Gia hạn máy thành công',
        data: device
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi gia hạn máy',
        error: error.message
      })
    }
  }

  // Delete device (soft delete)
  async deleteDevice(req: Request, res: Response) {
    try {
      const { id } = req.params
      const device = await ServiceRegistrationDeviceServiceTypeORM.deleteDevice(id)

      return res.status(200).json({
        success: true,
        message: 'Xóa máy thành công',
        data: device
      })
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa máy',
        error: error.message
      })
    }
  }
}

export default new ServiceRegistrationDeviceController()
