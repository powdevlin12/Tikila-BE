import typeormService from './typeorm.service'
import { ContactCustomer } from '~/entities'

interface CreateContactCustomerBody {
  full_name: string
  phone_customer: string
  message?: string
  service_id?: number
}

export class ContactCustomerServiceTypeORM {
  static async createContact(data: CreateContactCustomerBody) {
    const contact = new ContactCustomer()
    contact.fullName = data.full_name
    contact.phoneCustomer = data.phone_customer
    contact.message = data.message || null
    contact.serviceId = data.service_id || null

    return await typeormService.contactCustomerRepository.save(contact)
  }

  static async getAllContacts() {
    return await typeormService.contactCustomerRepository.find({
      relations: ['service'],
      order: { createdAt: 'DESC' }
    })
  }

  static async getContactById(id: number) {
    return await typeormService.contactCustomerRepository.findOne({
      where: { id },
      relations: ['service']
    })
  }

  static async getContactsByService(serviceId: number) {
    return await typeormService.contactCustomerRepository.find({
      where: { serviceId },
      relations: ['service'],
      order: { createdAt: 'DESC' }
    })
  }

  static async updateContact(id: number, updateData: Partial<CreateContactCustomerBody>) {
    const updatePayload: any = {}

    if (updateData.full_name) updatePayload.fullName = updateData.full_name
    if (updateData.phone_customer) updatePayload.phoneCustomer = updateData.phone_customer
    if (updateData.message !== undefined) updatePayload.message = updateData.message
    if (updateData.service_id !== undefined) updatePayload.serviceId = updateData.service_id

    await typeormService.contactCustomerRepository.update(id, updatePayload)
    return await this.getContactById(id)
  }

  static async deleteContact(id: number) {
    await typeormService.contactCustomerRepository.delete(id)
    return { message: 'Contact deleted successfully' }
  }

  static async getContactsStats() {
    const total = await typeormService.contactCustomerRepository.count()

    const byService = await typeormService.contactCustomerRepository
      .createQueryBuilder('contact')
      .leftJoin('contact.service', 'service')
      .select('service.title', 'serviceName')
      .addSelect('COUNT(contact.id)', 'count')
      .groupBy('contact.serviceId')
      .getRawMany()

    return {
      total,
      byService: byService.map((item) => ({
        serviceName: item.serviceName || 'Không xác định',
        count: parseInt(item.count)
      }))
    }
  }
}

export default ContactCustomerServiceTypeORM
