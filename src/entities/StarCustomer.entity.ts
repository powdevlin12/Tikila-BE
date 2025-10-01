import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('star_customer')
export class StarCustomer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  star: number

  @Column({ name: 'name_customer', type: 'varchar', length: 255 })
  nameCustomer: string

  @Column({ type: 'text', nullable: true })
  content: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
