import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('company_info')
export class CompanyInfo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string

  @Column({ name: 'intro_text', type: 'text', nullable: true })
  introText: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string

  @Column({ name: 'tax_code', type: 'varchar', length: 50, nullable: true })
  taxCode: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string

  @Column({ name: 'welcome_content', type: 'varchar', length: 500, nullable: true })
  welcomeContent: string

  @Column({ name: 'version_info', type: 'int', nullable: true })
  versionInfo: number | null

  @Column({ name: 'contact_id', type: 'int', nullable: true })
  contactId: number | null

  @Column({ name: 'img_intro', type: 'varchar', length: 500, nullable: true })
  imgIntro: string

  @Column({ name: 'BANNER', type: 'varchar', length: 255, nullable: true })
  banner: string

  @Column({ name: 'COUNT_CUSTOMER', type: 'int', default: 0 })
  countCustomer: number

  @Column({ name: 'COUNT_CUSTOMER_SATISFY', type: 'int', default: 0 })
  countCustomerSatisfy: number

  @Column({ name: 'COUNT_QUANLITY', type: 'int', default: 100 })
  countQuality: number

  @Column({ name: 'intro_text_detail', type: 'text', nullable: true })
  introTextDetail: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
