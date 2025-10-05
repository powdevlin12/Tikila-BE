import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { DashboardStatistics, ContactCustomer, Service, StarCustomer, ServiceRegistration, User } from '../entities'

export class DashboardTypeormService {
  private dashboardStatsRepository: Repository<DashboardStatistics>
  private contactCustomerRepository: Repository<ContactCustomer>
  private serviceRepository: Repository<Service>
  private starCustomerRepository: Repository<StarCustomer>
  private serviceRegistrationRepository: Repository<ServiceRegistration>
  private userRepository: Repository<User>

  constructor() {
    this.dashboardStatsRepository = AppDataSource.getRepository(DashboardStatistics)
    this.contactCustomerRepository = AppDataSource.getRepository(ContactCustomer)
    this.serviceRepository = AppDataSource.getRepository(Service)
    this.starCustomerRepository = AppDataSource.getRepository(StarCustomer)
    this.serviceRegistrationRepository = AppDataSource.getRepository(ServiceRegistration)
    this.userRepository = AppDataSource.getRepository(User)
  }

  async getDashboardStatistics() {
    // Try to get cached statistics first
    const statsArray = await this.dashboardStatsRepository.find({
      order: { updatedAt: 'DESC' },
      take: 1
    })
    let stats = statsArray[0] || null

    // If no stats exist or stats are older than 1 hour, recalculate
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (!stats || stats.updatedAt < oneHourAgo) {
      stats = await this.calculateAndUpdateStatistics()
    }

    return stats
  }

  async calculateAndUpdateStatistics(): Promise<DashboardStatistics> {
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Calculate all statistics
    const [
      totalContacts,
      totalProducts,
      totalReviews,
      totalRegistrations,
      totalUsers,
      activeRegistrations,
      expiredRegistrations,
      averageRatingResult,
      newContactsThisMonth,
      newRegistrationsThisMonth
    ] = await Promise.all([
      this.contactCustomerRepository.count(),
      this.serviceRepository.count({ where: { isDelete: false } }),
      this.starCustomerRepository.count(),
      this.serviceRegistrationRepository.count(),
      this.userRepository.count(),
      this.serviceRegistrationRepository.count({ where: { status: 'active' } }),
      this.serviceRegistrationRepository.count({ where: { status: 'expired' } }),
      this.starCustomerRepository.createQueryBuilder('star').select('AVG(star.star)', 'average').getRawOne(),
      this.contactCustomerRepository
        .createQueryBuilder('contact')
        .where('contact.createdAt >= :monthStart', { monthStart: currentMonth })
        .getCount(),
      this.serviceRegistrationRepository
        .createQueryBuilder('reg')
        .where('reg.createdAt >= :monthStart', { monthStart: currentMonth })
        .getCount()
    ])

    const averageRating = averageRatingResult?.average || 0

    // Get the latest statistics record or create new one
    const statsArray = await this.dashboardStatsRepository.find({
      order: { updatedAt: 'DESC' },
      take: 1
    })
    let stats = statsArray[0] || null

    if (!stats) {
      stats = this.dashboardStatsRepository.create({
        totalContacts,
        totalProducts,
        totalReviews,
        totalRegistrations,
        totalUsers,
        activeRegistrations,
        expiredRegistrations,
        averageRating: parseFloat(averageRating),
        newContactsThisMonth,
        newRegistrationsThisMonth
      })
    } else {
      stats.totalContacts = totalContacts
      stats.totalProducts = totalProducts
      stats.totalReviews = totalReviews
      stats.totalRegistrations = totalRegistrations
      stats.totalUsers = totalUsers
      stats.activeRegistrations = activeRegistrations
      stats.expiredRegistrations = expiredRegistrations
      stats.averageRating = parseFloat(averageRating)
      stats.newContactsThisMonth = newContactsThisMonth
      stats.newRegistrationsThisMonth = newRegistrationsThisMonth
    }

    return await this.dashboardStatsRepository.save(stats)
  }

  async refreshStatistics(): Promise<DashboardStatistics> {
    return await this.calculateAndUpdateStatistics()
  }

  async getDetailedStatistics() {
    const stats = await this.getDashboardStatistics()

    // Get additional detailed data
    const [recentContacts, recentRegistrations, topRatedReviews, registrationsByStatus] = await Promise.all([
      this.contactCustomerRepository.find({
        order: { createdAt: 'DESC' },
        take: 2,
        relations: ['service']
      }),
      this.serviceRegistrationRepository.find({
        order: { createdAt: 'DESC' },
        take: 2
      }),
      this.starCustomerRepository.find({
        order: { star: 'DESC', createdAt: 'DESC' },
        take: 2
      }),
      this.serviceRegistrationRepository
        .createQueryBuilder('reg')
        .select('reg.status, COUNT(*) as count')
        .groupBy('reg.status')
        .getRawMany()
    ])

    return {
      statistics: stats,
      recentContacts,
      recentRegistrations,
      topRatedReviews,
      registrationsByStatus
    }
  }
}
