import { Request, Response } from 'express'
import { ContactCustomerService } from '~/services/contact-customer.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { ContactCustomerData } from '~/types/contact-customer.types'

export class ContactCustomerController {
  static async saveCustomerContact(
    req: Request<Record<string, never>, Record<string, never>, ContactCustomerData>,
    res: Response
  ) {
    try {
      const { full_name, phone_customer, message, service_id } = req.body

      const contact = await ContactCustomerService.saveCustomerContact({
        full_name,
        phone_customer,
        message,
        service_id
      })

      return res.status(HTTP_STATUS.CREATED).json({
        message: 'Contact saved successfully',
        result: contact
      })
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to save contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  static async getAllContacts(req: Request, res: Response) {
    try {
      const contacts = await ContactCustomerService.getAllContacts()

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
      const contact = await ContactCustomerService.getContactById(Number(id))

      if (!contact) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: 'Contact not found'
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
      const deleted = await ContactCustomerService.deleteContact(Number(id))

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: 'Contact not found'
        })
      }

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
