import typeormService from './typeorm.service'
import { FooterLink } from '~/entities'

interface CreateFooterLinkBody {
  title: string
  url: string
  orderPosition?: number
  footerColumnId: number
}

interface UpdateFooterLinkBody {
  title?: string
  url?: string
  orderPosition?: number
  footerColumnId?: number
}

export class FooterLinkServiceTypeORM {
  static async createFooterLink(data: CreateFooterLinkBody) {
    const footerLink = new FooterLink()
    footerLink.title = data.title
    footerLink.url = data.url
    footerLink.orderPosition = data.orderPosition || 0
    footerLink.footerColumnId = data.footerColumnId

    return await typeormService.footerLinkRepository.save(footerLink)
  }

  static async getAllFooterLinks() {
    return await typeormService.footerLinkRepository.find({
      relations: ['footerColumn'],
      order: {
        footerColumn: { position: 'ASC' },
        orderPosition: 'ASC',
        createdAt: 'DESC'
      }
    })
  }

  static async getFooterLinkById(id: number) {
    return await typeormService.footerLinkRepository.findOne({
      where: { id },
      relations: ['footerColumn']
    })
  }

  static async getFooterLinksByColumn(footerColumnId: number) {
    return await typeormService.footerLinkRepository.find({
      where: { footerColumnId },
      relations: ['footerColumn'],
      order: { orderPosition: 'ASC', createdAt: 'DESC' }
    })
  }

  static async updateFooterLink(id: number, updateData: UpdateFooterLinkBody) {
    const updatePayload: any = {}

    if (updateData.title !== undefined) updatePayload.title = updateData.title
    if (updateData.url !== undefined) updatePayload.url = updateData.url
    if (updateData.orderPosition !== undefined) updatePayload.orderPosition = updateData.orderPosition
    if (updateData.footerColumnId !== undefined) updatePayload.footerColumnId = updateData.footerColumnId

    await typeormService.footerLinkRepository.update(id, updatePayload)
    return await this.getFooterLinkById(id)
  }

  static async deleteFooterLink(id: number) {
    const result = await typeormService.footerLinkRepository.delete(id)
    return result.affected === 1
  }

  static async getFooterLinksGroupedByColumn() {
    const footerLinks = await this.getAllFooterLinks()

    const grouped = footerLinks.reduce((acc, link) => {
      const columnId = link.footerColumnId
      if (!acc[columnId]) {
        acc[columnId] = {
          columnId: columnId,
          columnTitle: link.footerColumn?.title || '',
          columnPosition: link.footerColumn?.position || 0,
          links: []
        }
      }
      acc[columnId].links.push({
        id: link.id,
        title: link.title,
        url: link.url,
        orderPosition: link.orderPosition,
        createdAt: link.createdAt
      })
      return acc
    }, {} as any)

    return Object.values(grouped)
  }
}

export default FooterLinkServiceTypeORM
