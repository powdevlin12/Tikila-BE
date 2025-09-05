import { Request, Response } from 'express'
import { FooterLinkService } from '~/services/footer-link.service'
import HTTP_STATUS from '~/constants/httpStatus'

export class FooterLinkController {
  // GET /footer-links - Lấy tất cả footer links
  static async getAllFooterLinks(req: Request, res: Response) {
    try {
      const footerLinks = await FooterLinkService.getAllFooterLinks()
      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get footer links successfully',
        data: footerLinks
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }

  // GET /footer-links/:id - Lấy footer link theo ID
  static async getFooterLinkById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const footerLink = await FooterLinkService.getFooterLinkById(Number(id))

      if (!footerLink) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: 'Footer link not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        message: 'Get footer link successfully',
        data: footerLink
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error
      })
    }
  }

  // GET /footer-links/column/:columnPosition - Lấy footer links theo column
  static async getFooterLinksByColumn(req: Request, res: Response) {
    try {
      const { columnPosition } = req.params
      const footerLinks = await FooterLinkService.getFooterLinksByColumn(Number(columnPosition))

      return res.status(HTTP_STATUS.OK).json({
        message: 'Get footer links by column successfully',
        data: footerLinks
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error
      })
    }
  }

  // POST /footer-links - Tạo footer link mới
  static async createFooterLink(req: Request, res: Response) {
    try {
      const { title, column_position, url, title_column } = req.body

      const footerLinkId = await FooterLinkService.createFooterLink({
        title,
        column_position,
        url,
        title_column
      })

      return res.status(HTTP_STATUS.CREATED).json({
        isSuccess: true,
        message: 'Create footer link successfully',
        data: { id: footerLinkId }
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error: error
      })
    }
  }

  // PUT /footer-links/:id - Cập nhật footer link
  static async updateFooterLink(req: Request, res: Response) {
    try {
      const { id } = req.params
      const updateData = req.body

      const updated = await FooterLinkService.updateFooterLink(Number(id), updateData)

      if (!updated) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: 'Footer link not found or no changes made'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        message: 'Update footer link successfully'
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error
      })
    }
  }

  // DELETE /footer-links/:id - Xóa footer link
  static async deleteFooterLink(req: Request, res: Response) {
    try {
      const { id } = req.params

      const deleted = await FooterLinkService.deleteFooterLink(Number(id))

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: 'Footer link not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        message: 'Delete footer link successfully'
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error
      })
    }
  }

  // DELETE /footer-links/column/:columnPosition - Xóa tất cả footer links theo column
  static async deleteFooterLinksByColumn(req: Request, res: Response) {
    try {
      const { columnPosition } = req.params

      const deletedCount = await FooterLinkService.deleteFooterLinksByColumn(Number(columnPosition))

      return res.status(HTTP_STATUS.OK).json({
        message: `Deleted ${deletedCount} footer links successfully`,
        data: { deletedCount }
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error
      })
    }
  }
}
