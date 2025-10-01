import typeormService from './typeorm.service'
import { FooterLink } from '~/entities'

interface CreateFooterLinkBody {
  title: string
  column_position: number
  url: string
  title_column: string
}

export class FooterLinkServiceTypeORM {
  static async createFooterLink(data: CreateFooterLinkBody) {
    const footerLink = new FooterLink()
    footerLink.title = data.title
    footerLink.columnPosition = data.column_position
    footerLink.url = data.url
    footerLink.titleColumn = data.title_column

    return await typeormService.footerLinkRepository.save(footerLink)
  }

  static async getAllFooterLinks() {
    return await typeormService.footerLinkRepository.find({
      order: { columnPosition: 'ASC', createdAt: 'DESC' }
    })
  }

  static async getFooterLinkById(id: number) {
    return await typeormService.footerLinkRepository.findOne({
      where: { id }
    })
  }

  static async getFooterLinksByColumn(columnPosition: number) {
    return await typeormService.footerLinkRepository.find({
      where: { columnPosition },
      order: { createdAt: 'DESC' }
    })
  }

  static async updateFooterLink(id: number, updateData: Partial<CreateFooterLinkBody>) {
    const updatePayload: any = {}

    if (updateData.title) updatePayload.title = updateData.title
    if (updateData.column_position !== undefined) updatePayload.columnPosition = updateData.column_position
    if (updateData.url) updatePayload.url = updateData.url
    if (updateData.title_column) updatePayload.titleColumn = updateData.title_column

    await typeormService.footerLinkRepository.update(id, updatePayload)
    return await this.getFooterLinkById(id)
  }

  static async deleteFooterLink(id: number) {
    await typeormService.footerLinkRepository.delete(id)
    return { message: 'Footer link deleted successfully' }
  }

  static async getFooterLinksGroupedByColumn() {
    const footerLinks = await this.getAllFooterLinks()

    const grouped = footerLinks.reduce((acc, link) => {
      if (!acc[link.columnPosition]) {
        acc[link.columnPosition] = {
          columnPosition: link.columnPosition,
          titleColumn: link.titleColumn,
          links: []
        }
      }
      acc[link.columnPosition].links.push({
        id: link.id,
        title: link.title,
        url: link.url,
        createdAt: link.createdAt
      })
      return acc
    }, {} as any)

    return Object.values(grouped)
  }
}

export default FooterLinkServiceTypeORM
