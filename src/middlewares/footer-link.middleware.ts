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
    column_position: {
      notEmpty: {
        errorMessage: 'Column position is required'
      },
      isInt: {
        options: { min: 1 },
        errorMessage: 'Column position must be a positive integer'
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
    title_column: {
      notEmpty: {
        errorMessage: 'Title column is required'
      },
      isString: {
        errorMessage: 'Title column must be a string'
      },
      isLength: {
        options: { max: 255 },
        errorMessage: 'Title column must not exceed 255 characters'
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
    column_position: {
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Column position must be a positive integer'
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
    title_column: {
      optional: true,
      isString: {
        errorMessage: 'Title column must be a string'
      },
      isLength: {
        options: { max: 255 },
        errorMessage: 'Title column must not exceed 255 characters'
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

export const validateColumnPosition = [
  checkSchema({
    columnPosition: {
      in: ['params'],
      isInt: {
        options: { min: 1 },
        errorMessage: 'Column position must be a positive integer'
      }
    }
  }),
  handleValidationErrors
]
