import { NextFunction, Request, Response } from 'express'
import { StarCustomerServiceTypeORM } from '~/services/star-customer-typeorm.service'

export class StarCustomerController {
  static async addStarCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { star, name_customer, content } = req.body

      // Validate required fields
      if (!star || !name_customer) {
        return res.status(200).json({
          success: false,
          message: 'Star rating and customer name are required',
          data: []
        })
      }

      // Validate star rating
      const starRating = parseInt(star)
      if (isNaN(starRating) || starRating < 1 || starRating > 5) {
        return res.status(200).json({
          success: false,
          message: 'Star rating must be a number between 1 and 5',
          data: []
        })
      }

      const result = await StarCustomerServiceTypeORM.createStarCustomer({
        star: starRating,
        name_customer: name_customer.trim(),
        content: content || ''
      })

      return res.status(201).json({
        success: true,
        message: 'Star customer review added successfully',
        data: result
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(200).json({
          success: false,
          message: error.message,
          data: []
        })
      }
      next(error)
    }
  }

  static async getStarCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const starCustomers = await StarCustomerServiceTypeORM.getStarCustomers()

      return res.status(200).json({
        success: true,
        message: 'Star customer reviews retrieved successfully',
        data: starCustomers
      })
    } catch (error) {
      next(error)
    }
  }

  static async getStarCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const starCustomerId = parseInt(id)

      if (isNaN(starCustomerId)) {
        return res.status(200).json({
          success: false,
          message: 'Invalid star customer ID',
          data: []
        })
      }

      const starCustomer = await StarCustomerServiceTypeORM.getStarCustomerById(starCustomerId)

      if (!starCustomer) {
        return res.status(200).json({
          success: false,
          message: 'Star customer review not found',
          data: []
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Star customer review retrieved successfully',
        data: starCustomer
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteStarCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const starCustomerId = parseInt(id)

      if (isNaN(starCustomerId)) {
        return res.status(200).json({
          success: false,
          message: 'Invalid star customer ID',
          data: []
        })
      }

      const deleted = await StarCustomerServiceTypeORM.deleteStarCustomer(starCustomerId)

      if (!deleted) {
        return res.status(200).json({
          success: false,
          message: 'Star customer review not found or already deleted',
          data: []
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Star customer review deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  static async getStarCustomerStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await StarCustomerServiceTypeORM.getAverageRating()

      return res.status(200).json({
        success: true,
        message: 'Star customer statistics retrieved successfully',
        data: stats
      })
    } catch (error) {
      next(error)
    }
  }
}
