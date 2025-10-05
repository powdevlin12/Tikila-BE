import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('dashboard_statistics')
export class DashboardStatistics {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'total_contacts', type: 'int', default: 0 })
  totalContacts: number

  @Column({ name: 'total_products', type: 'int', default: 0 })
  totalProducts: number

  @Column({ name: 'total_reviews', type: 'int', default: 0 })
  totalReviews: number

  @Column({ name: 'total_registrations', type: 'int', default: 0 })
  totalRegistrations: number

  @Column({ name: 'total_users', type: 'int', default: 0 })
  totalUsers: number

  @Column({ name: 'active_registrations', type: 'int', default: 0 })
  activeRegistrations: number

  @Column({ name: 'expired_registrations', type: 'int', default: 0 })
  expiredRegistrations: number

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number

  @Column({ name: 'new_contacts_this_month', type: 'int', default: 0 })
  newContactsThisMonth: number

  @Column({ name: 'new_registrations_this_month', type: 'int', default: 0 })
  newRegistrationsThisMonth: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
