import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { FooterColumn } from './FooterColumn.entity'

@Entity('footer_links')
export class FooterLink {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string

  @Column({ name: 'order_position', type: 'int', nullable: true, default: 0 })
  orderPosition: number

  @Column({ name: 'footer_column_id', type: 'int', nullable: true })
  footerColumnId: number

  @ManyToOne(() => FooterColumn, (footerColumn) => footerColumn.footerLinks)
  @JoinColumn({ name: 'footer_column_id' })
  footerColumn: FooterColumn

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
