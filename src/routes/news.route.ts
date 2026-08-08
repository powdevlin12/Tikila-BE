import { Router } from 'express'
import NewsController from '~/controllers/news.controller'

const newsRouter = Router()

// Danh sách bài đã đăng (công khai)
newsRouter.get('/', NewsController.getPublishedList)

// Chi tiết bài đã đăng theo slug (công khai)
newsRouter.get('/:slug', NewsController.getPublishedBySlug)

export default newsRouter
