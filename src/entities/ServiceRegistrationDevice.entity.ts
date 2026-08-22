import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ServiceRegistration } from './ServiceRegistration.entity'

@Entity('service_registration_devices')
export class ServiceRegistrationDevice {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string

  @Column({ name: 'service_registration_id', type: 'varchar', length: 100, nullable: false })
  service_registration_id: string

  @ManyToOne(() => ServiceRegistration)
  @JoinColumn({ name: 'service_registration_id' })
  serviceRegistration: ServiceRegistration

  @Column({ type: 'varchar', length: 255, nullable: false })
  machine_name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  machine_code: string

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date

  @Column({ type: 'int', nullable: false, comment: 'Duration in months' })
  duration_months: number

  @Column({ type: 'datetime', nullable: false })
  end_date: Date

  @Column({ type: 'varchar', length: 20, default: 'active', comment: 'active, cancelled' })
  status: string

  @Column({ type: 'decimal', precision: 15, scale: 0, default: 0, comment: 'Amount paid for this device' })
  amount_paid: number

  @Column({ type: 'decimal', precision: 15, scale: 0, default: 0, comment: 'Amount due for this device' })
  amount_due: number

  @Column({ type: 'text', nullable: true })
  notes: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
