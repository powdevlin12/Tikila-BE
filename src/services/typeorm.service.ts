import { AppDataSource } from '~/config/database'
import {
  User,
  RefreshToken,
  CompanyInfo,
  ContactCompany,
  Service,
  FooterLink,
  ContactCustomer,
  StarCustomer
} from '~/entities'
import { Repository } from 'typeorm'

export class TypeORMService {
  private static instance: TypeORMService

  // Repositories
  public userRepository: Repository<User>
  public refreshTokenRepository: Repository<RefreshToken>
  public companyInfoRepository: Repository<CompanyInfo>
  public contactCompanyRepository: Repository<ContactCompany>
  public serviceRepository: Repository<Service>
  public footerLinkRepository: Repository<FooterLink>
  public contactCustomerRepository: Repository<ContactCustomer>
  public starCustomerRepository: Repository<StarCustomer>

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
    this.companyInfoRepository = AppDataSource.getRepository(CompanyInfo)
    this.contactCompanyRepository = AppDataSource.getRepository(ContactCompany)
    this.serviceRepository = AppDataSource.getRepository(Service)
    this.footerLinkRepository = AppDataSource.getRepository(FooterLink)
    this.contactCustomerRepository = AppDataSource.getRepository(ContactCustomer)
    this.starCustomerRepository = AppDataSource.getRepository(StarCustomer)
  }

  public static getInstance(): TypeORMService {
    if (!TypeORMService.instance) {
      TypeORMService.instance = new TypeORMService()
    }
    return TypeORMService.instance
  }
}

export default TypeORMService.getInstance()
