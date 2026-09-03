# Orbitly Studio

A full-stack web application built for **Orbitly Studio**, a digital design and product studio. The platform includes a public landing page with dynamic case studies, a technical blog, a project inquiry form, and an admin management dashboard.

---

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js, TypeScript, Mongoose
- **Database:** MongoDB
- **Auth & Security:** JWT, bcryptjs, express-rate-limit, Zod validation

---

## System Workflow

```text
[ Public Visitor ]
       │
       ├──► Browses Landing Page (Hero, Capabilities, Testimonials)
       ├──► Views Dynamic Published Projects (/projects/[slug])
       ├──► Reads Technical Blog Posts (/blog/[slug])
       └──► Submits Project Inquiry ──► [ Zod Validation ] ──► [ MongoDB (inquiries) ]
                                                                      │
[ Studio Admin ]                                                      ▼
       │                                                    [ Admin Inquiries Panel ]
       ├──► Logs In (/admin/login) ──► [ JWT (role: admin) ]
       │                                       │
       └──► Accesses Admin Dashboard ◄─────────┘
              ├── Manage Projects (Create / Edit / Delete / Publish Toggle)
              ├── Write Blog Articles (Markdown Editor / Feature Toggle)
              └── Review & Respond to Client Inquiries
```

### How Data Flows:
1. **Public Browsing:** Frontend fetches live data from backend APIs (`GET /api/projects`, `GET /api/blog`). The backend queries MongoDB with `{ isPublished: true }`, ensuring draft content stays completely private.
2. **Client Inquiries:** When a prospective client submits a project brief on the landing page, data is validated through Zod and stored in MongoDB.
3. **Admin Management:** Admin logs in using email/password. The backend issues a signed JWT token verifying `admin` role. The admin can then create/update case studies, write markdown blogs, and manage client leads.

---

## How to Run Locally

### 1. Start Backend
```bash
cd backend
npm install
npm run seed    # Seeds admin user & sample projects/blogs
npm run dev     # Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev     # Runs on http://localhost:3000
```

---

## Demo Admin Credentials

- **Login URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@orbitly.studio`
- **Password:** `OrbitlyAdmin2025!`

---

## What’s Inside

### 🌐 Public Website (`http://localhost:3000`)
- **Hero & Services:** Studio introduction and capability cards.
- **Projects / Case Studies:** Dynamic projects fetched from MongoDB with tags and detail pages (`/projects/[slug]`).
- **Blog:** Dynamic articles with featured posts and markdown reading view (`/blog/[slug]`).
- **Contact Form:** Interactive project inquiry form that saves client requirements directly to the database.

### 🔒 Admin Dashboard (`http://localhost:3000/admin/dashboard`)
- **Projects CRUD:** Create, edit, delete, and toggle draft/published status.
- **Blog CRUD:** Markdown editor with live preview, featured story toggle, and publish controls.
- **Client Inquiries:** View customer requirements submitted through the website with status management and direct email reply.

---

## Architecture Highlights (Interview Quick-Notes)

- **JWT + Role-Based Auth:** Admin routes verify the JWT token signature and ensure `role === 'admin'`.
- **Draft Protection:** Public endpoints only return items where `isPublished: true`. Drafts return `404` to public visitors.
- **Validation:** All write operations are validated using Zod schemas before touching MongoDB.
- **Rate Limiting:** Protects the login endpoint and write operations from abuse.

---

## Build Verification

```bash
cd backend && npm run build
cd frontend && npm run build
```
