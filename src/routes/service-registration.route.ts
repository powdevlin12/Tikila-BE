import { Router } from 'express'
import serviceRegistrationController from '~/controllers/service-registration.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { validate } from '~/utils/validation'
import { wrapRequestHandler } from '~/utils/handlers'

const serviceRegistrationRouter = Router()

// Get all service registrations with optional filters
serviceRegistrationRouter.get(
  '/',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.getServiceRegistrations)
)

// Get service registration by ID
serviceRegistrationRouter.get(
  '/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.getServiceRegistrationById)
)

// Create new service registration
serviceRegistrationRouter.post(
  '/',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.createServiceRegistration)
)

// Update service registration
serviceRegistrationRouter.put(
  '/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.updateServiceRegistration)
)

// Delete service registration (soft delete)
serviceRegistrationRouter.delete(
  '/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.deleteServiceRegistration)
)

// Permanent delete service registration
serviceRegistrationRouter.delete(
  '/:id/permanent',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.permanentDeleteServiceRegistration)
)

// Get registrations expiring soon
serviceRegistrationRouter.get(
  '/expiring/soon',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.getExpiringSoon)
)

// Get expired registrations
serviceRegistrationRouter.get(
  '/expired/list',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.getExpiredRegistrations)
)

// Update expired registrations status
serviceRegistrationRouter.post(
  '/expired/update',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.updateExpiredRegistrations)
)

// Get statistics
serviceRegistrationRouter.get(
  '/stats/overview',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationController.getStatistics)
)

export default serviceRegistrationRouter
