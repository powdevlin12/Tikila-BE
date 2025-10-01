import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', type: 'varchar', length: 100 })
  userId: string

  @Column({ type: 'varchar', length: 255 })
  token: string

  @Column({ type: 'datetime' })
  iat: Date

  @Column({ type: 'datetime' })
  exp: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  // Relations - lazy loading to avoid circular dependencies
  @ManyToOne('User', 'refreshTokens')
  @JoinColumn({ name: 'user_id' })
  user: any
}
