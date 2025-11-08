import { ServiceRegistration } from '~/entities'
import { generateId } from '~/utils/gererator'
import typeormService from './typeorm.service'

interface CreateServiceRegistrationBody {
  customer_name: string
  phone: string
  address?: string
  notes?: string
  duration_months: number
  amount_paid?: number
  amount_due?: number
  parent_id?: string
  registration_date: Date
}

interface UpdateServiceRegistrationBody {
  customer_name?: string
  phone?: string
  address?: string
  notes?: string
  duration_months?: number
  status?: string
  amount_paid?: number
  amount_due?: number
  parent_id?: string
}

interface ExtendServiceRegistrationBody {
  duration_months?: number
  amount_paid?: number
  amount_due?: number
}

interface FilterOptions {
  status?: string
  expiring_in_days?: number // Filter for records expiring within X days
  start_date?: Date
  end_date?: Date
  page?: number
  limit?: number
  payment_status?: string // 'paid', 'unpaid', 'partial'
}

export class ServiceRegistrationServiceTypeORM {
  // Get all service registrations with optional filters
  static async getServiceRegistrations(filters: FilterOptions = {}) {
    const { status, expiring_in_days, start_date, end_date, page = 1, limit = 10, payment_status } = filters

    const queryBuilder = typeormService.serviceRegistrationRepository.createQueryBuilder('registration')

    // Filter by status
    if (status) {
      queryBuilder.andWhere('registration.status = :status', { status })
    }

    // Filter by registration date range
    if (start_date && end_date) {
      queryBuilder.andWhere('registration.registrationDate BETWEEN :start_date AND :end_date', { start_date, end_date })
    } else if (start_date) {
      queryBuilder.andWhere('registration.registrationDate >= :start_date', { start_date })
    }

    // Filter for records expiring soon
    if (expiring_in_days) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + expiring_in_days)
      queryBuilder.andWhere('registration.end_date <= :futureDate', { futureDate })
      queryBuilder.andWhere('registration.status = :activeStatus', { activeStatus: 'active' })
    }

    // Filter by payment status
    if (payment_status) {
      switch (payment_status) {
        case 'paid':
          queryBuilder.andWhere('registration.amount_paid >= registration.amount_due')
          break
        case 'unpaid':
          queryBuilder.andWhere('registration.amount_paid < registration.amount_due')
          break
        case 'partial':
          queryBuilder.andWhere('registration.amount_paid > 0 AND registration.amount_paid < registration.amount_due')
          break
      }
    }

    queryBuilder
      .orderBy('registration.registrationDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [registrations, total] = await queryBuilder.getManyAndCount()

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
    registration.amount_paid = data.amount_paid || 0
    registration.amount_due = data.amount_due || 0
    registration.registrationDate = new Date(data.registration_date)
    registration.parent_id = data.parent_id || ''

    // Calculate end date based on duration
    const endDate = new Date(data.registration_date)
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
    if (updateData.amount_paid !== undefined) registration.amount_paid = updateData.amount_paid
    if (updateData.amount_due !== undefined) registration.amount_due = updateData.amount_due
    registration.parent_id = updateData?.parent_id || ''

    // If duration is updated, recalculate end date
    if (updateData.duration_months !== undefined) {
      registration.duration_months = updateData.duration_months
      const endDate = new Date(registration.registrationDate)
      endDate.setMonth(endDate.getMonth() + updateData.duration_months)
      registration.end_date = endDate
    }

    return await typeormService.serviceRegistrationRepository.save(registration)
  }

  static async extendServiceRegistration(id: string, extendData: ExtendServiceRegistrationBody) {
    const registration = await this.getServiceRegistrationById(id)

    // Extend duration if provided
    if (extendData.duration_months !== undefined) {
      registration.duration_months += extendData.duration_months
      const newEndDate = new Date(registration.end_date)
      newEndDate.setMonth(newEndDate.getMonth() + extendData.duration_months)
      registration.end_date = newEndDate
    }

    // Update amount paid if provided
    if (extendData.amount_paid !== undefined) {
      registration.amount_paid = Number(extendData.amount_paid) + Number(registration.amount_paid)
    }

    // Update amount due if provided
    if (extendData.amount_due !== undefined) {
      registration.amount_due = Number(extendData.amount_due) + Number(registration.amount_due)
    }

    return await typeormService.serviceRegistrationRepository.save(registration)
  }

  // Delete service registration (soft delete by changing status)
  static async deleteServiceRegistration(id: string) {
    const registration = await this.getServiceRegistrationById(id)
    registration.status = 'cancelled'
    return await typeormService.serviceRegistrationRepository.save(registration) // Soft delete by updating status
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
    const cancelled = await typeormService.serviceRegistrationRepository.count({ where: { status: 'cancelled' } })

    // Get registrations expiring in next 30 days
    const expiringSoon = await this.getExpiringSoon(30)

    // Get payment statistics
    const paidCount = await typeormService.serviceRegistrationRepository
      .createQueryBuilder('registration')
      .where('registration.amount_paid >= registration.amount_due')
      .getCount()

    const unpaidCount = await typeormService.serviceRegistrationRepository
      .createQueryBuilder('registration')
      .where('registration.amount_paid = 0')
      .getCount()

    const partialPaidCount = await typeormService.serviceRegistrationRepository
      .createQueryBuilder('registration')
      .where('registration.amount_paid > 0 AND registration.amount_paid < registration.amount_due')
      .getCount()

    return {
      total,
      active,
      cancelled,
      expiring_soon: expiringSoon.total,
      payment_stats: {
        paid: paidCount,
        unpaid: unpaidCount,
        partial: partialPaidCount
      }
    }
  }
}

export default ServiceRegistrationServiceTypeORM
