import { Router } from 'express'
import serviceRegistrationDeviceController from '~/controllers/service-registration-device.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { validate } from '~/utils/validation'
import { wrapRequestHandler } from '~/utils/handlers'

const serviceRegistrationDeviceRouter = Router()

// Get all devices for a service registration
serviceRegistrationDeviceRouter.get(
  '/registration/:registrationId',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationDeviceController.getDevicesByRegistration)
)

// Get device by ID
serviceRegistrationDeviceRouter.get(
  '/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationDeviceController.getDeviceById)
)

// Create new device
serviceRegistrationDeviceRouter.post(
  '/',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationDeviceController.createDevice)
)

// Update device
serviceRegistrationDeviceRouter.put(
  '/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationDeviceController.updateDevice)
)

// Extend device
serviceRegistrationDeviceRouter.put(
  '/extend/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationDeviceController.extendDevice)
)

// Delete device (soft delete)
serviceRegistrationDeviceRouter.delete(
  '/:id',
  validate(accessTokenValidator),
  wrapRequestHandler(serviceRegistrationDeviceController.deleteDevice)
)

export default serviceRegistrationDeviceRouter
