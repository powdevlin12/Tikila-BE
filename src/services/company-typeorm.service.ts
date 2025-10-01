import typeormService from './typeorm.service'
import { CompanyInfo } from '~/entities'

interface UpdateCompanyInfoBody {
  name?: string
  logo_url?: string
  intro_text?: string
  address?: string
  tax_code?: string
  email?: string
  welcome_content?: string
  version_info?: number
  contact_id?: number
  img_intro?: string
  banner?: string
  count_customer?: number
  count_customer_satisfy?: number
  count_quality?: number
  intro_text_detail?: string
}

export class CompanyServiceTypeORM {
  static async getCompanyInfo() {
    // Always get company with id = 1 (default company)
    let company = await typeormService.companyInfoRepository.findOne({
      where: { id: 1 }
    })

    // If no company exists, create one
    if (!company) {
      company = new CompanyInfo()
      company.name = ''
      company.logoUrl = ''
      company.introText = ''
      company.address = ''
      company.taxCode = ''
      company.email = ''
      company.welcomeContent = ''
      company.versionInfo = null
      company.contactId = null
      company.imgIntro = ''
      company.banner = ''
      company.countCustomer = 0
      company.countCustomerSatisfy = 0
      company.countQuality = 100
      company.introTextDetail = ''

      company = await typeormService.companyInfoRepository.save(company)
    }

    return company
  }

  static async updateCompanyInfo(updateData: UpdateCompanyInfoBody) {
    const company = await this.getCompanyInfo()

    // Update fields
    if (updateData.name !== undefined) company.name = updateData.name
    if (updateData.logo_url !== undefined) company.logoUrl = updateData.logo_url
    if (updateData.intro_text !== undefined) company.introText = updateData.intro_text
    if (updateData.address !== undefined) company.address = updateData.address
    if (updateData.tax_code !== undefined) company.taxCode = updateData.tax_code
    if (updateData.email !== undefined) company.email = updateData.email
    if (updateData.welcome_content !== undefined) company.welcomeContent = updateData.welcome_content
    if (updateData.version_info !== undefined) company.versionInfo = updateData.version_info
    if (updateData.contact_id !== undefined) company.contactId = updateData.contact_id
    if (updateData.img_intro !== undefined) company.imgIntro = updateData.img_intro
    if (updateData.banner !== undefined) company.banner = updateData.banner
    if (updateData.count_customer !== undefined) company.countCustomer = updateData.count_customer
    if (updateData.count_customer_satisfy !== undefined)
      company.countCustomerSatisfy = updateData.count_customer_satisfy
    if (updateData.count_quality !== undefined) company.countQuality = updateData.count_quality
    if (updateData.intro_text_detail !== undefined) company.introTextDetail = updateData.intro_text_detail

    return await typeormService.companyInfoRepository.save(company)
  }

  static async updateCompanyStats(stats: {
    count_customer?: number
    count_customer_satisfy?: number
    count_quality?: number
  }) {
    const company = await this.getCompanyInfo()

    if (stats.count_customer !== undefined) company.countCustomer = stats.count_customer
    if (stats.count_customer_satisfy !== undefined) company.countCustomerSatisfy = stats.count_customer_satisfy
    if (stats.count_quality !== undefined) company.countQuality = stats.count_quality

    return await typeormService.companyInfoRepository.save(company)
  }

  static async incrementCustomerCount() {
    const company = await this.getCompanyInfo()
    company.countCustomer += 1
    return await typeormService.companyInfoRepository.save(company)
  }

  static async incrementSatisfiedCustomerCount() {
    const company = await this.getCompanyInfo()
    company.countCustomerSatisfy += 1
    return await typeormService.companyInfoRepository.save(company)
  }
}

export default CompanyServiceTypeORM
