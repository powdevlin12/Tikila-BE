import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { envConfig } from '~/constants/config'
import {
  User,
  RefreshToken,
  CompanyInfo,
  ContactCompany,
  Service,
  FooterLink,
  ContactCustomer,
  StarCustomer,
  ServiceRegistration,
  DashboardStatistics
} from '~/entities'
import { generateId } from '~/utils/gererator'
import { hashPassword } from '~/utils/cryto'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: envConfig.mysqlHost,
  port: envConfig.mysqlPort,
  username: envConfig.mysqlUsername,
  password: envConfig.mysqlPassword,
  database: envConfig.mysqlDatabase,
  synchronize: true, // Auto create tables (for development only)
  logging: false,
  charset: 'utf8mb4',
  entities: [
    User,
    RefreshToken,
    CompanyInfo,
    ContactCompany,
    Service,
    FooterLink,
    ContactCustomer,
    StarCustomer,
    ServiceRegistration,
    DashboardStatistics
  ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts']
})

// Initialize the data source
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize()
    console.log('✅ TypeORM Data Source has been initialized!')

    // Create default data if needed
    await createDefaultData()
  } catch (error) {
    console.error('❌ Error during TypeORM Data Source initialization:', error)
    throw error
  }
}

// Create default admin user and company info
const createDefaultData = async (): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const companyRepository = AppDataSource.getRepository(CompanyInfo)

    // Check if admin user exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@gmail.com' }
    })

    if (!existingAdmin) {
      const adminUser = new User()
      adminUser.id = generateId()
      adminUser.name = 'Administrator'
      adminUser.email = 'admin@gmail.com'
      adminUser.password = hashPassword('!Thudat68')

      await userRepository.save(adminUser)
      console.log('✅ Default admin user created successfully!')
    }

    // Check if company info exists
    const existingCompany = await companyRepository.findOne({
      where: { id: 1 }
    })

    if (!existingCompany) {
      const companyInfo = new CompanyInfo()
      companyInfo.name = ''
      companyInfo.logoUrl = ''
      companyInfo.introText = ''
      companyInfo.address = ''
      companyInfo.taxCode = ''
      companyInfo.email = ''
      companyInfo.welcomeContent = ''
      companyInfo.versionInfo = null
      companyInfo.contactId = null
      companyInfo.imgIntro = ''
      companyInfo.banner = ''
      companyInfo.countCustomer = 0
      companyInfo.countCustomerSatisfy = 0
      companyInfo.countQuality = 100
      companyInfo.introTextDetail = ''

      await companyRepository.save(companyInfo)
      console.log('✅ Default company info created successfully!')
    }
  } catch (error) {
    console.error('❌ Error creating default data:', error)
  }
}
