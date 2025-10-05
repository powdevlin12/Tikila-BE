import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Validation error',
      errors: errors.array()
    })
  }
  next()
}

export const validateCreateFooterLink = [
  checkSchema({
    title: {
      notEmpty: {
        errorMessage: 'Title is required'
      },
      isString: {
        errorMessage: 'Title must be a string'
      },
      isLength: {
        options: { max: 255 },
        errorMessage: 'Title must not exceed 255 characters'
      }
    },
    footerColumnId: {
      notEmpty: {
        errorMessage: 'Footer column ID is required'
      },
      isInt: {
        options: { min: 1 },
        errorMessage: 'Footer column ID must be a positive integer'
      }
    },
    url: {
      notEmpty: {
        errorMessage: 'URL is required'
      },
      isString: {
        errorMessage: 'URL must be a string'
      },
      isLength: {
        options: { max: 255 },
        errorMessage: 'URL must not exceed 255 characters'
      }
    },
    orderPosition: {
      optional: true,
      isInt: {
        options: { min: 0 },
        errorMessage: 'Order position must be a non-negative integer'
      }
    }
  }),
  handleValidationErrors
]

export const validateUpdateFooterLink = [
  checkSchema({
    title: {
      optional: true,
      isString: {
        errorMessage: 'Title must be a string'
      },
      isLength: {
        options: { max: 255 },
        errorMessage: 'Title must not exceed 255 characters'
      }
    },
    footerColumnId: {
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Footer column ID must be a positive integer'
      }
    },
    url: {
      optional: true,
      isString: {
        errorMessage: 'URL must be a string'
      },
      isLength: {
        options: { max: 255 },
        errorMessage: 'URL must not exceed 255 characters'
      }
    },
    orderPosition: {
      optional: true,
      isInt: {
        options: { min: 0 },
        errorMessage: 'Order position must be a non-negative integer'
      }
    }
  }),
  handleValidationErrors
]

export const validateFooterLinkId = [
  checkSchema({
    id: {
      in: ['params'],
      isInt: {
        options: { min: 1 },
        errorMessage: 'Footer link ID must be a positive integer'
      }
    }
  }),
  handleValidationErrors
]

export const validateFooterColumnId = [
  checkSchema({
    footerColumnId: {
      in: ['params'],
      isInt: {
        options: { min: 1 },
        errorMessage: 'Footer column ID must be a positive integer'
      }
    }
  }),
  handleValidationErrors
]
