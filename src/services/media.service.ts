import { Request } from 'express'
import {
  getFileName,
  handleUploadImage,
  handleUploadVideo,
  handleUploadImageWithFields,
  handleUploadImageWithFieldsOptional
} from '~/utils/file'
import sharp from 'sharp'
import { isProduction } from '~/constants/media'
import { MediaType } from '~/constants/enums'
import { envConfig } from '~/constants/config'
import cloudinary from '~/config/cloudinary'
import fs from 'fs'
import { Readable } from 'stream'

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
    return matches ? matches[1] : null
  } catch {
    return null
  }
}

// Helper function to delete old image from Cloudinary
const deleteOldImageFromCloudinary = async (oldUrl: string) => {
  const publicId = getPublicIdFromUrl(oldUrl)
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId)
      console.log(`Deleted old image: ${publicId}`)
    } catch (error) {
      console.error(`Failed to delete old image: ${publicId}`, error)
    }
  }
}

interface UploadOptions {
  entityType?: string // 'company_logo', 'company_intro', 'product', etc.
  entityId?: string | number // ID của entity (product_id, company_id, etc.)
  oldImageUrl?: string // URL của ảnh cũ cần xóa
}

class MediaService {
  async handleUploadImage(req: Request, options?: UploadOptions) {
    const files = await handleUploadImage(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)

        // Create public_id based on entity type
        let publicId = newNameFile
        if (options?.entityType && options?.entityId) {
          publicId = `${options.entityType}_${options.entityId}`
        } else if (options?.entityType) {
          publicId = options.entityType
        }

        // Delete old image if URL provided
        if (options?.oldImageUrl) {
          await deleteOldImageFromCloudinary(options.oldImageUrl)
        }

        // Process image with sharp and convert to buffer
        const imageBuffer = await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toBuffer()

        // Clean up uploaded temp file
        fs.unlinkSync(file.filepath)

        // Upload buffer to Cloudinary using stream with overwrite option
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'tikila/images',
              public_id: publicId,
              resource_type: 'image',
              overwrite: true // Tự động ghi đè nếu trùng public_id
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )

          const bufferStream = new Readable()
          bufferStream.push(imageBuffer)
          bufferStream.push(null)
          bufferStream.pipe(uploadStream)
        })

        return {
          url: result.secure_url,
          type: MediaType.Image
        }
      })
    )

    return data
  }

  async handleUploadImageWithFields(req: Request, options?: UploadOptions) {
    const { files, fields } = await handleUploadImageWithFields(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)

        // Create public_id based on entity type
        let publicId = newNameFile
        if (options?.entityType && options?.entityId) {
          publicId = `${options.entityType}_${options.entityId}`
        } else if (options?.entityType) {
          publicId = options.entityType
        }

        // Delete old image if URL provided
        if (options?.oldImageUrl) {
          await deleteOldImageFromCloudinary(options.oldImageUrl)
        }

        // Process image with sharp and convert to buffer
        const imageBuffer = await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toBuffer()

        // Clean up uploaded temp file
        fs.unlinkSync(file.filepath)

        // Upload buffer to Cloudinary using stream with overwrite option
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'tikila/images',
              public_id: publicId,
              resource_type: 'image',
              overwrite: true // Tự động ghi đè nếu trùng public_id
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )

          const bufferStream = new Readable()
          bufferStream.push(imageBuffer)
          bufferStream.push(null)
          bufferStream.pipe(uploadStream)
        })

        return {
          url: result.secure_url,
          type: MediaType.Image
        }
      })
    )

    return { images: data, fields }
  }

  async handleUploadImageWithFieldsOptional(req: Request, options?: UploadOptions) {
    const { files, fields } = await handleUploadImageWithFieldsOptional(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)

        // Create public_id based on entity type
        let publicId = newNameFile
        if (options?.entityType && options?.entityId) {
          publicId = `${options.entityType}_${options.entityId}`
        } else if (options?.entityType) {
          publicId = options.entityType
        }

        // Delete old image if URL provided
        if (options?.oldImageUrl) {
          await deleteOldImageFromCloudinary(options.oldImageUrl)
        }

        // Process image with sharp and convert to buffer
        const imageBuffer = await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toBuffer()

        // Clean up uploaded temp file
        fs.unlinkSync(file.filepath)

        // Upload buffer to Cloudinary using stream with overwrite option
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'tikila/images',
              public_id: publicId,
              resource_type: 'image',
              overwrite: true // Tự động ghi đè nếu trùng public_id
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )

          const bufferStream = new Readable()
          bufferStream.push(imageBuffer)
          bufferStream.push(null)
          bufferStream.pipe(uploadStream)
        })

        return {
          url: result.secure_url,
          type: MediaType.Image
        }
      })
    )

    return { images: data, fields }
  }

  async handleUploadVideo(req: Request) {
    const file = await handleUploadVideo(req)
    const { newFilename } = file

    return {
      url: `http://localhost:${envConfig.portServer}/statics/video/${newFilename}`,
      type: MediaType.Video
    }
  }

  // Method to rename/move image on Cloudinary with new public_id
  async renameImageOnCloudinary(imageUrl: string, newPublicId: string): Promise<string> {
    const oldPublicId = getPublicIdFromUrl(imageUrl)
    if (!oldPublicId) {
      throw new Error('Invalid image URL')
    }

    try {
      // Rename the image on Cloudinary
      const result = await cloudinary.uploader.rename(oldPublicId, `tikila/images/${newPublicId}`, {
        overwrite: true
      })
      return result.secure_url
    } catch (error) {
      console.error('Error renaming image on Cloudinary:', error)
      throw error
    }
  }
}

const mediaService = new MediaService()

export default mediaService
