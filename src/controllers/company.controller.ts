import { Request, Response } from 'express'
import mediaService from '~/services/media.service'
import { deleteOldImage } from '~/utils/file'
import CompanyServiceTypeORM from '~/services/company-typeorm.service'
import ContactCompanyServiceTypeORM from '~/services/contact-company-typeorm.service'
import ServiceServiceTypeORM from '~/services/service-typeorm.service'
import ContactCustomerServiceTypeORM from '~/services/contact-customer-typeorm.service'
import FooterLinkServiceTypeORM from '~/services/footer-link-typeorm.service'

export class CompanyController {
  // Lấy thông tin công ty
  async getCompanyInfo(req: Request, res: Response) {
    try {
      const companyInfo = await CompanyServiceTypeORM.getCompanyInfo()

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin công ty thành công',
        data: companyInfo
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin công ty'
      })
    }
  }

  async updateCompanyLogo(req: Request, res: Response) {
    try {
      // Get current logo URL before updating
      const companyInfo = await CompanyServiceTypeORM.getCompanyInfo()
      const currentLogoUrl = companyInfo.logoUrl

      const url = await mediaService.handleUploadImage(req, {
        entityType: 'company_logo',
        oldImageUrl: currentLogoUrl
      })

      await CompanyServiceTypeORM.updateCompanyInfo({
        logo_url: url?.[0]?.url ?? ''
      })

      return res.status(200).json({
        success: true,
        message: 'Cập nhật logo công ty thành công'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật logo công ty'
      })
    }
  }

  async updateCompanyImgIntro(req: Request, res: Response) {
    try {
      // Get current img_intro URL before updating
      const companyInfo = await CompanyServiceTypeORM.getCompanyInfo()
      const currentImgUrl = companyInfo.imgIntro

      const url = await mediaService.handleUploadImage(req, {
        entityType: 'company_intro',
        oldImageUrl: currentImgUrl
      })

      await CompanyServiceTypeORM.updateCompanyInfo({
        img_intro: url?.[0]?.url ?? ''
      })

      return res.status(200).json({
        success: true,
        message: 'Cập nhật hình ảnh giới thiệu công ty thành công'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật hình ảnh giới thiệu công ty'
      })
    }
  }

  async updateCompanyBanner(req: Request, res: Response) {
    try {
      // Get current banner URL before updating
      const companyInfo = await CompanyServiceTypeORM.getCompanyInfo()
      const currentBannerUrl = companyInfo.banner

      const url = await mediaService.handleUploadImage(req, {
        entityType: 'company_banner',
        oldImageUrl: currentBannerUrl
      })

      console.log({
        url
      })
      await CompanyServiceTypeORM.updateCompanyInfo({
        banner: url?.[0]?.url ?? ''
      })

      return res.status(200).json({
        success: true,
        message: 'Cập nhật banner công ty thành công'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật banner công ty'
      })
    }
  }

  // Cập nhật thông tin công ty
  async updateCompanyInfo(req: Request, res: Response) {
    try {
      const updateData = req.body

      // Kiểm tra xem có dữ liệu để cập nhật không
      const hasDataToUpdate = Object.keys(updateData).some(
        (key) => updateData[key] !== undefined && updateData[key] !== null
      )

      if (!hasDataToUpdate) {
        return res.status(200).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật',
          data: []
        })
      }

      await CompanyServiceTypeORM.updateCompanyInfo(updateData)

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin công ty thành công'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật thông tin công ty'
      })
    }
  }

  // Lấy thông tin liên hệ
  async getContactInfo(req: Request, res: Response) {
    try {
      const contactInfo = await ContactCompanyServiceTypeORM.getContactInfo()

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin liên hệ thành công',
        data: contactInfo
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin liên hệ'
      })
    }
  }

  // Cập nhật thông tin liên hệ
  async updateContactInfo(req: Request, res: Response) {
    try {
      const { phone, facebook_link, zalo_link, tiktok_link } = req.body

      await ContactCompanyServiceTypeORM.updateContactInfo({
        phone,
        facebook_link,
        zalo_link,
        tiktok_link
      })

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin liên hệ thành công'
      })
    } catch (error) {
      console.error('Error updating contact info:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật thông tin liên hệ'
      })
    }
  }

  // Lấy danh sách dịch vụ
  async getServices(req: Request, res: Response) {
    try {
      const services = await ServiceServiceTypeORM.getAllServices()

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách dịch vụ thành công',
        data: services
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách dịch vụ'
      })
    }
  }

  // Thêm dịch vụ mới
  async createService(req: Request, res: Response) {
    try {
      const { title, description, image_url, company_id } = req.body

      const service = await ServiceServiceTypeORM.createService({
        title,
        description,
        image_url,
        company_id
      })

      return res.status(201).json({
        success: true,
        message: 'Tạo dịch vụ mới thành công',
        data: { id: service.id }
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo dịch vụ mới'
      })
    }
  }

  // Lưu thông tin liên hệ từ khách hàng
  async saveCustomerContact(req: Request, res: Response) {
    try {
      const { full_name, phone_customer, message } = req.body

      await ContactCustomerServiceTypeORM.createContact({
        full_name,
        phone_customer,
        message
      })

      return res.status(201).json({
        success: true,
        message: 'Lưu thông tin liên hệ thành công'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lưu thông tin liên hệ'
      })
    }
  }

  // Lấy footer links
  async getFooterLinks(req: Request, res: Response) {
    try {
      const footerLinks = await FooterLinkServiceTypeORM.getAllFooterLinks()

      return res.status(200).json({
        success: true,
        message: 'Lấy footer links thành công',
        data: footerLinks
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy footer links'
      })
    }
  }

  // Lấy nội dung giới thiệu chi tiết
  async getIntroDetail(req: Request, res: Response) {
    try {
      const companyInfo = await CompanyServiceTypeORM.getCompanyInfo()

      return res.status(200).json({
        success: true,
        message: 'Lấy nội dung giới thiệu chi tiết thành công',
        data: { intro_text_detail: companyInfo.introTextDetail }
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy nội dung giới thiệu chi tiết'
      })
    }
  }

  // Cập nhật nội dung giới thiệu chi tiết
  async updateIntroDetail(req: Request, res: Response) {
    try {
      const { intro_text_detail } = req.body

      if (!intro_text_detail) {
        return res.status(200).json({
          success: false,
          message: 'Nội dung giới thiệu chi tiết không được để trống',
          data: []
        })
      }

      await CompanyServiceTypeORM.updateCompanyInfo({
        intro_text_detail
      })

      return res.status(200).json({
        success: true,
        message: 'Cập nhật nội dung giới thiệu chi tiết thành công'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật nội dung giới thiệu chi tiết'
      })
    }
  }
}

export const companyController = new CompanyController()
