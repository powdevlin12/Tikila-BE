import { Router } from 'express'
import NewsController from '~/controllers/news.controller'
import { validateCreateNews, validateUpdateNews } from '~/middlewares/news.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { validate } from '~/utils/validation'

const newsAdminRouter = Router()

// Mount riêng ở /admin/news thay vì gộp vào /news: news tra công khai bằng
// slug nhưng admin tra bằng id, gộp lại thì GET /news/:slug sẽ nuốt mọi
// đường dẫn admin — Express khớp route theo thứ tự khai báo.
newsAdminRouter.get('/', validate(accessTokenValidator), NewsController.getAdminList)
newsAdminRouter.get('/:id', validate(accessTokenValidator), NewsController.getById)
newsAdminRouter.post('/', validate(accessTokenValidator), ...validateCreateNews, NewsController.create)
newsAdminRouter.put('/:id', validate(accessTokenValidator), ...validateUpdateNews, NewsController.update)
newsAdminRouter.delete('/:id', validate(accessTokenValidator), NewsController.remove)

export default newsAdminRouter
