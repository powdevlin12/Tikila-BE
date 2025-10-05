import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { FooterLink } from './FooterLink.entity'

@Entity('footer_columns')
export class FooterColumn {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string

  @Column({ name: 'position', type: 'int', nullable: false })
  position: number

  @OneToMany(() => FooterLink, (footerLink) => footerLink.footerColumn)
  footerLinks: FooterLink[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
