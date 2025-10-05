import express from 'express'
import { FooterColumnController } from '~/controllers/footer-column.controller'

const footerColumnRoute = express.Router()

// GET /footer-columns - Lấy tất cả footer columns
footerColumnRoute.get('/', FooterColumnController.getAllFooterColumns)

// GET /footer-columns/:id - Lấy footer column theo ID
footerColumnRoute.get('/:id', FooterColumnController.getFooterColumnById)

// POST /footer-columns - Tạo footer column mới
footerColumnRoute.post('/', FooterColumnController.createFooterColumn)

// PUT /footer-columns/:id - Cập nhật footer column
footerColumnRoute.put('/:id', FooterColumnController.updateFooterColumn)

// DELETE /footer-columns/:id - Xóa footer column
footerColumnRoute.delete('/:id', FooterColumnController.deleteFooterColumn)

export default footerColumnRoute
