# Docker cho jetwash

3 app + 1 database, tối ưu cho VPS 2GB RAM.

| Service        | Repo / nhánh              | Cổng prod (host) | Cổng dev (host) |
| -------------- | ------------------------- | ---------------- | --------------- |
| `fe-nextjs`    | `fe-nextjs` — `main`      | **5004**         | 3000            |
| `tikila-admin` | `tikila-admin` — `new-main` | **4005**       | 5173            |
| `tikila-be`    | `tikila-BE` — `new-main`  | **1236**         | 1236            |
| `mariadb`      | —                         | không publish    | 3307            |

## Chạy prod — một lệnh

```bash
docker compose up -d --build
```

Không cần `-f` hay `--env-file`: file tên `docker-compose.yml` và `.env` được
docker compose tự đọc. Đo thực tế: **47 giây** từ chưa có image nào đến cả 4
container lên. Dừng: `docker compose down`.

### Khi nào dùng `make deploy` thay vì lệnh trên

`docker compose up --build` build cả 3 image **song song**. Trên VPS 2GB điều đó
cần swap (xem bên dưới), và vì backend chưa chạy lúc build nên các trang
prerender ra rỗng — nội dung đầy lại qua ISR sau `revalidate` 60s.

`make deploy` build **tuần tự** và khởi động backend trước khi build frontend,
nên nhẹ RAM hơn và trang có nội dung ngay. Chậm hơn nhưng chắc ăn hơn.

## Chạy dev

```bash
make dev
```

Hot reload qua bind mount. Dừng: `make dev-down`.

## Trước khi deploy lần đầu

### 1. Bật swap — bắt buộc trên VPS 2GB

Build Next.js 16 (Turbopack) và Vite ngốn RAM hơn nhiều so với lúc chạy.
Không có swap thì bước build gần như chắc chắn bị OOM kill.

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Sửa `.env`

Ít nhất là `MARIADB_ROOT_PASSWORD` và `MYSQL_PASSWORD` (đang là `td_tikila/td_tikila`).

### 3. Trỏ nginx trên host về các cổng mới

`NEXT_PUBLIC_API_BASE_URL` đang là `https://powdevlin68.info/api`, nghĩa là
nginx trên host đang strip `/api` rồi proxy về backend. Sau khi chuyển sang
docker, upstream đổi thành `127.0.0.1:1236`:

```nginx
location /api/ { proxy_pass http://127.0.0.1:1236/; }
location /     { proxy_pass http://127.0.0.1:5004; }
```

## Ngân sách RAM

Cột "Thực đo" lấy từ `docker stats` ngay sau khi stack khởi động xong (idle).

| Service        | Giới hạn | Thực đo | Ghi chú                                   |
| -------------- | -------- | ------- | ----------------------------------------- |
| `mariadb`      | 384M     | 64M     | `innodb_buffer_pool_size=96M`, tắt `performance_schema` |
| `tikila-be`    | 512M     | 50M     | `--max-old-space-size=320`, chừa chỗ cho `sharp` (native, ngoài V8 heap) |
| `fe-nextjs`    | 384M     | 87M     | Next standalone, `--max-old-space-size=256` |
| `tikila-admin` | 64M      | 11M     | nginx phục vụ file tĩnh                   |
| **Tổng**       | **1.34G** | **212M** | còn ~650M cho OS + docker daemon        |

Kích thước image: `fe-nextjs` 227MB · `tikila-be` 343MB · `tikila-admin` 52MB.

Nếu bị OOM kill, nới `deploy.resources.limits.memory` trong
`docker-compose.yml` và giảm tương ứng ở service khác.

## Kiểm tra nhanh

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:1236/company/info   # BE
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4005/               # admin
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5004/               # FE
```

## Những chỗ code quyết định cấu hình Docker

Đọc trước khi sửa Dockerfile:

- **`tikila-BE/src/constants/dir.ts`** — dùng `path.resolve('../uploads/...')`,
  tức là *một cấp trên CWD*. Vì vậy `WORKDIR` là `/app/tikila-BE` và volume
  mount vào `/app/uploads`. Đổi `WORKDIR` sẽ làm mất đường dẫn upload.
- **`tikila-BE/src/index.ts`** — đọc `doc-api.yaml` bằng `path.resolve()` lúc
  khởi động, nên file này phải được COPY vào image runtime.
- **`tikila-BE/src/constants/config.ts`** — `dotenv` không override `process.env`
  có sẵn, nên biến từ `docker compose` luôn thắng file `.env.production` trong
  repo. Không cần bake file env vào image.
- **`fe-nextjs/next.config.ts`** — đã thêm `output: 'standalone'`. Nếu bỏ đi,
  image runtime phải mang theo toàn bộ `node_modules` (~700MB thay vì ~180MB).
- **`NEXT_PUBLIC_*` và `VITE_*`** được inline vào bundle lúc **build**, nên
  chúng là build args. Đổi giá trị bắt buộc phải build lại image.
- **`fe-nextjs/services/server.ts`** — `getJSON` trước đây chỉ xử lý `!res.ok`;
  khi `fetch` throw (backend không kết nối được) thì `next build` chết hẳn ở
  bước prerender `app/page.tsx`. Đã bọc `try/catch` trả `undefined` giống nhánh
  `!res.ok` — `app/page.tsx` vốn đã dùng optional chaining cho mọi field nên
  không đổi hành vi khi backend chạy bình thường.

## Vấn đề đã biết

- **`tikila-BE` khai báo `npm` trong `dependencies`** (`package.json`). Nó kéo
  thêm ~30MB vào image prod mà runtime không dùng. Nên chuyển sang
  `devDependencies` hoặc bỏ hẳn — mình không tự sửa vì ngoài phạm vi yêu cầu.
- **`AppDataSource` đang để `synchronize: true`** (`src/config/database.ts`).
  TypeORM sẽ tự đổi schema theo entity mỗi lần khởi động — trên prod việc này
  có thể làm mất dữ liệu khi entity thay đổi. Cân nhắc chuyển sang migration.
- **`tikila-admin` build bằng `tsc -b && vite build`** — lỗi type sẽ làm hỏng
  luôn bước build image.
