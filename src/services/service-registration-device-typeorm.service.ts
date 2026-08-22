import { ServiceRegistrationDevice } from '~/entities'
import { generateId } from '~/utils/gererator'
import typeormService from './typeorm.service'

interface CreateServiceRegistrationDeviceBody {
  service_registration_id: string
  machine_name: string
  machine_code?: string
  duration_months: number
  amount_paid?: number
  amount_due?: number
  notes?: string
}

interface UpdateServiceRegistrationDeviceBody {
  machine_name?: string
  machine_code?: string
  duration_months?: number
  status?: string
  amount_paid?: number
  amount_due?: number
  notes?: string
}

interface ExtendServiceRegistrationDeviceBody {
  duration_months?: number
  amount_paid?: number
  amount_due?: number
}

export class ServiceRegistrationDeviceServiceTypeORM {
  // Get all devices belonging to one service registration
  static async getDevicesByRegistrationId(registrationId: string) {
    return await typeormService.serviceRegistrationDeviceRepository.find({
      where: { service_registration_id: registrationId },
      order: { createdAt: 'DESC' }
    })
  }

  // Get device by ID
  static async getDeviceById(id: string) {
    const device = await typeormService.serviceRegistrationDeviceRepository.findOne({
      where: { id }
    })

    if (!device) {
      throw new Error('Service registration device not found')
    }

    return device
  }

  // Create new device
  static async createDevice(data: CreateServiceRegistrationDeviceBody) {
    const device = new ServiceRegistrationDevice()
    device.id = generateId()
    device.service_registration_id = data.service_registration_id
    device.machine_name = data.machine_name
    device.machine_code = data.machine_code || ''
    device.duration_months = data.duration_months
    device.status = 'active'
    device.amount_paid = data.amount_paid || 0
    device.amount_due = data.amount_due || 0
    device.notes = data.notes || ''

    const registrationDate = new Date()
    device.registrationDate = registrationDate

    const endDate = new Date(registrationDate)
    endDate.setMonth(endDate.getMonth() + data.duration_months)
    device.end_date = endDate

    return await typeormService.serviceRegistrationDeviceRepository.save(device)
  }

  // Update device
  static async updateDevice(id: string, updateData: UpdateServiceRegistrationDeviceBody) {
    const device = await this.getDeviceById(id)

    if (updateData.machine_name !== undefined) device.machine_name = updateData.machine_name
    if (updateData.machine_code !== undefined) device.machine_code = updateData.machine_code
    if (updateData.status !== undefined) device.status = updateData.status
    if (updateData.amount_paid !== undefined) device.amount_paid = updateData.amount_paid
    if (updateData.amount_due !== undefined) device.amount_due = updateData.amount_due
    if (updateData.notes !== undefined) device.notes = updateData.notes

    // If duration is updated, recalculate end date from the original registration date
    if (updateData.duration_months !== undefined) {
      device.duration_months = updateData.duration_months
      const endDate = new Date(device.registrationDate)
      endDate.setMonth(endDate.getMonth() + updateData.duration_months)
      device.end_date = endDate
    }

    return await typeormService.serviceRegistrationDeviceRepository.save(device)
  }

  // Extend device (add months + optionally add paid/due amounts)
  static async extendDevice(id: string, extendData: ExtendServiceRegistrationDeviceBody) {
    const device = await this.getDeviceById(id)

    if (extendData.duration_months !== undefined) {
      device.duration_months += extendData.duration_months
      const newEndDate = new Date(device.end_date)
      newEndDate.setMonth(newEndDate.getMonth() + extendData.duration_months)
      device.end_date = newEndDate
    }

    if (extendData.amount_paid !== undefined) {
      device.amount_paid = Number(extendData.amount_paid) + Number(device.amount_paid)
    }

    if (extendData.amount_due !== undefined) {
      device.amount_due = Number(extendData.amount_due) + Number(device.amount_due)
    }

    return await typeormService.serviceRegistrationDeviceRepository.save(device)
  }

  // Soft delete device (set status = cancelled)
  static async deleteDevice(id: string) {
    const device = await this.getDeviceById(id)
    device.status = 'cancelled'
    return await typeormService.serviceRegistrationDeviceRepository.save(device)
  }
}

export default ServiceRegistrationDeviceServiceTypeORM
