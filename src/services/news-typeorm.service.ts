import { Not } from 'typeorm'
import typeormService from './typeorm.service'
import { News } from '~/entities'
import type { NewsStatus } from '~/entities/News.entity'
import { buildUniqueSlug, slugify } from '~/utils/slug'

export interface CreateNewsBody {
  title: string
  description?: string | null
  image_url?: string | null
  content?: string | null
  status?: NewsStatus
}

export interface UpdateNewsBody {
  title?: string
  slug?: string
  description?: string | null
  image_url?: string | null
  content?: string | null
  status?: NewsStatus
}

export interface PaginatedNews {
  items: News[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const slugTaken = (excludeId?: number) => async (slug: string) => {
  const found = await typeormService.newsRepository.findOne({
    where: excludeId ? { slug, id: Not(excludeId) } : { slug },
    select: { id: true }
  })
  return found !== null
}

export class NewsServiceTypeORM {
  static async createNews(data: CreateNewsBody) {
    const news = new News()
    news.title = data.title
    news.slug = await buildUniqueSlug(data.title, slugTaken())
    news.description = data.description ?? null
    news.imageUrl = data.image_url ?? null
    news.content = data.content ?? null
    news.status = data.status ?? 'draft'
    news.publishedAt = news.status === 'published' ? new Date() : null
    news.isDelete = false

    return await typeormService.newsRepository.save(news)
  }

  static async updateNews(id: number, data: UpdateNewsBody) {
    const news = await typeormService.newsRepository.findOne({ where: { id, isDelete: false } })
    if (!news) return null

    // Sửa tiêu đề KHÔNG đổi slug — slug chỉ đổi khi admin gửi slug lên rõ ràng.
    // Nếu slug chạy theo tiêu đề thì mọi link đã chia sẻ và thứ hạng Google
    // của bài đó chết ngay khi sửa một lỗi chính tả.
    if (data.slug !== undefined) {
      news.slug = await buildUniqueSlug(slugify(data.slug) || data.slug, slugTaken(id))
    }

    if (data.title !== undefined) news.title = data.title
    if (data.description !== undefined) news.description = data.description
    if (data.image_url !== undefined) news.imageUrl = data.image_url
    if (data.content !== undefined) news.content = data.content

    if (data.status !== undefined) {
      // publishedAt chỉ set lần đầu chuyển sang published, để bài đăng rồi
      // chuyển về nháp rồi đăng lại không bị nhảy lên đầu danh sách.
      if (data.status === 'published' && news.publishedAt === null) {
        news.publishedAt = new Date()
      }
      news.status = data.status
    }

    return await typeormService.newsRepository.save(news)
  }

  static async softDeleteNews(id: number) {
    const result = await typeormService.newsRepository.update({ id, isDelete: false }, { isDelete: true })
    return result.affected === 1
  }

  static async getPublishedList(page: number, limit: number): Promise<PaginatedNews> {
    const [items, total] = await typeormService.newsRepository.findAndCount({
      where: { status: 'published', isDelete: false },
      order: { publishedAt: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    })

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getPublishedBySlug(slug: string) {
    return await typeormService.newsRepository.findOne({
      where: { slug, status: 'published', isDelete: false }
    })
  }

  static async getAdminList(page: number, limit: number, status?: NewsStatus): Promise<PaginatedNews> {
    const [items, total] = await typeormService.newsRepository.findAndCount({
      where: status ? { status, isDelete: false } : { isDelete: false },
      order: { createdAt: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    })

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getById(id: number) {
    return await typeormService.newsRepository.findOne({ where: { id, isDelete: false } })
  }
}
