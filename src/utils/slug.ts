const MAX_SLUG_LENGTH = 200

/**
 * Chuyển tiêu đề tiếng Việt thành slug dùng cho URL.
 *
 * Lưu ý: chữ "đ"/"Đ" KHÔNG phân rã được bằng normalize('NFD') vì nó là một
 * chữ cái riêng có nét gạch, không phải nguyên âm ghép dấu. Phải thay riêng.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '')
}

/**
 * Sinh slug chắc chắn không trùng. `exists` do tầng service truyền vào để
 * tra DB — tách ra như vậy nên hàm này test được mà không cần database.
 */
export async function buildUniqueSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(title) || 'bai-viet'

  if (!(await exists(base))) {
    return base
  }

  let suffix = 2
  while (await exists(`${base}-${suffix}`)) {
    suffix++
  }
  return `${base}-${suffix}`
}
