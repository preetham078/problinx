# 🚀 PROBLINX

### Problem-Based Peer Skill Exchange Platform

**PROBLINX** is a problem-based peer skill exchange platform designed for college students. It helps students turn real project problems and learning challenges into opportunities for collaboration.

Students can **post problems, share solutions, review answers, and earn credits** by helping others.

---
Website Live Here : http://preetham078.github.io/problinx/

## 🎯 Problem Statement

College students often face difficulties while working on projects, assignments, coding problems, design tasks, and other technical challenges.

At the same time, other students may already have the knowledge or skills needed to solve those problems.

However, there is no dedicated platform where students can easily:

- Ask for help with real problems
- Find students with relevant skills
- Share practical solutions
- Get recognition for helping others
- Build a profile around their skills

**PROBLINX** addresses this gap by creating a peer-to-peer problem-solving and skill-exchange ecosystem.

---

## 💡 Our Solution

PROBLINX connects students based on the problems they face and the skills they can offer.

### 🔄 How It Works

```text
Student faces a problem
        ↓
Posts the problem on PROBLINX
        ↓
Other students view the problem
        ↓
Students submit solutions
        ↓
Problem owner reviews the solutions
        ↓
Best/useful solution is approved
        ↓
Solver receives credits
        ↓
Students build their skill profile
```

---

## ✨ Features

### 👤 Student Profiles

Students can create profiles containing:

- Name
- Email
- Skills they can offer
- Skills they want to learn
- Earned credits

### 📝 Post Problems

Students can post real problems by providing:

- Problem title
- Detailed description
- Required skill

Example:

> **Problem:** React authentication redirect not working  
> **Required Skill:** React + Supabase

### 💬 Submit Solutions

Other students can provide solutions to posted problems and share their knowledge.

### ✅ Solution Review

The student who posted the problem can review submitted solutions and approve a useful solution.

### 🪙 Credit System

Approved solutions reward the solver with credits.

Currently:

```text
Approved Solution → 10 Credits
```

This creates an incentive for students to actively help others.

### 📱 Dashboard

The dashboard provides a central place to:

- View problems
- Submit solutions
- View solution status
- View student information
- Create/view stories

### 📸 Stories

Students can share temporary dashboard stories containing:

- Text
- Media URL
- Expiration duration

### 🔐 Authentication

PROBLINX uses Supabase Authentication for:

- Registration
- Login
- Logout
- Session management
- Protected pages

### 📱 Android Support

The project uses **Capacitor** to package the web application as an Android application.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS
- Tailwind CSS
- Lucide React

### Backend & Database

- Supabase
- Supabase Authentication
- PostgreSQL

### Mobile

- Capacitor
- Android

### Testing & Development

- Vitest
- ESLint
- VS Code
- Git & GitHub

---

## 🏗️ Project Structure

```text
problinx/
│
├── android/                 # Android/Capacitor project
│
├── public/                  # Public assets
│
├── src/
│   ├── components/          # Reusable components
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External integrations
│   ├── lib/                 # Utility functions
│   │
│   ├── pages/
│   │   ├── Index.tsx        # Landing page
│   │   ├── Login.tsx        # Login
│   │   ├── Register.tsx     # Registration
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Problem.tsx      # Post problem
│   │   ├── ReviewSolutions.tsx
│   │   └── Profile.tsx      # User profile
│   │
│   ├── App.tsx              # Main application & routing
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   └── supabaseClient.js    # Supabase configuration
│
├── supabase/
│   ├── migrations/          # Database migrations
│   └── config.toml
│
├── capacitor.config.ts      # Capacitor configuration
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/preetham078/problinx.git
```

### 2. Navigate to the Project

```bash
cd problinx
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available through the local Vite development server.

---

## 🏗️ Build the Project

To create a production build:

```bash
npm run build
```

For a mobile-oriented build:

```bash
npm run build:mobile
```

---

## 📱 Android Build

PROBLINX uses Capacitor for Android.

After building the web application:

```bash
npm run build
```

Sync the project with Android:

```bash
npx cap sync android
```

Open the Android project:

```bash
npx cap open android
```

The Android project can then be built and tested using Android Studio.

---

## 🔐 Database

PROBLINX uses **Supabase** for backend services.

The application uses Supabase for:

- User authentication
- Student profiles
- Problems
- Solutions
- Credits
- Stories
- Database functions

The frontend communicates with Supabase through the Supabase JavaScript client.

> **Security Note:** Never expose Supabase service-role or secret keys in frontend code. Only use the publishable/anonymous client key in a browser/mobile frontend, with proper Row Level Security (RLS) policies enabled.

---

## 🔄 Application Flow

### Authentication

```text
Register
   ↓
Supabase Authentication
   ↓
Create Student Profile
   ↓
Login
   ↓
Dashboard
```

### Problem Solving

```text
Post Problem
     ↓
Problem appears on Dashboard
     ↓
Another Student submits Solution
     ↓
Problem Owner reviews Solution
     ↓
Solution Approved
     ↓
Solver receives Credits
```

---

## 🎓 Use Cases

PROBLINX can be used for:

- College projects
- Coding problems
- Hackathons
- Design problems
- Assignments
- Technical troubleshooting
- Peer learning
- Skill exchange
- Project collaboration

---

## 🚧 Future Improvements

Planned improvements can include:

- 🤖 AI-powered problem and skill matching
- 🔍 Advanced problem search and filtering
- 🏆 Student leaderboard
- 🥇 Badges and achievements
- 💬 Real-time chat
- 🔔 Notifications
- 📎 File and image attachments
- 🧑‍🤝‍🧑 Team formation
- 📊 Student skill analytics
- ⭐ Solution ratings
- 🔐 Improved security and Row Level Security policies
- 🌐 Full production deployment
- 📱 Play Store release

---

## 🌟 Vision

> **Learn by solving. Solve by sharing. Grow together.**

PROBLINX aims to create a student-driven ecosystem where knowledge is exchanged through real problems and practical collaboration.

---

## 👨‍💻 Developer

**Preetham M**

B.Tech Computer Science Engineering

---

## 📄 License

This project is currently developed as an academic/project initiative.

---

## 🔗 Repository

**GitHub:**  
https://github.com/preetham078/problinx
