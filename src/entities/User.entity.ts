import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  // Relations - lazy loading to avoid circular dependencies
  @OneToMany('RefreshToken', 'user')
  refreshTokens: any[]
}
