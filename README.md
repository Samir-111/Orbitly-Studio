# Orbitly Studio

Orbitly Studio is a modern web application built for a digital product studio. It includes a public-facing agency website, dynamic portfolio case studies, a technical blog, an interactive client inquiry form with automated emails, and an easy-to-use admin panel for content management.

---

## Features

### 🌐 For Website Visitors
- **Modern Dark UI:** Clean dark glassmorphism design with smooth animations and responsive layout.
- **Projects & Case Studies:** Shows the top 6 projects on the home page with category filters and a **"View All"** button to view more.
- **Blog / Insights:** Technical articles with a markdown reading view, read times, and an expandable list.
- **Project Inquiry Form:** Visitors can send project requirements with custom budget options (INR).
- **Automated Emails:**
  - **Admin Alert:** Instant email notification to the studio admin whenever someone submits an inquiry.
  - **Client Confirmation:** Confirmation email sent back to the client acknowledging their message.

### 🔒 For Studio Admins (`/admin`)
- **Secure Login:** JWT-based authentication for administrative access.
- **Project Management:** Add, edit, delete, and publish portfolio case studies.
- **Blog Studio:** Built-in Markdown editor with live preview to write and format articles.
- **Image Uploads (Cloudinary):** Upload images directly from your computer or paste an external image link.
- **Inquiry Tracker:** Review all incoming client messages in one clean dashboard.
- **Studio Settings:** Easily update the studio email and location displayed on the website.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, TypeScript, Mongoose
- **Database:** MongoDB
- **Image Storage:** Cloudinary
- **Emails:** Resend API
- **Auth & Security:** JWT, bcryptjs, Zod validation, Rate limiting

---

## Running Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas URL)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed    # Creates sample projects, blogs & default admin account
npm run dev     # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Runs on http://localhost:3000
```

---

## Admin Login Details

You can log in to the admin dashboard at:
- **URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@orbitly.studio`
- **Password:** `OrbitlyAdmin2025!`

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000

# Cloudinary (Image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend (Email notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Orbitly Studio <onboarding@resend.dev>
ADMIN_NOTIFICATION_EMAIL=your_email@gmail.com
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Deploying to Production

- **Backend (Render):**
  1. Create a Web Service connected to this repository.
  2. Set Root Directory to `backend`.
  3. Build Command: `npm install && npm run build`
  4. Start Command: `npm start`
  5. Add the backend environment variables listed above.

- **Frontend (Vercel):**
  1. Import the repository in Vercel.
  2. Set Root Directory to `frontend`.
  3. Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL (e.g. `https://your-backend.onrender.com/api`).
  4. Click Deploy.
