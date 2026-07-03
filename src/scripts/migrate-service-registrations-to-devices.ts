import 'reflect-metadata'
import { AppDataSource } from '~/config/database'
import { generateId } from '~/utils/gererator'
import { ServiceRegistration, ServiceRegistrationDevice } from '~/entities'

async function migrate() {
  await AppDataSource.initialize()

  const registrationRepo = AppDataSource.getRepository(ServiceRegistration)
  const deviceRepo = AppDataSource.getRepository(ServiceRegistrationDevice)

  const registrations = await registrationRepo.find()

  let created = 0
  let skipped = 0

  for (const registration of registrations) {
    const existingDevice = await deviceRepo.findOne({
      where: { service_registration_id: registration.id }
    })

    if (existingDevice) {
      skipped++
      continue
    }

    const device = new ServiceRegistrationDevice()
    device.id = generateId()
    device.service_registration_id = registration.id
    device.machine_name = registration.customer_name
    device.machine_code = ''
    device.registrationDate = registration.registrationDate
    device.duration_months = registration.duration_months
    device.end_date = registration.end_date
    device.status = registration.status
    device.amount_paid = registration.amount_paid
    device.amount_due = registration.amount_due
    device.notes = ''

    await deviceRepo.save(device)
    created++
  }

  console.log(`✅ Migrate hoàn tất: tạo mới ${created} máy, bỏ qua ${skipped} đăng ký đã có máy.`)

  await AppDataSource.destroy()
}

migrate().catch((error) => {
  console.error('❌ Lỗi khi migrate dữ liệu máy:', error)
  process.exit(1)
})
