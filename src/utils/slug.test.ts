import { describe, it, expect } from 'vitest'
import { slugify, buildUniqueSlug } from '~/utils/slug'

describe('slugify', () => {
  it('bỏ dấu tiếng Việt', () => {
    expect(slugify('Khai trương chi nhánh mới')).toBe('khai-truong-chi-nhanh-moi')
  })

  it('xử lý chữ đ thường (NFD không phân rã được chữ này)', () => {
    expect(slugify('Đường dây nóng')).toBe('duong-day-nong')
  })

  it('xử lý chữ Đ hoa', () => {
    expect(slugify('ĐẦU TƯ MỚI')).toBe('dau-tu-moi')
  })

  it('gộp ký tự đặc biệt và khoảng trắng thừa thành một dấu gạch', () => {
    expect(slugify('  Tin tức  &  Sự kiện!! ')).toBe('tin-tuc-su-kien')
  })

  it('giữ lại chữ số', () => {
    expect(slugify('Báo cáo quý 4 năm 2026')).toBe('bao-cao-quy-4-nam-2026')
  })

  it('trả về chuỗi rỗng khi không còn ký tự hợp lệ', () => {
    expect(slugify('--- !!! ---')).toBe('')
  })

  it('cắt tối đa 200 ký tự và không để lại gạch ở cuối', () => {
    const result = slugify('a'.repeat(150) + ' ' + 'b'.repeat(150))
    expect(result.length).toBeLessThanOrEqual(200)
    expect(result.endsWith('-')).toBe(false)
  })
})

describe('buildUniqueSlug', () => {
  it('dùng luôn slug gốc khi chưa tồn tại', async () => {
    const exists = async () => false
    expect(await buildUniqueSlug('Tin nội bộ', exists)).toBe('tin-noi-bo')
  })

  it('thêm hậu tố -2 khi slug gốc đã tồn tại', async () => {
    const taken = new Set(['tin-noi-bo'])
    const exists = async (s: string) => taken.has(s)
    expect(await buildUniqueSlug('Tin nội bộ', exists)).toBe('tin-noi-bo-2')
  })

  it('nhảy tới hậu tố trống đầu tiên', async () => {
    const taken = new Set(['tin-noi-bo', 'tin-noi-bo-2', 'tin-noi-bo-3'])
    const exists = async (s: string) => taken.has(s)
    expect(await buildUniqueSlug('Tin nội bộ', exists)).toBe('tin-noi-bo-4')
  })

  it('dùng slug dự phòng khi tiêu đề không sinh được ký tự nào', async () => {
    const exists = async () => false
    expect(await buildUniqueSlug('!!!', exists)).toBe('bai-viet')
  })
})
