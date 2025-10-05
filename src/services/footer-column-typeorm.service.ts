import typeormService from './typeorm.service'
import { FooterColumn } from '~/entities'

interface CreateFooterColumnBody {
  title: string
  position: number
}

interface UpdateFooterColumnBody {
  title?: string
  position?: number
}

export class FooterColumnServiceTypeORM {
  static async createFooterColumn(data: CreateFooterColumnBody) {
    const footerColumn = new FooterColumn()
    footerColumn.title = data.title
    footerColumn.position = data.position

    return await typeormService.footerColumnRepository.save(footerColumn)
  }

  static async getAllFooterColumns() {
    return await typeormService.footerColumnRepository.find({
      relations: ['footerLinks'],
      order: {
        position: 'ASC',
        footerLinks: {
          orderPosition: 'ASC'
        }
      }
    })
  }

  static async getFooterColumnById(id: number) {
    return await typeormService.footerColumnRepository.findOne({
      where: { id },
      relations: ['footerLinks']
    })
  }

  static async updateFooterColumn(id: number, data: UpdateFooterColumnBody) {
    const updateData: any = {}

    if (data.title !== undefined) {
      updateData.title = data.title
    }

    if (data.position !== undefined) {
      updateData.position = data.position
    }

    const result = await typeormService.footerColumnRepository.update(id, updateData)
    return result.affected === 1
  }

  static async deleteFooterColumn(id: number) {
    const result = await typeormService.footerColumnRepository.delete(id)
    return result.affected === 1
  }
}
