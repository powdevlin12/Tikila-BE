import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult, Meta } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      isSuccess: false,
      message: 'Validation error',
      errors: errors.array()
    })
  }
  next()
}

/**
 * Lưu nháp chỉ cần title — phải lưu được bài viết dở dang, đó là mục đích
 * của nháp. Khi status = 'published' mới bắt buộc đủ description + content,
 * để không đăng ra trang chủ một bài rỗng.
 */
const requiredWhenPublished = (field: string, label: string) => ({
  custom: {
    options: (value: unknown, { req }: Meta) => {
      if (req.body.status !== 'published') return true
      if (typeof value === 'string' && value.trim().length > 0) return true
      throw new Error(`${label} là bắt buộc khi đăng bài`)
    }
  }
})

export const validateCreateNews = [
  checkSchema({
    title: {
      // Thứ tự isString -> trim -> notEmpty là bắt buộc, checkSchema chạy đúng
      // thứ tự khai báo:
      // - isString phải đứng trước trim, vì isString kiểm tra giá trị SAU khi
      //   sanitize, còn trim thì ép kiểu về chuỗi trước. Để sau thì 123 biến
      //   thành "123" và lọt qua.
      // - trim phải đứng trước notEmpty, để sau thì tiêu đề toàn khoảng trắng
      //   lọt qua rồi mới bị trim thành rỗng.
      isString: { errorMessage: 'Tiêu đề phải là chuỗi' },
      trim: true,
      notEmpty: { errorMessage: 'Tiêu đề là bắt buộc' },
      isLength: { options: { max: 255 }, errorMessage: 'Tiêu đề không quá 255 ký tự' }
    },
    status: {
      optional: true,
      isIn: { options: [['draft', 'published']], errorMessage: 'Trạng thái phải là draft hoặc published' }
    },
    description: requiredWhenPublished('description', 'Mô tả ngắn'),
    content: requiredWhenPublished('content', 'Nội dung'),
    image_url: {
      optional: true,
      isLength: { options: { max: 500 }, errorMessage: 'Đường dẫn ảnh không quá 500 ký tự' }
    }
  }),
  handleValidationErrors
]

// Update chỉ kiểm tra field nào được gửi lên — description/content không gửi
// tức là giữ nguyên giá trị đã lưu, việc đó đủ hay không (khi publish) chỉ
// service mới biết vì phải nhìn vào bản ghi sau khi merge. Do đó update giữ
// optional: true, còn ràng buộc thật sự nằm ở NewsServiceTypeORM.updateNews.
export const validateUpdateNews = [
  checkSchema({
    title: {
      optional: true,
      // Thứ tự isString -> trim -> notEmpty — xem giải thích ở validateCreateNews.
      isString: { errorMessage: 'Tiêu đề phải là chuỗi' },
      trim: true,
      notEmpty: { errorMessage: 'Tiêu đề không được rỗng' },
      isLength: { options: { max: 255 }, errorMessage: 'Tiêu đề không quá 255 ký tự' }
    },
    slug: {
      optional: true,
      isString: { errorMessage: 'Slug phải là chuỗi' },
      trim: true,
      notEmpty: { errorMessage: 'Slug không được rỗng' },
      isLength: { options: { max: 280 }, errorMessage: 'Slug không quá 280 ký tự' }
    },
    status: {
      optional: true,
      isIn: { options: [['draft', 'published']], errorMessage: 'Trạng thái phải là draft hoặc published' }
    },
    description: { optional: true, ...requiredWhenPublished('description', 'Mô tả ngắn') },
    content: { optional: true, ...requiredWhenPublished('content', 'Nội dung') },
    image_url: {
      optional: true,
      isLength: { options: { max: 500 }, errorMessage: 'Đường dẫn ảnh không quá 500 ký tự' }
    }
  }),
  handleValidationErrors
]
