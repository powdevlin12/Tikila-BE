import typeormService from './typeorm.service'
import { Service } from '~/entities'

interface AddProductBody {
  title: string
  description: string
  image_url: string
  company_id?: number | null
  detail_info?: string | null
}

export class ProductServiceTypeORM {
  static async addProduct(productData: AddProductBody) {
    const { title, description, image_url, company_id, detail_info } = productData

    const service = new Service()
    service.title = title
    service.description = description
    service.imageUrl = image_url
    service.companyId = company_id || null
    service.detailInfo = detail_info || null
    service.isDelete = false

    return await typeormService.serviceRepository.save(service)
  }

  static async getProducts() {
    return await typeormService.serviceRepository.find({
      where: { isDelete: false },
      order: { createdAt: 'DESC' }
    })
  }

  static async getProductById(id: number) {
    return await typeormService.serviceRepository.findOne({
      where: { id, isDelete: false }
    })
  }

  static async updateProduct(id: number, updateData: Partial<AddProductBody>) {
    const updatePayload: any = {}

    if (updateData.title) updatePayload.title = updateData.title
    if (updateData.description) updatePayload.description = updateData.description
    if (updateData.image_url) updatePayload.imageUrl = updateData.image_url
    if (updateData.company_id !== undefined) updatePayload.companyId = updateData.company_id
    if (updateData.detail_info) updatePayload.detailInfo = updateData.detail_info

    await typeormService.serviceRepository.update(id, updatePayload)
    return await this.getProductById(id)
  }

  static async deleteProduct(id: number) {
    // Soft delete - set is_delete to true
    await typeormService.serviceRepository.update(id, { isDelete: true })
    return { message: 'Product deleted successfully' }
  }

  static async hardDeleteProduct(id: number) {
    // Hard delete - actually remove from database
    await typeormService.serviceRepository.delete(id)
    return { message: 'Product permanently deleted' }
  }

  static async getDeletedProducts() {
    return await typeormService.serviceRepository.find({
      where: { isDelete: true },
      order: { createdAt: 'DESC' }
    })
  }

  static async restoreProduct(id: number) {
    await typeormService.serviceRepository.update(id, { isDelete: false })
    return await this.getProductById(id)
  }
}

export default ProductServiceTypeORM
