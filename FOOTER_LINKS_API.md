# Footer Links API

API để quản lý các footer links của website.

## Endpoints

### 1. Lấy tất cả footer links
- **Method**: GET
- **URL**: `/footer-links`
- **Response**: 
```json
{
  "message": "Get footer links successfully",
  "data": [
    {
      "id": 1,
      "title": "Về chúng tôi",
      "column_position": 1,
      "url": "/about",
      "title_column": "Công ty",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Lấy footer link theo ID
- **Method**: GET
- **URL**: `/footer-links/:id`
- **Params**: 
  - `id` (number): ID của footer link
- **Response**: 
```json
{
  "message": "Get footer link successfully",
  "data": {
    "id": 1,
    "title": "Về chúng tôi",
    "column_position": 1,
    "url": "/about",
    "title_column": "Công ty",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3. Lấy footer links theo cột
- **Method**: GET
- **URL**: `/footer-links/column/:columnPosition`
- **Params**: 
  - `columnPosition` (number): Vị trí cột (1, 2, 3, ...)
- **Response**: 
```json
{
  "message": "Get footer links by column successfully",
  "data": [
    {
      "id": 1,
      "title": "Về chúng tôi",
      "column_position": 1,
      "url": "/about",
      "title_column": "Công ty",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Tạo footer link mới
- **Method**: POST
- **URL**: `/footer-links`
- **Body**: 
```json
{
  "title": "Liên hệ",
  "column_position": 1,
  "url": "/contact",
  "title_column": "Công ty"
}
```
- **Response**: 
```json
{
  "message": "Create footer link successfully",
  "data": {
    "id": 2
  }
}
```

### 5. Cập nhật footer link
- **Method**: PUT
- **URL**: `/footer-links/:id`
- **Params**: 
  - `id` (number): ID của footer link
- **Body**: 
```json
{
  "title": "Liên hệ mới",
  "url": "/new-contact"
}
```
- **Response**: 
```json
{
  "message": "Update footer link successfully"
}
```

### 6. Xóa footer link
- **Method**: DELETE
- **URL**: `/footer-links/:id`
- **Params**: 
  - `id` (number): ID của footer link
- **Response**: 
```json
{
  "message": "Delete footer link successfully"
}
```

### 7. Xóa tất cả footer links theo cột
- **Method**: DELETE
- **URL**: `/footer-links/column/:columnPosition`
- **Params**: 
  - `columnPosition` (number): Vị trí cột
- **Response**: 
```json
{
  "message": "Deleted 3 footer links successfully",
  "data": {
    "deletedCount": 3
  }
}
```

## Validation Rules

### Khi tạo footer link mới:
- `title`: Bắt buộc, tối đa 255 ký tự
- `column_position`: Bắt buộc, số nguyên dương
- `url`: Bắt buộc, tối đa 255 ký tự
- `title_column`: Bắt buộc, tối đa 255 ký tự

### Khi cập nhật footer link:
- Tất cả các trường đều optional
- Nếu có, phải tuân theo quy tắc tương tự như khi tạo mới

## Error Responses

### 400 - Bad Request (Validation Error)
```json
{
  "message": "Validation error",
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

### 404 - Not Found
```json
{
  "message": "Footer link not found"
}
```

### 500 - Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details..."
}
```

## Database Schema

Table: `footer_links`

| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | ID duy nhất |
| title | VARCHAR(255) | Tên hiển thị của link |
| column_position | INT | Vị trí cột (1, 2, 3, ...) |
| url | VARCHAR(255) | Đường dẫn URL |
| title_column | VARCHAR(255) | Tiêu đề của cột |
| created_at | DATETIME | Thời gian tạo |
