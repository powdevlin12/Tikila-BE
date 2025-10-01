import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('footer_links')
export class FooterLink {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string

  @Column({ name: 'column_position', type: 'int', nullable: true })
  columnPosition: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string

  @Column({ name: 'title_column', type: 'varchar', length: 255, nullable: true })
  titleColumn: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
