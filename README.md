# 🏠 EstateFlow SaaS CRM

A premium, production-grade Real Estate CRM designed for high-performing agencies. Built with **Next.js 14**, **Node.js**, **MongoDB**, and **Cloudinary**.

## 🚀 Deployment Status
- **Frontend**: [Vercel](https://vercel.com) (Continuous Deployment active)
- **Backend**: [Koyeb](https://koyeb.com) (Continuous Deployment active)
- **Cloud Storage**: Cloudinary (Active)
- **Automation**: n8n (Optional)

## ✨ Core Features
- **High-Fidelity Dashboard**: Real-time sales analytics and agent leaderboards.
- **Visual Property Catalog**: Integrated maps and spatial filtering.
- **Financial Pipeline**: Kanban-style deal management with automated commission calculation.
- **Client Intelligence**: Full interaction timelines and digital property folders.
- **Lead Automation**: n8n-ready lead capture and automated follow-up reminders.

## 🛠️ Tech Stack
- **Frontend**: React, Next.js, Framer Motion, Lucide Icons, Vanilla CSS.
- **Backend**: Express.js, MongoDB (Mongoose), JWT Auth.
- **Media**: Cloudinary (CDN-based persistent storage).
- **CI/CD**: GitHub Actions.

## 📦 Deployment Instructions

### 1. Backend (Koyeb)
- **Root Directory**: `/server`
- **Build Command**: `npm install`
- **Run Command**: `node server.js`
- **Env Vars**: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`, `FRONTEND_URL`.

### 2. Frontend (Vercel)
- **Root Directory**: `/client`
- **Framework**: Next.js
- **Env Vars**: `NEXT_PUBLIC_API_URL` (pointing to your Koyeb API).

---

## 👨‍💻 Author
Created as a production finalization session. 

*License: Professional Internal Use.*
