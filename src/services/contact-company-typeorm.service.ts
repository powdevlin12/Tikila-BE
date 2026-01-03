import typeormService from './typeorm.service'
import { ContactCompany } from '~/entities'

interface UpdateContactCompanyBody {
  phone?: string
  facebook_link?: string
  zalo_link?: string
  tiktok_link?: string
}

export class ContactCompanyServiceTypeORM {
  static async getContactInfo() {
    let contactInfo = await typeormService.contactCompanyRepository.findOne({
      where: {}
    })

    // If no contact info exists, create one
    if (!contactInfo) {
      contactInfo = new ContactCompany()
      contactInfo.phone = ''
      contactInfo.facebookLink = ''
      contactInfo.zaloLink = ''
      contactInfo.tiktokLink = ''

      contactInfo = await typeormService.contactCompanyRepository.save(contactInfo)
    }

    return contactInfo
  }

  static async updateContactInfo(updateData: UpdateContactCompanyBody) {
    const contactInfo = await this.getContactInfo()

    // Update fields
    if (updateData.phone !== undefined) {
      contactInfo.phone = updateData.phone || ''
    }
    if (updateData.facebook_link !== undefined) {
      contactInfo.facebookLink = updateData.facebook_link || ''
    }
    if (updateData.zalo_link !== undefined) {
      contactInfo.zaloLink = updateData.zalo_link || ''
    }
    if (updateData.tiktok_link !== undefined) {
      contactInfo.tiktokLink = updateData.tiktok_link || ''
    }

    return await typeormService.contactCompanyRepository.save(contactInfo)
  }
}

export default ContactCompanyServiceTypeORM
