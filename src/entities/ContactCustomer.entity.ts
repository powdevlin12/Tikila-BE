import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('contact_customer')
export class ContactCustomer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: true })
  fullName: string

  @Column({ name: 'phone_customer', type: 'varchar', length: 11, nullable: true })
  phoneCustomer: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  message: string | null

  @Column({ name: 'service_id', type: 'int', nullable: true })
  serviceId: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  // Relations - lazy loading to avoid circular dependencies
  @ManyToOne('Service', 'contactCustomers')
  @JoinColumn({ name: 'service_id' })
  service: any
}
