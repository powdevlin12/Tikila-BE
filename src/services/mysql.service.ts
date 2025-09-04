import mysql from 'mysql2/promise'
import { envConfig } from '~/constants/config'

export class MySQLService {
  private static instance: MySQLService
  private pool: mysql.Pool

  constructor() {
    this.pool = mysql.createPool({
      host: envConfig.mysqlHost,
      port: envConfig.mysqlPort,
      user: envConfig.mysqlUsername,
      password: envConfig.mysqlPassword,
      database: envConfig.mysqlDatabase,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    })
  }

  public static getInstance(): MySQLService {
    if (!MySQLService.instance) {
      MySQLService.instance = new MySQLService()
    }
    return MySQLService.instance
  }

  public async connect(): Promise<void> {
    try {
      const connection = await this.pool.getConnection()
      connection.release()
      console.log('✅ Connected to MySQL database successfully!')
      await this.createTables()
    } catch (error) {
      console.error('❌ Error connecting to MySQL:', error)
      throw error
    }
  }

  public async connectWithoutCreateTables(): Promise<void> {
    try {
      const connection = await this.pool.getConnection()
      connection.release()
      console.log('✅ Connected to MySQL database successfully!')
    } catch (error) {
      console.error('❌ Error connecting to MySQL:', error)
      throw error
    }
  }

  public async query(sql: string, params?: any[]): Promise<any> {
    try {
      const [results] = await this.pool.execute(sql, params)
      return results
    } catch (error) {
      console.error('❌ Error executing query:', error)
      throw error
    }
  }

  public async createTables(): Promise<void> {
    try {
      console.log('🔄 Creating database tables...')

      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(100),
          password VARCHAR(100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(100),
          token VARCHAR(255),
          iat DATETIME,
          exp DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS company_info (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          logo_url VARCHAR(500),
          intro_text TEXT,
          address VARCHAR(500),
          tax_code VARCHAR(50),
          email VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          welcome_content VARCHAR(500),
          version_info INT,
          contact_id INT,
          img_intro VARCHAR(500),
          BANNER VARCHAR(255),
          COUNT_CUSTOMER INT DEFAULT 0,
          COUNT_CUSTOMER_SATISFY INT DEFAULT 0,
          COUNT_QUANLITY INT DEFAULT 100
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS contact_company (
          id INT AUTO_INCREMENT PRIMARY KEY,
          facebook_link VARCHAR(255),
          tiktok_link VARCHAR(255),
          zalo_link VARCHAR(255),
          phone VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url VARCHAR(500),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_delete BOOLEAN DEFAULT FALSE,
          company_id INT,
          detail_info TEXT
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS footer_links (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          column_position INT,
          url VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          title_column VARCHAR(255)
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS contact_customer (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(100),
          phone_customer VARCHAR(11),
          message VARCHAR(500),
          service_id INT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (service_id) REFERENCES services(id)
        )
      `)

      console.log('✅ All tables created successfully!')
    } catch (error) {
      console.error('❌ Error creating tables:', error)
      throw error
    }
  }

  public async updateCompanyInfoTable(): Promise<void> {
    try {
      console.log('🔄 Updating company_info table structure...')

      // Kiểm tra và thêm các columns mới
      const columnsToAdd = [
        { name: 'img_intro', definition: 'VARCHAR(500)' },
        { name: 'BANNER', definition: 'VARCHAR(255)' },
        { name: 'COUNT_CUSTOMER', definition: 'INT DEFAULT 0' },
        { name: 'COUNT_CUSTOMER_SATISFY', definition: 'INT DEFAULT 0' },
        { name: 'COUNT_QUANLITY', definition: 'INT DEFAULT 100' }
      ]

      for (const column of columnsToAdd) {
        try {
          // Kiểm tra xem column đã tồn tại chưa
          const checkResult = await this.query(
            `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'company_info' 
            AND COLUMN_NAME = ?
          `,
            [column.name]
          )

          // Nếu column chưa tồn tại thì thêm vào
          if (checkResult.length === 0) {
            await this.query(`
              ALTER TABLE company_info 
              ADD COLUMN ${column.name} ${column.definition}
            `)
            console.log(`✅ Added column ${column.name}`)
          } else {
            console.log(`ℹ️ Column ${column.name} already exists`)
          }
        } catch (columnError) {
          console.error(`❌ Error adding column ${column.name}:`, columnError)
        }
      }

      console.log('✅ Company info table updated successfully!')
    } catch (error) {
      console.error('❌ Error updating company_info table:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.pool.end()
      console.log('✅ Disconnected from MySQL database')
    } catch (error) {
      console.error('❌ Error disconnecting from MySQL:', error)
    }
  }
}

export default MySQLService.getInstance()
