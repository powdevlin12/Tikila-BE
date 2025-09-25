import mysql from 'mysql2/promise'
import { envConfig } from '~/constants/config'
import { hashPassword } from '~/utils/cryto'
import { generateId } from '~/utils/gererator'

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
      await this.createDefaultAdminUser()
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
          COUNT_QUANLITY INT DEFAULT 100,
          intro_text_detail TEXT
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

      await this.query(`
        CREATE TABLE IF NOT EXISTS star_customer (
          id INT AUTO_INCREMENT PRIMARY KEY,
          star INT NOT NULL CHECK (star >= 1 AND star <= 5),
          name_customer VARCHAR(255) NOT NULL,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
      const columnsToAdd = [{ name: 'intro_text_detail', definition: 'TEXT' }]

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

  public async createDefaultAdminUser(): Promise<void> {
    try {
      console.log('🔄 Checking for default admin user...')

      // Check if admin user already exists
      const checkAdminQuery = 'SELECT id FROM users WHERE email = ?'
      const existingAdmin = await this.query(checkAdminQuery, ['admin@gmail.com'])

      if (existingAdmin && existingAdmin.length > 0) {
        console.log('✅ Admin user already exists, skipping creation.')
        return
      }

      // Create default admin user
      const adminId = generateId()
      const adminName = 'Administrator'
      const adminEmail = 'admin@gmail.com'
      const adminPassword = '!Thudat68'
      const hashedPassword = hashPassword(adminPassword)

      const insertAdminQuery = `
        INSERT INTO users (id, name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `

      await this.query(insertAdminQuery, [adminId, adminName, adminEmail, hashedPassword, new Date(), new Date()])

      console.log('✅ Default admin user created successfully!')
      console.log(`📧 Email: ${adminEmail}`)
      console.log(`🔑 Password: ${adminPassword}`)
    } catch (error) {
      console.error('❌ Error creating default admin user:', error)
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
