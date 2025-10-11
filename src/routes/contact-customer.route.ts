import { Router } from 'express'
import { ContactCustomerController } from '~/controllers/contact-customer.controller'
import {
  contactCustomerValidator,
  validateContactCustomer,
  validateContactId
} from '~/middlewares/contact-customer.middleware'
import { validate } from '~/utils/validation'

const contactCustomerRouter = Router()

// Save customer contact
contactCustomerRouter.post('/', validate(contactCustomerValidator), ContactCustomerController.saveCustomerContact)

// Get all contacts (admin only)
contactCustomerRouter.get('/', ContactCustomerController.getAllContacts)

// Get contact by ID (admin only)
contactCustomerRouter.get('/:id', validateContactId, ContactCustomerController.getContactById)

// Delete contact (admin only)
contactCustomerRouter.delete('/:id', validateContactId, ContactCustomerController.deleteContact)

export default contactCustomerRouter
