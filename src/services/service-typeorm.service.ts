import typeormService from './typeorm.service'
import { Service } from '~/entities'

interface CreateServiceBody {
  title: string
  description?: string
  image_url?: string
  company_id?: number
  detail_info?: string
}

interface UpdateServiceBody {
  title?: string
  description?: string
  image_url?: string
  company_id?: number
  detail_info?: string
}

export class ServiceServiceTypeORM {
  static async getAllServices() {
    return await typeormService.serviceRepository.find({
      where: { isDelete: false },
      order: { createdAt: 'DESC' }
    })
  }

  static async getServiceById(id: number) {
    return await typeormService.serviceRepository.findOne({
      where: { id, isDelete: false }
    })
  }

  static async createService(data: CreateServiceBody) {
    const service = new Service()
    service.title = data.title
    service.description = data.description || ''
    service.imageUrl = data.image_url || ''
    service.companyId = data.company_id || 1
    service.detailInfo = data.detail_info || null
    service.isDelete = false

    return await typeormService.serviceRepository.save(service)
  }

  static async updateService(id: number, updateData: UpdateServiceBody) {
    const service = await this.getServiceById(id)

    if (!service) {
      throw new Error('Service not found')
    }

    if (updateData.title !== undefined) service.title = updateData.title
    if (updateData.description !== undefined) service.description = updateData.description || ''
    if (updateData.image_url !== undefined) service.imageUrl = updateData.image_url || ''
    if (updateData.company_id !== undefined) service.companyId = updateData.company_id
    if (updateData.detail_info !== undefined) service.detailInfo = updateData.detail_info || null

    return await typeormService.serviceRepository.save(service)
  }

  static async deleteService(id: number) {
    // Soft delete
    const service = await this.getServiceById(id)

    if (!service) {
      throw new Error('Service not found')
    }

    service.isDelete = true
    await typeormService.serviceRepository.save(service)

    return { message: 'Service deleted successfully' }
  }

  static async getServicesCount() {
    return await typeormService.serviceRepository.count({
      where: { isDelete: false }
    })
  }
}

export default ServiceServiceTypeORM
