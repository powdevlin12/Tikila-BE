import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('service_registrations')
export class ServiceRegistration {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer_name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  parent_id: string

  @Column({ type: 'varchar', length: 15, nullable: false })
  phone: string

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date

  @Column({ type: 'int', nullable: false, comment: 'Duration in months' })
  duration_months: number

  @Column({ type: 'datetime', nullable: false })
  end_date: Date

  @Column({ type: 'varchar', length: 20, default: 'active', comment: 'active, expired, cancelled' })
  status: string

  @Column({ type: 'decimal', precision: 15, scale: 0, default: 0, comment: 'Amount paid by customer' })
  amount_paid: number

  @Column({ type: 'decimal', precision: 15, scale: 0, default: 0, comment: 'Amount due from customer' })
  amount_due: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
