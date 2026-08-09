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
      // trim phải đứng trước notEmpty: checkSchema chạy đúng thứ tự khai báo,
      // để sau thì tiêu đề toàn khoảng trắng lọt qua rồi bị trim thành rỗng.
      trim: true,
      notEmpty: { errorMessage: 'Tiêu đề là bắt buộc' },
      isString: { errorMessage: 'Tiêu đề phải là chuỗi' },
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
      // trim phải đứng trước notEmpty — xem giải thích ở validateCreateNews.
      trim: true,
      notEmpty: { errorMessage: 'Tiêu đề không được rỗng' },
      isLength: { options: { max: 255 }, errorMessage: 'Tiêu đề không quá 255 ký tự' }
    },
    slug: {
      optional: true,
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
