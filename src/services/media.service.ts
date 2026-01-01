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

class MediaService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)

        // Process image with sharp and convert to buffer
        const imageBuffer = await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toBuffer()

        // Clean up uploaded temp file
        fs.unlinkSync(file.filepath)

        // Upload buffer to Cloudinary using stream
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'tikila/images',
              public_id: newNameFile,
              resource_type: 'image'
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

  async handleUploadImageWithFields(req: Request) {
    const { files, fields } = await handleUploadImageWithFields(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)

        // Process image with sharp and convert to buffer
        const imageBuffer = await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toBuffer()

        // Clean up uploaded temp file
        fs.unlinkSync(file.filepath)

        // Upload buffer to Cloudinary using stream
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'tikila/images',
              public_id: newNameFile,
              resource_type: 'image'
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

  async handleUploadImageWithFieldsOptional(req: Request) {
    const { files, fields } = await handleUploadImageWithFieldsOptional(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)

        // Process image with sharp and convert to buffer
        const imageBuffer = await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toBuffer()

        // Clean up uploaded temp file
        fs.unlinkSync(file.filepath)

        // Upload buffer to Cloudinary using stream
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'tikila/images',
              public_id: newNameFile,
              resource_type: 'image'
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
      url: isProduction
        ? `${envConfig.host}/statics/video/${newFilename}`
        : `http://localhost:${envConfig.portServer}/statics/video/${newFilename}`,
      type: MediaType.Video
    }
  }
}

const mediaService = new MediaService()

export default mediaService
