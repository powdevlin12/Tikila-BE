import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

export type NewsStatus = 'draft' | 'published'

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  title: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 280 })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null

  // longtext chứ không phải text: text giới hạn 64KB và MySQL cắt âm thầm khi
  // vượt, mất nội dung mà không báo lỗi.
  @Column({ type: 'longtext', nullable: true })
  content: string | null

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: NewsStatus

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null

  @Column({ name: 'is_delete', type: 'boolean', default: false })
  isDelete: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
