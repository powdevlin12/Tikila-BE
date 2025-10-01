import { NextFunction, Request, Response } from 'express'
import ProductServiceTypeORM from '~/services/product-typeorm.service'
import mediaService from '~/services/media.service'
import { deleteOldImage } from '~/utils/file'

export class ProductControllerTypeORM {
  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      let image_url = ''
      let title, description, company_id, detail_info

      try {
        // This will parse the form, upload the image, and return both images and fields
        const result = await mediaService.handleUploadImageWithFields(req)

        if (result.images && result.images.length > 0) {
          image_url = result.images[0].url
        } else {
          return res.status(200).json({
            success: false,
            message: 'Image upload is required',
            data: []
          })
        }

        // Extract fields from the form data
        title = Array.isArray(result.fields.title) ? result.fields.title[0] : result.fields.title
        description = Array.isArray(result.fields.description)
          ? result.fields.description[0]
          : result.fields.description
        company_id = Array.isArray(result.fields.company_id)
          ? parseInt(result.fields.company_id[0])
          : parseInt(result.fields.company_id)
        detail_info = Array.isArray(result.fields.detail_info)
          ? result.fields.detail_info[0]
          : result.fields.detail_info

        console.log('Parsed fields:', { title, description, company_id, detail_info, image_url })
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError)
        return res.status(200).json({
          success: false,
          message: 'Failed to upload image: ' + uploadError.message,
          data: []
        })
      }

      // Validate required fields
      if (!title || !description) {
        return res.status(200).json({
          success: false,
          message: 'Title and description are required',
          data: []
        })
      }

      const productData = {
        title,
        description,
        image_url,
        company_id: isNaN(company_id) ? null : company_id,
        detail_info: detail_info || null
      }

      const result = await ProductServiceTypeORM.addProduct(productData)

      return res.status(200).json({
        success: true,
        message: 'Product added successfully',
        data: result
      })
    } catch (error: any) {
      console.error('Error adding product:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error: ' + error.message,
        data: []
      })
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductServiceTypeORM.getProducts()

      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products
      })
    } catch (error: any) {
      console.error('Error getting products:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error: ' + error.message,
        data: []
      })
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Valid product ID is required',
          data: []
        })
      }

      const product = await ProductServiceTypeORM.getProductById(parseInt(id))

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          data: []
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      })
    } catch (error: any) {
      console.error('Error getting product by ID:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error: ' + error.message,
        data: []
      })
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Valid product ID is required',
          data: []
        })
      }

      // Check if product exists
      const existingProduct = await ProductServiceTypeORM.getProductById(parseInt(id))
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          data: []
        })
      }

      const updateData: any = {}
      let newImageUrl = ''

      try {
        const result = await mediaService.handleUploadImageWithFields(req)

        if (result.images && result.images.length > 0) {
          newImageUrl = result.images[0].url
          updateData.image_url = newImageUrl

          // Delete old image if exists
          if (existingProduct.imageUrl) {
            await deleteOldImage(existingProduct.imageUrl)
          }
        }

        // Extract fields from the form data
        if (result.fields.title) {
          updateData.title = Array.isArray(result.fields.title) ? result.fields.title[0] : result.fields.title
        }
        if (result.fields.description) {
          updateData.description = Array.isArray(result.fields.description)
            ? result.fields.description[0]
            : result.fields.description
        }
        if (result.fields.company_id) {
          updateData.company_id = Array.isArray(result.fields.company_id)
            ? parseInt(result.fields.company_id[0])
            : parseInt(result.fields.company_id)
        }
        if (result.fields.detail_info) {
          updateData.detail_info = Array.isArray(result.fields.detail_info)
            ? result.fields.detail_info[0]
            : result.fields.detail_info
        }
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError)
        return res.status(200).json({
          success: false,
          message: 'Failed to process update: ' + uploadError.message,
          data: []
        })
      }

      const updatedProduct = await ProductServiceTypeORM.updateProduct(parseInt(id), updateData)

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      })
    } catch (error: any) {
      console.error('Error updating product:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error: ' + error.message,
        data: []
      })
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Valid product ID is required',
          data: []
        })
      }

      const result = await ProductServiceTypeORM.deleteProduct(parseInt(id))

      return res.status(200).json({
        success: true,
        message: result.message,
        data: []
      })
    } catch (error: any) {
      console.error('Error deleting product:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error: ' + error.message,
        data: []
      })
    }
  }
}

export default ProductControllerTypeORM
