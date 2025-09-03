import { Router } from 'express'
import { ContactCustomerController } from '~/controllers/contact-customer.controller'
import { validateContactCustomer, validateContactId } from '~/middlewares/contact-customer.middleware'

const contactCustomerRouter = Router()

// Save customer contact
contactCustomerRouter.post('/', validateContactCustomer, ContactCustomerController.saveCustomerContact)

// Get all contacts (admin only)
contactCustomerRouter.get('/', ContactCustomerController.getAllContacts)

// Get contact by ID (admin only)
contactCustomerRouter.get('/:id', validateContactId, ContactCustomerController.getContactById)

// Delete contact (admin only)
contactCustomerRouter.delete('/:id', validateContactId, ContactCustomerController.deleteContact)

export default contactCustomerRouter
