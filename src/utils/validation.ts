import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validation.map((v) => v.run(req)))
    const errors = validationResult(req)
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    console.dir(errors)

    if (errors.isEmpty()) {
      return next()
    }

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]

      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      } else {
        return next(new ErrorWithStatus({ message: msg.toString(), status: HTTP_STATUS.UNPROCESSABLE_ENTITY }))
      }
    }

    next(entityError)
  }
}
