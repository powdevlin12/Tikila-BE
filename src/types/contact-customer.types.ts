export interface ContactCustomerData {
  full_name: string
  phone_customer: string
  message: string
  service_id?: number
}

export interface ContactCustomer {
  id: number
  full_name: string
  phone_customer: string
  message: string
  service_id?: number
  created_at: Date
  service_title?: string
}

export interface ContactCustomerResponse {
  message: string
  result: ContactCustomer
}

export interface ContactCustomerListResponse {
  message: string
  result: ContactCustomer[]
}
