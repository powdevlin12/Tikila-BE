import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'

export const validateContactCustomer = [
  body('full_name')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phone_customer')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('vi-VN')
    .withMessage('Invalid Vietnamese phone number format'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters'),
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
