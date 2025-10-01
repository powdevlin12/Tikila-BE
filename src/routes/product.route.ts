import { Router } from 'express'
import ProductControllerTypeORM from '~/controllers/product-typeorm.controller'

const productRouter = Router()

// Add a new product with image upload
productRouter.post('/add', ProductControllerTypeORM.addProduct)

// Get all products
productRouter.get('/', ProductControllerTypeORM.getProducts)

// Get product by ID
productRouter.get('/:id', ProductControllerTypeORM.getProductById)

// Update product (supports both JSON with image_url and multipart with image upload)
productRouter.put('/:id', ProductControllerTypeORM.updateProduct)

// Delete product (soft delete)
productRouter.delete('/:id', ProductControllerTypeORM.deleteProduct)

export default productRouter
