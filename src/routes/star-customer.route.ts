import { Router } from 'express'
import { StarCustomerController } from '~/controllers/star-customer.controller'

const starCustomerRouter = Router()

// Add a new star customer review
starCustomerRouter.post('/add', StarCustomerController.addStarCustomer)

// Get star customer statistics (total, average rating, distribution) - must come before /:id
starCustomerRouter.get('/stats/summary', StarCustomerController.getStarCustomerStats)

// Get all star customer reviews
starCustomerRouter.get('/', StarCustomerController.getStarCustomers)

// Get star customer review by ID
starCustomerRouter.get('/:id', StarCustomerController.getStarCustomerById)

// Delete star customer review
starCustomerRouter.delete('/:id', StarCustomerController.deleteStarCustomer)

export default starCustomerRouter
