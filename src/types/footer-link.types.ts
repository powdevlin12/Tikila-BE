export interface FooterLink {
  id?: number
  title: string
  column_position: number
  url: string
  title_column: string
  created_at?: Date
}

export interface CreateFooterLinkRequest {
  title: string
  column_position: number
  url: string
  title_column: string
}

export interface UpdateFooterLinkRequest {
  title?: string
  column_position?: number
  url?: string
  title_column?: string
}

export interface FooterLinkResponse {
  message: string
  data?: FooterLink | FooterLink[] | { id: number } | { deletedCount: number }
}
