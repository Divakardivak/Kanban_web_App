# FlowBoard ⚡ — Futuristic Glassmorphic Cloud Kanban Web App

A next-generation, high-fidelity **Kanban Project Management Web Application** engineered with a sleek, futuristic glassmorphic UI, real-time multi-device cloud synchronization, Google Gemini AI task generation, offline backup/restore, and interactive task checklists.

![FlowBoard Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview & Key Highlights

FlowBoard elevates task management with modern desktop-grade ergonomics and a deep cyber aesthetic. Built with **React 19**, **TypeScript**, and **Material UI v7**, FlowBoard keeps your board seamlessly in sync across all your phones, tablets, and computers via **Google Cloud Firestore**.

### 🚀 Core Superpowers:
1. **☁️ Real-time Cloud Sync (Firestore)**: Sign in once and access your board anywhere. Changes propagate across browser tabs and devices with automatic debouncing.
2. **🤖 AI Smart Task Planner (Gemini API)**: Type any project idea (e.g. *"Launch a SaaS MVP in 14 days"* or *"Prepare for Tech Interviews"*) and Gemini AI automatically constructs all tasks, priorities, deadlines, and multi-step checklists.
3. **🔥 Task Priorities & Smart Due Dates**: Mark tasks as `Urgent`, `High`, `Medium`, or `Low`. Live deadline badges calculate relative time (`Today`, `Tomorrow`, `X days overdue`).
4. **✅ Subtasks & Interactive Checklists**: Break big tasks into checklists with glowing progress bars and subtask completion counters.
5. **🏷️ Quick Filters & Multi-Criteria Sorting**: Filter cards instantly with one-click toggles (`High Priority`, `Due Soon`, `Overdue`), tag colors, or sort by `Due Date`, `Priority`, or `A → Z`.
6. **📦 Board Backup & Transfer (JSON / CSV)**: Download full-fidelity offline JSON backups or export CSV spreadsheets to Excel and Notion. Restore or merge backup files with intelligent collision prevention.
7. **🔔 Live Task Activity Log & History**: A slide-out notification drawer tracks every move, creation, checklist completion, and edit chronologically with relative timestamps.
8. **🎨 Futuristic Glassmorphic Design**: Cosmic deep dark mode, high-contrast light mode, ambient gradient backdrops, and fluid drag-and-drop micro-interactions.
9. **📱 100% Responsive for Web & Mobile**: Handcrafted layout adapting from 360px mobile viewports to ultra-wide desktop monitors.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19**, **React DOM 19** | Latest modern React with concurrent features and optimal rendering |
| **Language & Tooling** | **TypeScript 5.8**, **Vite 7** | Strictly typed codebase with lightning-fast Hot Module Replacement |
| **Design System & UI** | **Material UI (MUI) v7**, **Emotion** | High-performance CSS-in-JS theming, glassmorphic paper styles, and custom typography |
| **Typography** | **Plus Jakarta Sans**, **Outfit** | Curated Google Fonts delivering a modern, cyber-technical appearance |
| **State Management** | **Zustand 5** | Lightweight, reactive centralized state with localStorage persistence middleware |
| **Drag & Drop** | **@hello-pangea/dnd** | Smooth, accessible drag-and-drop for cards and workflow columns |
| **Cloud & Backend** | **Firebase 12** (Authentication & Firestore) | Per-user Firestore database rules with real-time `onSnapshot` bi-directional live sync |
| **Generative AI** | **Google Gemini API** (Interactions SDK) | Automated project breakdown engine with an intelligent offline fallback planner |
| **Export / Import** | **Native Web Streams & Blobs (RFC 4180)** | Zero-dependency JSON serializer and RFC-compliant CSV parser with UTF-8 BOM |

---

## 🧭 Architecture & Project Structure

```
Kanban Web App/
├── public/                       # Static public assets
├── src/
│   ├── components/
│   │   ├── activity/
│   │   │   └── ActivityDrawer.tsx       # Slide-out real-time activity timeline drawer
│   │   ├── board/
│   │   │   ├── Board.tsx                # Main board canvas, DragDropContext & column engine
│   │   │   ├── BoardColumn.tsx          # Droppable column container with task list
│   │   │   ├── BoardFilterBar.tsx       # Quick filter chips, tag menus & sort controls
│   │   │   └── TaskCard.tsx             # Draggable glass card, priority badges & progress bar
│   │   ├── layout/
│   │   │   └── AppLayout.tsx            # Responsive glass navigation bar, search & controls
│   │   └── modals/
│   │       ├── AiPlannerModal.tsx       # Gemini AI project generator interface
│   │       ├── ColumnModal.tsx          # Create & edit columns with color swatches
│   │       ├── ConfirmModal.tsx         # Safety dialog for destructive actions
│   │       ├── ExportImportModal.tsx    # JSON/CSV file download, upload & merge manager
│   │       └── TaskModal.tsx            # Comprehensive task, priority & checklist editor
│   ├── context/
│   │   ├── ColorModeContext.tsx         # Dark / Light theme provider with custom MUI tokens
│   │   └── NotificationContext.tsx      # Global toast snackbar notification system
│   ├── hooks/
│   │   ├── useFirestoreSync.ts          # Auth state listener & Cloud Firestore sync trigger
│   │   └── useStore.ts                  # Central Zustand store (tasks, columns, activities)
│   ├── screens/
│   │   ├── BoardScreen.tsx              # Primary Kanban route
│   │   ├── LoginScreen.tsx              # Clean sign-in & register portal
│   │   └── NotFoundScreen.tsx           # 404 error page
│   ├── services/
│   │   ├── aiPlannerService.ts          # Gemini API integration + offline rule generator
│   │   ├── boardTransferService.ts      # JSON/CSV serializers, RFC parser & file downloaders
│   │   └── firestoreSync.ts             # Bi-directional debounced Firestore database sync
│   ├── firebase.tsx                     # Firebase Client SDK initialization
│   ├── index.css                        # Global fonts, scrollbar styles, CSS resets
│   └── main.tsx                         # React 19 application root
├── firestore.rules                      # Production Firestore security rules
├── package.json                         # Dependencies and build scripts
├── tsconfig.json                        # TypeScript configuration
└── vite.config.ts                       # Vite bundler configuration
```

---

## 🚀 Step-by-Step User Flow & User Guide

### 1. Account Creation & Sign In
- When you first launch FlowBoard, enter your email and password to log in or create a new account.
- **Why?** Each user receives their own isolated Firestore database space (`/users/{userId}/kanban/board`) so your board remains private and accessible from any device.

### 2. Live Cloud Sync Indicator
- In the top header bar, notice the **Cloud Sync Pill**:
  - 🟢 **`CLOUD SYNCED`**: Board is in sync with Google Cloud Firestore.
  - 🟣 **`SYNCING...`**: Saving your changes to the cloud (debounced 350ms to save network bandwidth).
  - 🔴 **`OFFLINE`**: Operating offline using local storage. Click the pill anytime to retry syncing.

### 3. Creating & Managing Tasks
- Click **`+ Add a task`** at the bottom of any column:
  - **Title**: Enter your task description.
  - **Priority**: Choose `Urgent`, `High`, `Medium`, or `Low` for clear visual urgency.
  - **Due Date**: Pick an upcoming deadline or click quick shortcuts (`Today`, `Tomorrow`, `In 1 Week`).
  - **Checklist Subtasks**: Break the task into actionable steps.
  - **Tag Colors**: Select one of 8 vibrant cyber color tags.
- Hover over any card to reveal quick **Edit** and **Delete** actions.

### 4. Interactive Checklist & Progress Tracking
- Check off subtasks directly inside the task modal or inspect them on the board.
- The glowing progress bar dynamically fills and turns emerald green upon 100% completion (`X/Y subtasks • 100%`).

### 5. AI Smart Project Planner
- Click the golden **`AI Plan`** button in the header.
- Select a preset idea (*"Master TypeScript"*, *"Launch SaaS MVP"*, *"Tech Interview Prep"*) or type your custom prompt.
- Click **`Generate Plan`**:
  - The built-in AI engine crafts a complete task breakdown with priorities, deadlines, and checklist items.
  - Review the suggestions, uncheck any tasks you don't need, choose your target column, and click **`Add Tasks to Board`**.

### 6. Quick Filters & Sorting
- Use the **Filter Toolbar** located directly above the columns:
  - Click **🔥 High Priority** to isolate Urgent and High items.
  - Click **⏰ Due Soon** to see tasks due within the next 3 days.
  - Click **🚨 Overdue** to catch missed deadlines.
  - Filter by specific **Priority** level or **Tag Color**.
  - Sort by **Due Date (Earliest First)**, **Priority (Highest First)**, or **Alphabetical (A → Z)**.
  - Click the **Reset** pill at any time to return to your normal drag-and-drop order.

### 7. Backup, Export & Import (JSON / CSV)
- Click the cyan **`Transfer`** button in the navigation header:
  - **Export JSON**: Download a complete backup of all columns, task orders, checklists, and colors.
  - **Export CSV**: Download an Excel-ready tabular spreadsheet with task details.
  - **Import & Restore**: Drag and drop any `.json` or `.csv` file. Choose between:
    - **Merge with Current Board (Safe)**: Keeps existing tasks and intelligently appends new ones.
    - **Replace Current Board**: Wipes the board and performs a fresh restore.

### 8. Real-Time Activity Log & History
- Click the purple **🔔 Bell Icon** in the top right to open the **Activity Drawer**.
- Browse chronological records of all recent moves, edits, subtask checks, and creations.
- Filter by `All`, `Tasks`, `Moves`, `Checklists`, or `Columns`.

---

## ⚡ Getting Started & Local Development

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **pnpm**
- A **Firebase Project** with Cloud Firestore and Authentication enabled (Email/Password provider).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kanban-web-app.git
   cd "Kanban Web App"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Ensure `src/firebase.tsx` points to your Firebase project configuration:
   ```ts
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Publish Firestore Security Rules:**
   In your **Firebase Console** ➔ **Firestore Database** ➔ **Rules**, publish the following security rule:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at **http://localhost:5173**.

6. **Create a Production Build:**
   ```bash
   npm run build
   ```
   The minified production assets will be generated in `/dist`.

---

## 📱 Mobile & Responsive Design

FlowBoard is engineered to be fully responsive:
- **Mobile Phones (< 600px)**:
  - Compact header navigation with icon buttons for AI Planner, Transfer, and Theme toggle.
  - Dynamic column widths (`84vw`) allowing smooth side-scrolling between Kanban stages.
  - Touch-optimized filter bar with momentum scrolling.
- **Tablets & Laptops (600px - 1024px)**:
  - Adaptive search bar width preventing toolbar wrapping.
  - Labeled action chips with clean padding.
- **Desktop Monitors (1024px+)**:
  - Full board statistics chip, wide search bar, multi-column expanded view.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to customize, modify, and build upon it!
