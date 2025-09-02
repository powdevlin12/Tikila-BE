import { NextFunction, Request, Response } from 'express'
import { ProductService } from '~/services/product.service'
import mediaService from '~/services/media.service'

export class ProductController {
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
          return res.status(400).json({
            success: false,
            message: 'Image upload is required'
          })
        }

        // Extract fields from the form data
        // formidable returns fields as arrays, so we need to get the first element
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
        return res.status(400).json({
          success: false,
          message: 'Failed to upload image: ' + uploadError.message
        })
      }

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        })
      }

      const productResult = await ProductService.addProduct({
        title,
        description,
        image_url,
        company_id: company_id || undefined,
        detail_info
      })

      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: productResult
      })
    } catch (error) {
      next(error)
    }
  }

  static async addProductWithoutImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, image_url, company_id, detail_info } = req.body

      // Validate required fields
      if (!title || !description || !image_url) {
        return res.status(400).json({
          success: false,
          message: 'Title, description and image_url are required'
        })
      }

      const result = await ProductService.addProduct({
        title,
        description,
        image_url,
        company_id,
        detail_info
      })

      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getProducts()

      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products
      })
    } catch (error) {
      next(error)
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const product = await ProductService.getProductById(parseInt(id))

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      // Try to parse as multipart first (if image is being uploaded)
      let title, description, image_url, company_id, detail_info
      let isMultipart = false

      try {
        // Check if content-type is multipart/form-data
        const contentType = req.headers['content-type'] || ''
        if (contentType.includes('multipart/form-data')) {
          isMultipart = true

          // Handle image upload with fields
          const result = await mediaService.handleUploadImageWithFields(req)

          if (result.images && result.images.length > 0) {
            image_url = result.images[0].url
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
        }
      } catch (uploadError) {
        // If multipart parsing fails, fallback to JSON
        isMultipart = false
      }

      // If not multipart or multipart failed, use JSON body
      if (!isMultipart) {
        const body = req.body
        title = body.title
        description = body.description
        image_url = body.image_url
        company_id = body.company_id
        detail_info = body.detail_info
      }

      const updated = await ProductService.updateProduct(parseInt(id), {
        title,
        description,
        image_url,
        company_id,
        detail_info
      })

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or not updated'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const deleted = await ProductService.deleteProduct(parseInt(id))

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}
