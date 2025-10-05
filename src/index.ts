import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import { UPLOAD_VIDEO_FOLDER } from './constants/dir'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import staticsRouter from './routes/static.router'
import userRouter from './routes/users.router'
import { initializeDatabase } from './config/database'
import { initFolder } from './utils/file'
import { envConfig } from './constants/config'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import companyRouter from './routes/company.route'

import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import swaggerUI from 'swagger-ui-express'
import productRouter from './routes/product.route'
import contactCustomerRouter from './routes/contact-customer.route'
import footerLinkRoute from './routes/footer-link.route'
import starCustomerRouter from './routes/star-customer.route'
import serviceRegistrationRouter from './routes/service-registration.route'
import dashboardRouter from './routes/dashboard.route'

const file = fs.readFileSync(path.resolve('doc-api.yaml'), 'utf-8')
const swaggerDocument = YAML.parse(file)

const app = express()
const port = envConfig.portServer ?? 3000
// create folder upload
initFolder()
// middlewares
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use('/doc-api', swaggerUI.serve as any, swaggerUI.setup(swaggerDocument))

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

// ** limit request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3000, // Limit each IP to 3000 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter)

// routes
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/statics', staticsRouter)
app.use('/company', companyRouter)
app.use('/products', productRouter)
app.use('/contact-customer', contactCustomerRouter)
app.use('/footer-links', footerLinkRoute)
app.use('/star-customers', starCustomerRouter)
app.use('/service-registrations', serviceRegistrationRouter)
app.use('/dashboard', dashboardRouter)
app.use('/statics/video', express.static(UPLOAD_VIDEO_FOLDER))

// ** handle error middleware (tất cả các route đều chạy vô đây)
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error('Not Found')
  error.status = 404
  next(error)
})

// ** đây là 1 middleware để bắt lỗi trong toàn bộ app
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500
  return res
    .status(statusCode)
    .json({ status: 'error', code: statusCode, message: error.message || 'Internal Server Error' })
})

// TypeORM Database Connection
initializeDatabase().catch(console.error)
// default handlers
app.use(defaultErrorHandler)

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
