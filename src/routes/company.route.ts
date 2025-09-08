import { Router } from 'express'
import { companyController } from '~/controllers/company.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { validate } from '~/utils/validation'

const companyRouter = Router()

// Lấy thông tin công ty
companyRouter.get('/info', companyController.getCompanyInfo)

// Cập nhật thông tin công ty
companyRouter.put('/info', validate(accessTokenValidator), companyController.updateCompanyInfo)
// Cập nhật ảnh logo công ty
companyRouter.put('/info/logo', validate(accessTokenValidator), companyController.updateCompanyLogo)
// Cập nhật ảnh giới thiệu
companyRouter.put('/info/img-intro', validate(accessTokenValidator), companyController.updateCompanyImgIntro)
companyRouter.put('/info/banner', validate(accessTokenValidator), companyController.updateCompanyBanner)
// Lấy thông tin liên hệ
companyRouter.get('/contact', companyController.getContactInfo)

// Cập nhật thông tin liên hệ
companyRouter.put('/contact', validate(accessTokenValidator), companyController.updateContactInfo)

// Lấy danh sách dịch vụ
companyRouter.get('/services', companyController.getServices)

// Thêm dịch vụ mới
companyRouter.post('/services', validate(accessTokenValidator), companyController.createService)

// Lưu thông tin liên hệ từ khách hàng
companyRouter.post('/contact/customer', companyController.saveCustomerContact)

// Lấy footer links
companyRouter.get('/footer-links', companyController.getFooterLinks)

// Lấy nội dung giới thiệu chi tiết
companyRouter.get('/intro-detail', companyController.getIntroDetail)

// Cập nhật nội dung giới thiệu chi tiết
companyRouter.put('/intro-detail', validate(accessTokenValidator), companyController.updateIntroDetail)

export default companyRouter
