import typeormService from './typeorm.service'
import { StarCustomer } from '~/entities'

interface CreateStarCustomerBody {
  star: number
  name_customer: string
  content?: string
}

export class StarCustomerServiceTypeORM {
  static async createStarCustomer(data: CreateStarCustomerBody) {
    if (data.star < 1 || data.star > 5) {
      throw new Error('Số sao phải từ 1 đến 5')
    }

    const starCustomer = new StarCustomer()
    starCustomer.star = data.star
    starCustomer.nameCustomer = data.name_customer
    starCustomer.content = data.content || null

    return await typeormService.starCustomerRepository.save(starCustomer)
  }

  static async getStarCustomers() {
    return await typeormService.starCustomerRepository.find({
      order: { createdAt: 'DESC' }
    })
  }

  static async getStarCustomerById(id: number) {
    return await typeormService.starCustomerRepository.findOne({
      where: { id }
    })
  }

  static async updateStarCustomer(id: number, updateData: Partial<CreateStarCustomerBody>) {
    if (updateData.star !== undefined && (updateData.star < 1 || updateData.star > 5)) {
      throw new Error('Star rating must be between 1 and 5')
    }

    const updatePayload: any = {}
    if (updateData.star !== undefined) updatePayload.star = updateData.star
    if (updateData.name_customer) updatePayload.nameCustomer = updateData.name_customer
    if (updateData.content !== undefined) updatePayload.content = updateData.content

    await typeormService.starCustomerRepository.update(id, updatePayload)
    return await this.getStarCustomerById(id)
  }

  static async deleteStarCustomer(id: number) {
    await typeormService.starCustomerRepository.delete(id)
    return { message: 'Star customer deleted successfully' }
  }

  static async getAverageRating() {
    const result = await typeormService.starCustomerRepository
      .createQueryBuilder('star_customer')
      .select('AVG(star_customer.star)', 'average')
      .addSelect('COUNT(star_customer.id)', 'total')
      .getRawOne()

    return {
      average: parseFloat(result.average) || 0,
      total: parseInt(result.total) || 0
    }
  }

  static async getStarsByRating() {
    const result = await typeormService.starCustomerRepository
      .createQueryBuilder('star_customer')
      .select('star_customer.star', 'rating')
      .addSelect('COUNT(star_customer.id)', 'count')
      .groupBy('star_customer.star')
      .orderBy('star_customer.star', 'DESC')
      .getRawMany()

    return result.map((item) => ({
      rating: parseInt(item.rating),
      count: parseInt(item.count)
    }))
  }
}

export default StarCustomerServiceTypeORM
