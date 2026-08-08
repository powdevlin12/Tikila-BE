import { Request, Response } from 'express'
import { NewsServiceTypeORM } from '~/services/news-typeorm.service'
import type { NewsStatus } from '~/entities/News.entity'
import HTTP_STATUS from '~/constants/httpStatus'

const DEFAULT_LIMIT = 9
const MAX_LIMIT = 100

const parsePaging = (req: Request) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const rawLimit = Number(req.query.limit) || DEFAULT_LIMIT
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit))
  return { page, limit }
}

export class NewsController {
  // [GET] /news
  static async getPublishedList(req: Request, res: Response) {
    try {
      const { page, limit } = parsePaging(req)
      const data = await NewsServiceTypeORM.getPublishedList(page, limit)

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get news list successfully',
        data
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }

  // [GET] /news/:slug
  static async getPublishedBySlug(req: Request, res: Response) {
    try {
      const news = await NewsServiceTypeORM.getPublishedBySlug(req.params.slug)

      if (!news) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'News not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get news successfully',
        data: news
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }

  // [GET] /admin/news
  static async getAdminList(req: Request, res: Response) {
    try {
      const { page, limit } = parsePaging(req)
      const status = req.query.status as NewsStatus | undefined
      const data = await NewsServiceTypeORM.getAdminList(
        page,
        limit,
        status === 'draft' || status === 'published' ? status : undefined
      )

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get news list successfully',
        data
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }

  // [GET] /admin/news/:id
  static async getById(req: Request, res: Response) {
    try {
      const news = await NewsServiceTypeORM.getById(Number(req.params.id))

      if (!news) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'News not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Get news successfully',
        data: news
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }

  // [POST] /admin/news
  static async create(req: Request, res: Response) {
    try {
      const { title, description, image_url, content, status } = req.body
      const news = await NewsServiceTypeORM.createNews({ title, description, image_url, content, status })

      return res.status(HTTP_STATUS.CREATED).json({
        isSuccess: true,
        message: 'Create news successfully',
        data: news
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }

  // [PUT] /admin/news/:id
  static async update(req: Request, res: Response) {
    try {
      const { title, slug, description, image_url, content, status } = req.body
      const news = await NewsServiceTypeORM.updateNews(Number(req.params.id), {
        title,
        slug,
        description,
        image_url,
        content,
        status
      })

      if (!news) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'News not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Update news successfully',
        data: news
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }

  // [DELETE] /admin/news/:id
  static async remove(req: Request, res: Response) {
    try {
      const deleted = await NewsServiceTypeORM.softDeleteNews(Number(req.params.id))

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          isSuccess: false,
          message: 'News not found'
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        isSuccess: true,
        message: 'Delete news successfully'
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        message: 'Internal server error',
        error
      })
    }
  }
}

export default NewsController
