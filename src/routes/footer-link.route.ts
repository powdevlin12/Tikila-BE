import { Router } from 'express'
import { FooterLinkController } from '~/controllers/footer-link.controller'
import {
  validateCreateFooterLink,
  validateUpdateFooterLink,
  validateFooterLinkId,
  validateFooterColumnId
} from '~/middlewares/footer-link.middleware'

const footerLinkRoute = Router()

// GET /footer-links - Lấy tất cả footer links
footerLinkRoute.get('/', FooterLinkController.getAllFooterLinks)

// GET /footer-links/grouped - Lấy footer links được nhóm theo column
footerLinkRoute.get('/grouped', FooterLinkController.getFooterLinksGroupedByColumn)

// GET /footer-links/column/:footerColumnId - Lấy footer links theo column
footerLinkRoute.get('/column/:footerColumnId', ...validateFooterColumnId, FooterLinkController.getFooterLinksByColumn)

// GET /footer-links/:id - Lấy footer link theo ID
footerLinkRoute.get('/:id', ...validateFooterLinkId, FooterLinkController.getFooterLinkById)

// POST /footer-links - Tạo footer link mới
footerLinkRoute.post('/', ...validateCreateFooterLink, FooterLinkController.createFooterLink)

// PUT /footer-links/:id - Cập nhật footer link
footerLinkRoute.put('/:id', ...validateFooterLinkId, ...validateUpdateFooterLink, FooterLinkController.updateFooterLink)

// DELETE /footer-links/:id - Xóa footer link
footerLinkRoute.delete('/:id', ...validateFooterLinkId, FooterLinkController.deleteFooterLink)

// // DELETE /footer-links/column/:columnPosition - Xóa tất cả footer links theo column
// footerLinkRoute.delete(
//   '/column/:columnPosition',
//   ...validateColumnPosition,
//   FooterLinkController.deleteFooterLinksByColumn
// )

export default footerLinkRoute
