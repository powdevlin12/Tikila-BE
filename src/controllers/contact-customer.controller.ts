import { Request, Response } from 'express'
import { ContactCustomerServiceTypeORM } from '~/services/contact-customer-typeorm.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { ContactCustomerData } from '~/types/contact-customer.types'

export class ContactCustomerController {
  static async saveCustomerContact(
    req: Request<Record<string, never>, Record<string, never>, ContactCustomerData>,
    res: Response
  ) {
    try {
      const { full_name, phone_customer, message, service_id } = req.body

      const contact = await ContactCustomerServiceTypeORM.createContact({
        full_name,
        phone_customer,
        message,
        service_id
      })

      return res.status(HTTP_STATUS.CREATED).json({
        message: 'Gửi thông tin thành công!',
        result: contact
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Gửi thông tin thất bại',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  static async getAllContacts(req: Request, res: Response) {
    try {
      const contacts = await ContactCustomerServiceTypeORM.getAllContacts()

      return res.status(HTTP_STATUS.OK).json({
        message: 'Get contacts successfully',
        result: contacts
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get contacts',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  static async getContactById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const contact = await ContactCustomerServiceTypeORM.getContactById(Number(id))

      if (!contact) {
        return res.status(HTTP_STATUS.OK).json({
          success: false,
          message: 'Contact not found',
          data: []
        })
      }

      return res.status(HTTP_STATUS.OK).json({
        message: 'Get contact successfully',
        result: contact
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  static async deleteContact(req: Request, res: Response) {
    try {
      const { id } = req.params
      const deleted = await ContactCustomerServiceTypeORM.deleteContact(Number(id))

      return res.status(HTTP_STATUS.OK).json({
        message: 'Contact deleted successfully'
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to delete contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
