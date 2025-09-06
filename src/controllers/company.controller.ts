import { Request, Response } from 'express'
import mediaService from '~/services/media.service'
import mysqlService from '~/services/mysql.service'

export class CompanyController {
  // Lấy thông tin công ty
  async getCompanyInfo(req: Request, res: Response) {
    try {
      const companyInfo = await mysqlService.query('SELECT * FROM company_info LIMIT 1')

      if (companyInfo.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin công ty'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin công ty thành công',
        data: companyInfo[0]
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
      const url = await mediaService.handleUploadImage(req)

      const updateQuery = `
        UPDATE company_info 
        SET logo_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [url?.[0]?.url ?? ''])

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
      const url = await mediaService.handleUploadImage(req)

      const updateQuery = `
        UPDATE company_info 
        SET img_intro = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [url?.[0]?.url ?? ''])

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
      const url = await mediaService.handleUploadImage(req)

      const updateQuery = `
        UPDATE company_info 
        SET BANNER = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [url?.[0]?.url ?? ''])

      return res.status(200).json({
        success: true,
        message: 'Cập nhật banner công ty thành công'
      })
    } catch (error) {
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

      // Lọc ra những trường có dữ liệu (không undefined, null hoặc empty string)
      const fieldsToUpdate: string[] = []
      const values: any[] = []

      // Mapping các field với tên column trong database
      const fieldMapping: { [key: string]: string } = {
        name: 'name',
        logo_url: 'logo_url',
        intro_text: 'intro_text',
        address: 'address',
        tax_code: 'tax_code',
        email: 'email',
        welcome_content: 'welcome_content',
        img_intro: 'img_intro',
        COUNT_CUSTOMER: 'COUNT_CUSTOMER',
        COUNT_CUSTOMER_SATISFY: 'COUNT_CUSTOMER_SATISFY',
        COUNT_QUANLITY: 'COUNT_QUANLITY'
      }

      // Duyệt qua các field được gửi lên
      Object.keys(updateData).forEach((key) => {
        if (fieldMapping[key] && updateData[key] !== undefined && updateData[key] !== null) {
          fieldsToUpdate.push(`${fieldMapping[key]} = ?`)
          values.push(updateData[key])
        }
      })

      // Nếu không có field nào để update
      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật'
        })
      }

      // Thêm updated_at vào cuối
      fieldsToUpdate.push('updated_at = CURRENT_TIMESTAMP')

      const updateQuery = `
        UPDATE company_info 
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, values)

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
      const contactInfo = await mysqlService.query('SELECT * FROM contact_company LIMIT 1')

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin liên hệ thành công',
        data: contactInfo[0] || {}
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin liên hệ'
      })
    }
  }

  // Lấy danh sách dịch vụ
  async getServices(req: Request, res: Response) {
    try {
      const services = await mysqlService.query(
        'SELECT * FROM services WHERE is_delete = FALSE ORDER BY created_at DESC'
      )

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

      const insertQuery = `
        INSERT INTO services (title, description, image_url, company_id) 
        VALUES (?, ?, ?, ?)
      `

      const result: any = await mysqlService.query(insertQuery, [title, description, image_url, company_id || 1])

      return res.status(201).json({
        success: true,
        message: 'Tạo dịch vụ mới thành công',
        data: { id: result.insertId }
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

      const insertQuery = `
        INSERT INTO contact_customer (full_name, phone_customer, message) 
        VALUES (?, ?, ?)
      `

      await mysqlService.query(insertQuery, [full_name, phone_customer, message])

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
      const footerLinks = await mysqlService.query('SELECT * FROM footer_links ORDER BY column_position, id')

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
      const introDetail = await mysqlService.query('SELECT intro_text_detail FROM company_info LIMIT 1')

      return res.status(200).json({
        success: true,
        message: 'Lấy nội dung giới thiệu chi tiết thành công',
        data: introDetail[0] || {}
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
        return res.status(400).json({
          success: false,
          message: 'Nội dung giới thiệu chi tiết không được để trống'
        })
      }

      const updateQuery = `
        UPDATE company_info 
        SET intro_text_detail = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [intro_text_detail])

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
