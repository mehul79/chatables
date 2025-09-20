# Chatables

Chatables is a modern, full-stack real-time chat application built with TypeScript, React, Vite, Express, Prisma, and PostgreSQL. It supports user authentication, profile management, theming, and instant messaging with WebSocket-powered live updates.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Zustand, DaisyUI, TailwindCSS, Lucide Icons, Emoji Mart
- **Backend:** Express, TypeScript, Prisma ORM, PostgreSQL, WebSocket (ws), Cloudinary (for profile images)
- **DevOps:** Docker, Docker Compose
- **Other:** Zod (validation), Axios, Multer (file uploads)

## Unique Selling Points (USP)

- **Real-time Messaging:** Instant chat updates using WebSockets.
- **Modern UI:** Responsive, themeable interface with DaisyUI and TailwindCSS.
- **Profile Management:** Users can update their profile picture and full name.
- **Authentication:** Secure JWT-based login/signup with cookie management.
- **Cloudinary Integration:** Profile images are stored and served via Cloudinary.
- **Robust State Management:** Zustand for scalable, simple state handling.
- **Easy Local Development:** Docker Compose for seamless multi-service setup.

## Environment Variables

### Backend (`backend/.env`)

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – Secret key for JWT authentication
- `CLOUDINARY_CLOUD_NAME` – Cloudinary cloud name
- `CLOUDINARY_API_KEY` – Cloudinary API key
- `CLOUDINARY_API_SECRET` – Cloudinary API secret
- `PORT` – Backend server port (default: 3000)
- `WS_PORT` – WebSocket server port (default: 8080)

See `backend/.env.example` for a template.

### Frontend (`frontend/.env`)

- `VITE_API_URL` – Backend API base URL (e.g., `http://localhost:3000/api`)
- `VITE_WS_URL` – WebSocket server URL (e.g., `ws://localhost:8080`)
- `VITE_CLOUDINARY_UPLOAD_PRESET` – Cloudinary upload preset (if required)

See `frontend/.env.example` for a template.

## Setup & Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js (if running locally without Docker)
- PostgreSQL (if running locally without Docker)

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/chatables.git
cd chatables
```

### 2. Environment Variables

Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories and fill in secrets as needed.

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Start with Docker Compose (Recommended)

This will start the database, backend, frontend, and Prisma Studio.

```sh
docker-compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000/api](http://localhost:3000/api)
- WebSocket: `ws://localhost:8080`
- Prisma Studio: [http://localhost:5555](http://localhost:5555)

### 4. Manual Local Development (Optional)

#### Backend

```sh
cd backend
npm install
npx prisma migrate dev
npm run dev
```

#### Frontend

```sh
cd frontend
npm install
npm run dev
```

### 5. Access the App

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Sign up, log in, and start chatting!

## Project Structure

```
backend/
  src/
    controller/
    db/
    router/
    utils/
    ws/
  prisma/
frontend/
  src/
    components/
    pages/
    store/
    lib/
    hooks/
```

## Tasks Left

- **Securing the WebSocket Server:**  
  The WebSocket server currently does not have authentication or authorization checks implemented. Adding security measures (such as JWT validation or session checks) for WebSocket connections is recommended to prevent unauthorized access and ensure

