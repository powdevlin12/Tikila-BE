import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('contact_company')
export class ContactCompany {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'facebook_link', type: 'varchar', length: 255, nullable: true })
  facebookLink: string

  @Column({ name: 'tiktok_link', type: 'varchar', length: 255, nullable: true })
  tiktokLink: string

  @Column({ name: 'zalo_link', type: 'varchar', length: 255, nullable: true })
  zaloLink: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
