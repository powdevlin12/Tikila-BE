import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string

  @Column({ name: 'company_id', type: 'int', nullable: true })
  companyId: number | null

  @Column({ name: 'detail_info', type: 'text', nullable: true })
  detailInfo: string | null

  @Column({ name: 'is_delete', type: 'boolean', default: false })
  isDelete: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  // Relations - lazy loading to avoid circular dependencies
  @OneToMany('ContactCustomer', 'service')
  contactCustomers: any[]
}
