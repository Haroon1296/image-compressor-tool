# Image Compressor Web Application

Production-ready full-stack image compressor inspired by TinyPNG. Upload multiple images, tune compression, preview before/after, and download individual or ZIP results. Includes a MySQL-backed history log.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Axios, React Dropzone
- Backend: Node.js, Express, Multer, Sharp, MySQL, Sequelize

## Features

- Drag & drop or file picker upload (JPG/PNG/WebP, max 10MB each)
- Compression level control (Low/Medium/High)
- Output format control (Auto/JPEG/PNG/WebP)
- Before/after preview with size stats
- Download single file or ZIP batch
- Upload progress indicator and processing state
- History logs stored in MySQL
- Rate limiting and scheduled cleanup

## Project Structure

```
client/
  src/components/
  src/pages/
  src/services/
  src/utils/
server/
  controllers/
  routes/
  models/
  migrations/
  middlewares/
  utils/
  uploads/
```

## Setup

### 1) Database

Create a MySQL database:

```sql
CREATE DATABASE image_compressor;
```

### 2) Backend

```
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

If you prefer Sequelize auto-sync instead of migrations, set:

```
DB_SYNC=true
```

### 3) Frontend

```
cd client
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`.

## API Documentation

### POST `/api/compress`

Upload and compress images.

**Request**

- `multipart/form-data`
- Fields:
  - `images` (files, multiple)
  - `level`: `low | medium | high`
  - `format`: `auto | jpeg | png | webp`

**Response**

```json
{
  "results": [
    {
      "filename": "abc123.jpg",
      "original_size": 204800,
      "compressed_size": 92160,
      "compression_ratio": 55.0,
      "original_url": "http://localhost:5000/uploads/original/abc123.jpg",
      "compressed_url": "http://localhost:5000/uploads/compressed/abc123.jpg",
      "download_url": "http://localhost:5000/uploads/compressed/abc123.jpg"
    }
  ]
}
```

### POST `/api/zip`

Create ZIP for a list of compressed filenames.

**Request**

```json
{
  "files": ["abc123.jpg", "def456.png"]
}
```

**Response**

```json
{ "zip_url": "http://localhost:5000/uploads/compressed/compressed_1710000000000.zip" }
```

### GET `/api/history`

Returns the latest 100 compression logs.

## Environment Variables

Backend: `server/.env.example`

- `PORT`
- `CLIENT_ORIGIN`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `UPLOAD_TTL_HOURS`
- `RATE_LIMIT_WINDOW_MINUTES`
- `RATE_LIMIT_MAX`
- `BASE_URL`

Frontend: `client/.env.example`

- `VITE_API_BASE_URL`

## Notes

- Uploaded files are stored under `server/uploads`.
- A nightly cleanup job removes uploads older than `UPLOAD_TTL_HOURS`.
- Rate limiting is enabled by default to protect the API.

## Production Tips

- Run the backend behind a reverse proxy (Nginx) with HTTPS.
- Store uploads in object storage for scale.
- Use a job queue for heavy batch compression.
