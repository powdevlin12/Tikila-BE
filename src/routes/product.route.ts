import { Router } from 'express'
import { ProductController } from '~/controllers/product.controller'

const productRouter = Router()

// Add a new product with image upload
productRouter.post('/add', ProductController.addProduct)

// Add a new product with existing image URL
productRouter.post('/add-with-url', ProductController.addProductWithoutImage)

// Get all products
productRouter.get('/', ProductController.getProducts)

// Get product by ID
productRouter.get('/:id', ProductController.getProductById)

// Update product (supports both JSON with image_url and multipart with image upload)
productRouter.put('/:id', ProductController.updateProduct)

// Delete product (soft delete)
productRouter.delete('/:id', ProductController.deleteProduct)

export default productRouter
