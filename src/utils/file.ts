import { existsSync, mkdirSync, unlinkSync } from 'fs'
import formidable, { File } from 'formidable'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import path from 'path'
import {
  UPLOAD_IMG_TEMP_FOLDER,
  UPLOAD_VIDEO_FOLDER,
  UPLOAD_VIDEO_TEMP_FOLDER,
  UPLOAD_IMG_FOLDER
} from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_VIDEO_TEMP_FOLDER, UPLOAD_IMG_TEMP_FOLDER, UPLOAD_IMG_FOLDER, UPLOAD_VIDEO_FOLDER].map((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, {
        recursive: true // create nested folders ex : uploads/images
      })
    }
  })
}

export const getFileName = (fullname: string): string => {
  const arrName = fullname.split('.')
  return arrName[0]
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMG_TEMP_FOLDER,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 5000 * 1024,
    maxTotalFileSize: 5000 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isEmpty(files)) {
        reject(new Error('File type is not empty'))
      }

      resolve(files.image as File[])
    })
  })
}

export const handleUploadImageWithFields = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMG_TEMP_FOLDER,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 5000 * 1024,
    maxTotalFileSize: 5000 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<{ files: File[]; fields: any }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isEmpty(files)) {
        reject(new Error('File type is not empty'))
      }

      resolve({
        files: files.image as File[],
        fields
      })
    })
  })
}

export const handleUploadImageWithFieldsOptional = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMG_TEMP_FOLDER,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 5000 * 1024,
    maxTotalFileSize: 5000 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      // Only validate if there are files present
      if (name === 'image' && originalFilename) {
        const valid = Boolean(mimetype?.includes('image/'))
        if (!valid) {
          form.emit('error' as any, new Error('File type is not valid') as any)
        }
        return valid
      }
      return true
    }
  })

  return new Promise<{ files: File[]; fields: any }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }

      // For optional file upload, return empty array if no files
      const imageFiles = files.image ? (Array.isArray(files.image) ? files.image : [files.image]) : []

      resolve({
        files: imageFiles,
        fields
      })
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const date = new Date().getTime()
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_FOLDER,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    maxTotalFileSize: 50 * 1024 * 1024 * 1,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && (Boolean(mimetype?.includes('mp4')) || Boolean(mimetype?.includes('quicktime')))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: (name, ext, part, form) => {
      return `${date}${ext}`
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isEmpty(files.video)) {
        reject(new Error('File type is not empty'))
      }

      if (files.video) {
        const { originalFilename } = files.video[0] as File
        const indexDotLast = (originalFilename as string).lastIndexOf('.')
        const ext = (originalFilename as string).substring(indexDotLast + 1)

        files.video[0].newFilename = `${date}.${ext}`
        resolve(files.video[0] as File)
      }
    })
  })
}

export const deleteOldImage = (imageUrl: string): void => {
  if (!imageUrl) return

  try {
    // Extract filename from URL (e.g., "http://localhost:3000/statics/image/filename.jpg" -> "filename.jpg")
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    if (!fileName) return

    // Build full path to the image file
    const fullPath = path.resolve(UPLOAD_IMG_FOLDER, fileName)

    // Check if file exists and delete it
    if (existsSync(fullPath)) {
      unlinkSync(fullPath)
      console.log(`Deleted old image: ${fileName}`)
    }
  } catch (error) {
    console.error('Error deleting old image:', error)
  }
}
