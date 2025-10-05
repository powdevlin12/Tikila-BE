import { FindManyOptions, Between, LessThanOrEqual } from 'typeorm'
import typeormService from './typeorm.service'
import { ServiceRegistration } from '~/entities'
import { generateId } from '~/utils/gererator'

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

interface FilterOptions {
  status?: string
  expiring_in_days?: number // Filter for records expiring within X days
  start_date?: Date
  end_date?: Date
  page?: number
  limit?: number
}

export class ServiceRegistrationServiceTypeORM {
  // Get all service registrations with optional filters
  static async getServiceRegistrations(filters: FilterOptions = {}) {
    const { status, expiring_in_days, start_date, end_date, page = 1, limit = 10 } = filters

    const whereConditions: any = {}

    // Filter by status
    if (status) {
      whereConditions.status = status
    }

    // Filter by registration date range
    if (start_date && end_date) {
      whereConditions.registrationDate = Between(start_date, end_date)
    } else if (start_date) {
      whereConditions.registrationDate = LessThanOrEqual(start_date)
    }

    // Filter for records expiring soon
    if (expiring_in_days) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + expiring_in_days)
      whereConditions.end_date = LessThanOrEqual(futureDate)
      whereConditions.status = 'active' // Only check active registrations
    }

    const options: FindManyOptions<ServiceRegistration> = {
      where: whereConditions,
      order: { registrationDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    }

    const [registrations, total] = await typeormService.serviceRegistrationRepository.findAndCount(options)

    return {
      data: registrations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Get service registration by ID
  static async getServiceRegistrationById(id: string) {
    const registration = await typeormService.serviceRegistrationRepository.findOne({
      where: { id }
    })

    if (!registration) {
      throw new Error('Service registration not found')
    }

    return registration
  }

  // Create new service registration
  static async createServiceRegistration(data: CreateServiceRegistrationBody) {
    const registration = new ServiceRegistration()
    registration.id = generateId()
    registration.customer_name = data.customer_name
    registration.phone = data.phone
    registration.address = data.address || ''
    registration.notes = data.notes || ''
    registration.duration_months = data.duration_months
    registration.status = 'active'

    // Calculate end date based on duration
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + data.duration_months)
    registration.end_date = endDate

    console.dir(registration, { depth: null })

    return await typeormService.serviceRegistrationRepository.save(registration)
  }

  // Update service registration
  static async updateServiceRegistration(id: string, updateData: UpdateServiceRegistrationBody) {
    const registration = await this.getServiceRegistrationById(id)

    // Update fields
    if (updateData.customer_name !== undefined) registration.customer_name = updateData.customer_name
    if (updateData.phone !== undefined) registration.phone = updateData.phone
    if (updateData.address !== undefined) registration.address = updateData.address
    if (updateData.notes !== undefined) registration.notes = updateData.notes
    if (updateData.status !== undefined) registration.status = updateData.status

    // If duration is updated, recalculate end date
    if (updateData.duration_months !== undefined) {
      registration.duration_months = updateData.duration_months
      const endDate = new Date(registration.registrationDate)
      endDate.setMonth(endDate.getMonth() + updateData.duration_months)
      registration.end_date = endDate
    }

    return await typeormService.serviceRegistrationRepository.save(registration)
  }

  // Delete service registration (soft delete by changing status)
  static async deleteServiceRegistration(id: string) {
    const registration = await this.getServiceRegistrationById(id)
    registration.status = 'cancelled'
    return await typeormService.serviceRegistrationRepository.save(registration)
  }

  // Hard delete service registration
  static async permanentDeleteServiceRegistration(id: string) {
    const result = await typeormService.serviceRegistrationRepository.delete(id)
    if (result.affected === 0) {
      throw new Error('Service registration not found')
    }
    return { message: 'Service registration permanently deleted' }
  }

  // Get registrations expiring soon (within specified days)
  static async getExpiringSoon(days: number = 30) {
    return await this.getServiceRegistrations({ expiring_in_days: days })
  }

  // Get expired registrations
  static async getExpiredRegistrations() {
    const today = new Date()

    const expired = await typeormService.serviceRegistrationRepository
      .createQueryBuilder('registration')
      .where('registration.end_date < :today', { today })
      .andWhere('registration.status = :status', { status: 'active' })
      .getMany()

    return expired
  }

  // Update expired registrations status
  static async updateExpiredRegistrations() {
    const today = new Date()

    const result = await typeormService.serviceRegistrationRepository
      .createQueryBuilder()
      .update(ServiceRegistration)
      .set({ status: 'expired' })
      .where('end_date < :today', { today })
      .andWhere('status = :status', { status: 'active' })
      .execute()

    return { updated: result.affected }
  }

  // Get statistics
  static async getStatistics() {
    const total = await typeormService.serviceRegistrationRepository.count()
    const active = await typeormService.serviceRegistrationRepository.count({ where: { status: 'active' } })
    const expired = await typeormService.serviceRegistrationRepository.count({ where: { status: 'expired' } })
    const cancelled = await typeormService.serviceRegistrationRepository.count({ where: { status: 'cancelled' } })

    // Get registrations expiring in next 30 days
    const expiringSoon = await this.getExpiringSoon(30)

    return {
      total,
      active,
      expired,
      cancelled,
      expiring_soon: expiringSoon.total
    }
  }
}

export default ServiceRegistrationServiceTypeORM
