import { Router } from 'express'
import ProductControllerTypeORM from '~/controllers/product-typeorm.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { validate } from '~/utils/validation'

const productRouter = Router()

// Add a new product with image upload
productRouter.post('/add', validate(accessTokenValidator), ProductControllerTypeORM.addProduct)

// Get all products
productRouter.get('/', ProductControllerTypeORM.getProducts)

// Get product by ID
productRouter.get('/:id', ProductControllerTypeORM.getProductById)

// Update product (supports both JSON with image_url and multipart with image upload)
productRouter.put('/:id', validate(accessTokenValidator), ProductControllerTypeORM.updateProduct)

// Delete product (soft delete)
productRouter.delete('/:id', validate(accessTokenValidator), ProductControllerTypeORM.deleteProduct)

export default productRouter
