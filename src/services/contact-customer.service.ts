import MySQLService from '~/services/mysql.service'
import { ContactCustomerData, ContactCustomer } from '~/types/contact-customer.types'

export class ContactCustomerService {
  private static mysqlService = MySQLService

  static async saveCustomerContact(data: ContactCustomerData): Promise<ContactCustomer> {
    const { full_name, phone_customer, message, service_id } = data

    const result = await this.mysqlService.query(
      `INSERT INTO contact_customer (full_name, phone_customer, message, service_id) 
       VALUES (?, ?, ?, ?)`,
      [full_name, phone_customer, message, service_id || null]
    )

    const contactId = result.insertId

    const contact = await this.mysqlService.query('SELECT * FROM contact_customer WHERE id = ?', [contactId])

    return contact[0]
  }

  static async getAllContacts(): Promise<ContactCustomer[]> {
    const contacts = await this.mysqlService.query(
      `SELECT cc.*, s.title as service_title 
       FROM contact_customer cc 
       LEFT JOIN services s ON cc.service_id = s.id 
       ORDER BY cc.created_at DESC`
    )

    return contacts
  }

  static async getContactById(id: number): Promise<ContactCustomer | null> {
    const contacts = await this.mysqlService.query(
      `SELECT cc.*, s.title as service_title 
       FROM contact_customer cc 
       LEFT JOIN services s ON cc.service_id = s.id 
       WHERE cc.id = ?`,
      [id]
    )

    return contacts.length > 0 ? contacts[0] : null
  }

  static async deleteContact(id: number): Promise<boolean> {
    const result = await this.mysqlService.query('DELETE FROM contact_customer WHERE id = ?', [id])

    return result.affectedRows > 0
  }
}
