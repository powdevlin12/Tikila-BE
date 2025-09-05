import MySQLService from './mysql.service'
import { FooterLink, CreateFooterLinkRequest, UpdateFooterLinkRequest } from '~/types/footer-link.types'

export class FooterLinkService {
  static async getAllFooterLinks(): Promise<FooterLink[]> {
    const sql = 'SELECT * FROM footer_links ORDER BY column_position, id'
    return await MySQLService.query(sql)
  }

  static async getFooterLinkById(id: number): Promise<FooterLink | null> {
    const sql = 'SELECT * FROM footer_links WHERE id = ?'
    const results = await MySQLService.query(sql, [id])
    return results[0] || null
  }

  static async getFooterLinksByColumn(columnPosition: number): Promise<FooterLink[]> {
    const sql = 'SELECT * FROM footer_links WHERE column_position = ? ORDER BY id'
    return await MySQLService.query(sql, [columnPosition])
  }

  static async createFooterLink(footerLink: CreateFooterLinkRequest): Promise<number> {
    const sql = `
      INSERT INTO footer_links (title, column_position, url, title_column)
      VALUES (?, ?, ?, ?)
    `
    const result = await MySQLService.query(sql, [
      footerLink.title,
      footerLink.column_position,
      footerLink.url,
      footerLink.title_column
    ])
    return result.insertId
  }

  static async updateFooterLink(id: number, footerLink: UpdateFooterLinkRequest): Promise<boolean> {
    const fields = []
    const values = []

    if (footerLink.title !== undefined) {
      fields.push('title = ?')
      values.push(footerLink.title)
    }
    if (footerLink.column_position !== undefined) {
      fields.push('column_position = ?')
      values.push(footerLink.column_position)
    }
    if (footerLink.url !== undefined) {
      fields.push('url = ?')
      values.push(footerLink.url)
    }
    if (footerLink.title_column !== undefined) {
      fields.push('title_column = ?')
      values.push(footerLink.title_column)
    }

    if (fields.length === 0) {
      return false
    }

    const sql = `UPDATE footer_links SET ${fields.join(', ')} WHERE id = ?`
    values.push(id)
    
    const result = await MySQLService.query(sql, values)
    return result.affectedRows > 0
  }

  static async deleteFooterLink(id: number): Promise<boolean> {
    const sql = 'DELETE FROM footer_links WHERE id = ?'
    const result = await MySQLService.query(sql, [id])
    return result.affectedRows > 0
  }

  static async deleteFooterLinksByColumn(columnPosition: number): Promise<number> {
    const sql = 'DELETE FROM footer_links WHERE column_position = ?'
    const result = await MySQLService.query(sql, [columnPosition])
    return result.affectedRows
  }
}
