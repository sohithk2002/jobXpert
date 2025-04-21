# 🧠 JobXpert – AI-Powered Career Assistant

<!-- LIVE DEMO -->
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue.svg?style=for-the-badge)](https://inspireai.digital)

<!-- LICENSE -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<!-- NEXT.JS -->
![Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?logo=next.js&logoColor=white&style=for-the-badge)

<!-- PRISMA -->
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white&style=for-the-badge)

<!-- POSTGRES -->
![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)

<!-- GOOGLE AI -->
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white&style=for-the-badge)

<!-- CLERK -->
![Clerk](https://img.shields.io/badge/Auth-Clerk-FD5750?logo=clerk&logoColor=white&style=for-the-badge)

<!-- STRIPE -->
![Stripe](https://img.shields.io/badge/Payments-Stripe-008CDD?logo=stripe&logoColor=white&style=for-the-badge)

<!-- TAILWIND -->
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)

<!-- DEPLOYMENT -->
![Render](https://img.shields.io/badge/Deployed%20on-Render-35495E?logo=render&logoColor=white&style=for-the-badge)

<!-- VERSION -->
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=for-the-badge)


JobXpert is a **full-stack AI-powered career platform** that helps job seekers build professional resumes, receive personalized industry insights, generate custom cover letters, and practice mock interviews — all from a unified dashboard. It’s built with **Next.js 15**, **Prisma**, **Tailwind**, **Gemini AI**, and **Stripe**, deployed on **Render with PostgreSQL on Neon** and **secured using Clerk and Helmet.js**.

> ⚡ This project demonstrates advanced cloud-first architecture, secure coding practices, and production-grade full-stack implementation.

---

## 🚀 Features

- 🔐 **User Auth**: Clerk.dev with Google OAuth and custom role-based route protection
- 🧾 **Resume Builder**: Form-based resume editor with live markdown preview and PDF export
- 🤖 **AI Career Insights**: Gemini AI delivers real-time salary trends, growth potential, and skill recommendations
- 📨 **Cover Letter Generator**: Personalized letters based on resume & job title
- 🎤 **Mock Interview Simulator**: Role-specific technical Q&A with AI-generated feedback
- 📅 **Background Jobs**: Weekly industry updates via Inngest scheduled jobs
- 💳 **Stripe Integration**: Subscription billing, coupon codes, free trial, webhook-based access control
- 🛡️ **Security Hardening**: Helmet.js, role-based auth, parameterized queries, ZAP-tested deployment

---

## 🧱 Tech Stack

| Category            | Stack                                                             |
|---------------------|--------------------------------------------------------------------|
| **Frontend**        | Next.js 15 App Router, Tailwind CSS, Shadcn UI                    |
| **Backend**         | Next.js Server Actions, API Routes, Inngest                       |
| **Database**        | PostgreSQL hosted on [Neon.tech](https://neon.tech)               |
| **ORM**             | Prisma with type-safe models and migration tooling                |
| **Authentication**  | [Clerk.dev](https://clerk.dev) for auth and session management    |
| **AI Integration**  | Gemini AI API (Google Generative AI)                              |
| **Payments**        | Stripe Billing, Webhooks, Free Trial, Coupon system               |
| **Security**        | Helmet.js, Clerk middleware, OWASP ZAP security audit             |
| **Deployment**      | [Render.com](https://render.com) + CI/CD via GitHub               |

---

## 🌐 Architecture Overview

- **Cloud-Native Full-Stack Design**
- Stateless, scalable backend with Inngest for background job execution
- Auth guards on both frontend and backend routes using Clerk middleware
- Prisma for relational data modeling with secure queries
- ZAP scan confirms defense against SQLi, XSS, RCE, metadata leakage
- Weekly AI update pipelines to keep insights fresh and real-time

---

## 🔍 AI-Driven Modules

### ✨ Resume Optimizer
- User form → Markdown → PDF
- Stored securely in DB, can be re-edited anytime

### 📈 Career Insights Engine
- Fetches latest job market trends (salary, demand, growth)
- Industry-level insights customized per user

### 📝 Cover Letter Generator
- Inputs: Resume Summary + Job Title
- Outputs: AI-generated, role-focused, personalized letter
- PDF download with Markdown formatting

### 🤖 Mock Interview Module
- Role-based question generation (Data Engineer, Full-Stack Dev, etc.)
- Future version: voice-to-text and feedback scoring

---

## 📦 Installation (for local development)

```bash
git clone https://github.com/sohithk2002/jobXpert.git
cd jobXpert
pnpm install
