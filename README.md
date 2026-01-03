# Tikila Project Setup Guide

The Tikila project consists of three main parts:

- **[tikila-BE](https://github.com/powdevlin12/Tikila-BE)**: Backend API (Node.js + Express + TypeScript + MySQL)
- **[tikila-admin](https://github.com/powdevlin12/tikila-admin)**: Admin Dashboard (React + TypeScript + Vite)
- **[tikila-FE](https://github.com/powdevlin12/tikila-FE)**: Frontend Website (React + TypeScript + Vite)

---

## System Requirements

- Node.js >= 18.x
- MySQL >= 8.0
- npm or yarn or pm2

---

## 1. Backend Setup (tikila-BE)

### Step 1: Install Dependencies

```bash
cd tikila-BE
npm install
```

### Step 2: Configure Database

Create MySQL database:

```sql
CREATE DATABASE tikila;
CREATE USER 'td_tikila'@'localhost' IDENTIFIED BY 'td_tikila';
GRANT ALL PRIVILEGES ON tikila.* TO 'td_tikila'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Create `.env.development` file from sample:

```bash
cp dev.env.txt .env.development
```

Update database configuration:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=td_tikila
MYSQL_PASSWORD=td_tikila
MYSQL_DATABASE=tikila_db

# Server
PORT_SERVER=1236
HOST=http://localhost:1236

# JWT Tokens
JWT_SECRET_ACCESS_TOKEN=@tadudTVanvosongtoan@
JWT_SECRET_REFRESH_TOKEN=@tadudTVanvosongtoan@123
ACCESS_TOKEN_EXPIRE_IN=15m
REFRESH_TOKEN_EXPIRE_IN=100d

# Default Admin Account
ADMIN_USER_DEFAULT=admin@gmail.com
ADMIN_PASSWORD_DEFAULT=!Thudat68

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME = 'your_cloud_name'
CLOUDINARY_API_KEY = 'your_api_key'
CLOUDINARY_API_SECRET = 'your_api_secret'
```

### Step 3: Start the Server

```bash
npm run dev
```

Server will run at `http://localhost:1236`

**Notes:** On the first run, the system automatically:

- Creates database tables via TypeORM
- Creates default admin account: `admin@gmail.com` / `!Thudat68`
- Inserts default `company_info` data

---

## 2. Setup Admin Dashboard (tikila-admin)

### Step 1: Install Dependencies

```bash
cd tikila-admin
npm install
```

### Step 2: Configure Environment Variables

Create `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:1236
```

Create `.env.production`:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Step 3: Start Development Server

```bash
npm run dev
```

Admin Dashboard: `http://localhost:5173`

Login with default credentials:

- **Email:** `admin@gmail.com`
- **Password:** `!Thudat68`

### Step 4: Build for Production

```bash
npm run build
```

---

## 3. Setup Frontend Website (tikila-FE)

### Step 1: Install Dependencies

```bash
cd tikila-FE
npm install
```

### Step 2: Configure Environment Variables

Create `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:1236
```

Create `.env.production`:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Step 3: Start Development Server

```bash
npm run dev
```

Frontend Website: `http://localhost:5174`

### Step 4: Build for Production

```bash
npm run build
```

---

## 4. Uploads Directory Structure

```bash
mkdir -p uploads/images/temp
mkdir -p uploads/images
mkdir -p uploads/videos/temp
mkdir -p uploads/videos
```

---

## 5. Key Backend Endpoints

| Endpoint              | Description         |
| --------------------- | ------------------- |
| `GET /company/info`   | Company information |
| `GET /products`       | Product list        |
| `GET /star-customers` | Customer reviews    |
| `POST /users/login`   | Login               |

---

## 6. Troubleshooting

### Database Connection Error

```bash
mysql -u root -p
SHOW DATABASES;
```

### CORS Error

```typescript
app.use(cors())
```

### Upload Permission Error

```bash
chmod -R 755 uploads/
```

### Port Already in Use

```env
PORT_SERVER=1237
```

---

## 7. Useful Scripts

### Backend

```bash
npm run dev
npm run build
npm start
```

### Frontend & Admin

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
