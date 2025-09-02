import MySQLService from './mysql.service'

interface AddProductBody {
  title: string
  description: string
  image_url: string
  company_id?: number
  detail_info?: string
}

export class ProductService {
  static async addProduct(productData: AddProductBody) {
    const { title, description, image_url, company_id, detail_info } = productData

    const sql = `
      INSERT INTO services (title, description, image_url, company_id, detail_info, is_delete) 
      VALUES (?, ?, ?, ?, ?, FALSE)
    `

    const params = [title, description, image_url, company_id || null, detail_info || null]

    const result = await MySQLService.query(sql, params)

    return {
      id: result.insertId,
      title,
      description,
      image_url,
      company_id,
      detail_info,
      created_at: new Date(),
      is_delete: false
    }
  }

  static async getProducts() {
    const sql = `
      SELECT id, title, description, image_url, company_id, detail_info, created_at 
      FROM services 
      WHERE is_delete = FALSE
      ORDER BY created_at DESC
    `

    const products = await MySQLService.query(sql)
    return products
  }

  static async getProductById(id: number) {
    const sql = `
      SELECT id, title, description, image_url, company_id, detail_info, created_at 
      FROM services 
      WHERE id = ? AND is_delete = FALSE
    `

    const products = await MySQLService.query(sql, [id])
    return products[0] || null
  }

  static async updateProduct(id: number, productData: Partial<AddProductBody>) {
    const { title, description, image_url, company_id, detail_info } = productData

    // First get the current product data
    const currentProduct = await this.getProductById(id)
    if (!currentProduct) {
      return false
    }

    // Only update fields that are provided, keep existing values for others
    const finalData = {
      title: title !== undefined ? title : currentProduct.title,
      description: description !== undefined ? description : currentProduct.description,
      image_url: image_url !== undefined ? image_url : currentProduct.image_url,
      company_id: company_id !== undefined ? company_id : currentProduct.company_id,
      detail_info: detail_info !== undefined ? detail_info : currentProduct.detail_info
    }

    const sql = `
      UPDATE services 
      SET title = ?, description = ?, image_url = ?, company_id = ?, detail_info = ?
      WHERE id = ? AND is_delete = FALSE
    `

    const params = [
      finalData.title,
      finalData.description,
      finalData.image_url,
      finalData.company_id,
      finalData.detail_info,
      id
    ]

    const result = await MySQLService.query(sql, params)
    return result.affectedRows > 0
  }

  static async deleteProduct(id: number) {
    const sql = `
      UPDATE services 
      SET is_delete = TRUE 
      WHERE id = ?
    `

    const result = await MySQLService.query(sql, [id])
    return result.affectedRows > 0
  }
}
