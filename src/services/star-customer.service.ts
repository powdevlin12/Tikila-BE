import MySQLService from './mysql.service'

export interface StarCustomer {
  id?: number
  star: number
  name_customer: string
  content?: string
  created_at?: Date
  updated_at?: Date
}

export interface CreateStarCustomerPayload {
  star: number
  name_customer: string
  content?: string
}

export class StarCustomerService {
  static async addStarCustomer(payload: CreateStarCustomerPayload): Promise<StarCustomer> {
    const { star, name_customer, content } = payload

    // Validate star rating
    if (star < 1 || star > 5) {
      throw new Error('Star rating must be between 1 and 5')
    }

    // Validate required fields
    if (!name_customer || name_customer.trim().length === 0) {
      throw new Error('Customer name is required')
    }

    const sql = `
      INSERT INTO star_customer (star, name_customer, content)
      VALUES (?, ?, ?)
    `

    const result = await MySQLService.query(sql, [star, name_customer.trim(), content || ''])

    const insertedId = result.insertId

    // Return the created star customer
    const createdStarCustomer = await this.getStarCustomerById(insertedId)
    if (!createdStarCustomer) {
      throw new Error('Failed to retrieve created star customer')
    }
    return createdStarCustomer
  }

  static async getStarCustomers(): Promise<StarCustomer[]> {
    const sql = `
      SELECT id, star, name_customer, content, created_at, updated_at
      FROM star_customer
      ORDER BY created_at DESC
    `

    const results = await MySQLService.query(sql)
    return results
  }

  static async getStarCustomerById(id: number): Promise<StarCustomer | null> {
    const sql = `
      SELECT id, star, name_customer, content, created_at, updated_at
      FROM star_customer
      WHERE id = ?
    `

    const results = await MySQLService.query(sql, [id])
    return results.length > 0 ? results[0] : null
  }

  static async deleteStarCustomer(id: number): Promise<boolean> {
    const sql = `
      DELETE FROM star_customer
      WHERE id = ?
    `

    const result = await MySQLService.query(sql, [id])
    return result.affectedRows > 0
  }

  static async getStarCustomerStats(): Promise<{
    total: number
    averageRating: number
    ratingDistribution: { [key: number]: number }
  }> {
    // Get total count and average rating
    const statsSql = `
      SELECT 
        COUNT(*) as total,
        AVG(star) as averageRating
      FROM star_customer
    `

    const statsResult = await MySQLService.query(statsSql)
    const stats = statsResult[0]

    // Get rating distribution
    const distributionSql = `
      SELECT star, COUNT(*) as count
      FROM star_customer
      GROUP BY star
      ORDER BY star
    `

    const distributionResult = await MySQLService.query(distributionSql)

    // Initialize distribution with 0 for all ratings
    const ratingDistribution: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    // Fill in actual counts
    distributionResult.forEach((row: any) => {
      ratingDistribution[row.star] = row.count
    })

    return {
      total: stats.total || 0,
      averageRating: parseFloat(stats.averageRating) || 0,
      ratingDistribution
    }
  }
}
