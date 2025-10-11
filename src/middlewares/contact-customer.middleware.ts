import { Request, Response, NextFunction } from 'express'
import { body, checkSchema, param, validationResult } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'

export const validateContactCustomer = [
  body('full_name')
    .notEmpty()
    .withMessage('Vui lòng nhập họ và tên')
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ và tên phải từ 2 đến 100 ký tự'),
  body('phone_customer')
    .notEmpty()
    .withMessage('Vui lòng nhập số điện thoại')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('message')
    .notEmpty()
    .withMessage('Vui lòng nhập nội dung tin nhắn')
    .isLength({ max: 500 })
    .withMessage('Nội dung tin nhắn không được vượt quá 500 ký tự'),
  body('service_id').optional().isInt({ min: 1 }).withMessage('Service ID must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }
    next()
  }
]

export const contactCustomerValidator = checkSchema(
  {
    full_name: {
      notEmpty: {
        errorMessage: 'Vui lòng nhập họ và tên'
      },
      isLength: {
        options: { min: 2, max: 100 },
        errorMessage: 'Họ và tên phải từ 2 đến 100 ký tự'
      }
    },
    phone_customer: {
      notEmpty: {
        errorMessage: 'Vui lòng nhập số điện thoại'
      },
      isMobilePhone: {
        options: 'vi-VN',
        errorMessage: 'Số điện thoại không hợp lệ'
      }
    },
    message: {
      notEmpty: {
        errorMessage: 'Vui lòng nhập nội dung tin nhắn'
      },
      isLength: {
        options: { max: 500 },
        errorMessage: 'Nội dung tin nhắn không được vượt quá 500 ký tự'
      }
    },
    service_id: {
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Vui lòng nhập chọn dịch vụ'
      }
    }
  },
  ['body']
)

export const validateContactId = [
  param('id').isInt({ min: 1 }).withMessage('Contact ID must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }
    next()
  }
]
