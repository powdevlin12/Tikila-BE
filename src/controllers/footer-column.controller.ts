import { Request, Response } from 'express'
import { FooterColumnServiceTypeORM } from '~/services/footer-column-typeorm.service'
import HTTP_STATUS from '~/constants/httpStatus'

export class FooterColumnController {
  // [GET] /api/footer-columns
  static async getAllFooterColumns(req: Request, res: Response) {
    try {
      const footerColumns = await FooterColumnServiceTypeORM.getAllFooterColumns()

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get all footer columns successfully',
        data: footerColumns
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }

  // [GET] /api/footer-columns/:id
  static async getFooterColumnById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const footerColumn = await FooterColumnServiceTypeORM.getFooterColumnById(Number(id))

      if (!footerColumn) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'Footer column not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get footer column successfully',
        data: footerColumn
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }

  // [POST] /api/footer-columns
  static async createFooterColumn(req: Request, res: Response) {
    try {
      const { title, position } = req.body

      const newFooterColumn = await FooterColumnServiceTypeORM.createFooterColumn({
        title,
        position
      })

      return res.status(HTTP_STATUS.CREATED).json({
        isSuccess: true,
        message: 'Create footer column successfully',
        data: newFooterColumn
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }

  // [PUT] /api/footer-columns/:id
  static async updateFooterColumn(req: Request, res: Response) {
    try {
      const { id } = req.params
      const updateData = req.body

      const success = await FooterColumnServiceTypeORM.updateFooterColumn(Number(id), updateData)

      if (!success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'Footer column not found or update failed'
        })
      }

      const updatedFooterColumn = await FooterColumnServiceTypeORM.getFooterColumnById(Number(id))

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Update footer column successfully',
        data: updatedFooterColumn
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }

  // [DELETE] /api/footer-columns/:id
  static async deleteFooterColumn(req: Request, res: Response) {
    try {
      const { id } = req.params

      const success = await FooterColumnServiceTypeORM.deleteFooterColumn(Number(id))

      if (!success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'Footer column not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Delete footer column successfully'
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }
}
