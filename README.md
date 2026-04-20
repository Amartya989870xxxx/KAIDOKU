# KAIDOKU - AI Research Decoder (React Project)

## 1. Product Title
**KAIDOKU (解読)** - AI Research Decoder

## 2. Problem Statement
Academic research papers are historically dense, heavily reliant on highly specialized jargon, and presented in unapproachable formats. Managing and attempting to process this knowledge manually becomes extremely difficult for non-experts, students, and interdisciplinary researchers.

**Common problems faced by readers:**
* Academic language is often impenetrable to laypeople and beginners.
* Critical concepts are buried under complex terminologies.
* Reading 30-page PDFs on a screen causes severe cognitive fatigue.
* No easy way to extract and summarize just the core sections.
* Significant accessibility barriers for auditory learners.

Most people rely on manual copying and pasting sections into ChatGPT, which lacks automation, context-preservation, storage, and proper organization.

The goal of this project is to build a **Smart AI Research Decoder** using React that helps users:
* Upload complex PDF research papers easily.
* Autonomously extract text and decode it section-by-section.
* Translate highly complex jargon into plain, accessible language.
* Listen to the decoded research via automated Text-to-Speech playback.
* View and save decoded papers persistently in a personal and community dashboard.

This application simulates a real, production-level AI SaaS productivity tool.

## 3. Product Goals

**Primary Goals**
The system should allow users to:
1. Authenticate securely into their workspace.
2. Upload any text-based PDF document to the cloud.
3. Automatically extract and chunk the text via PDF.js.
4. Process those chunks through a powerful LLM to return simple explanations.
5. Manage, organize, and read/listen to their processed library.

**Secondary Goals**
* Provide a stunning, premium "Brutalist Editorial" UI/UX.
* Practice advanced React architecture (custom hooks, services, protected logic).
* Implement rigorous API rate-limiting and error handling logic.

## 4. Target Users

**Primary Users**
* University Students deciphering new domains.
* Researchers conducting cross-disciplinary literature reviews.
* Enthusiasts and laymen curious about cutting-edge scientific breakthroughs.

**User Pain Points**
Users need:
* A centralized platform to maintain processed research.
* Immediate, contextual definitions without leaving the page.
* Alternative consumption methods (Audio / Screen-free reading).
* Fast, automated processing.

---

## 5. Core Functional Modules

**Feature 1: Decentralized Authentication**
* **Security:** Powered by Firebase Authentication.
* **Logic:** Route protection using centralized React Context (`AuthContext`). Users cannot trigger API jobs or view the Dashboard unless they are authenticated.

**Feature 2: Smart PDF Upload & Extraction**
* **Storage:** Raw PDFs are pushed to Cloudinary securely.
* **Extraction:** Employs Mozilla’s `pdfjs-dist` to rip raw text strings from the document client-side.
* **Chunking:** The application splits massive text strings into manageable 8,000-character chunks to maintain LLM context continuity.

**Feature 3: AI Decoding Engine**
* **Engine:** Powered by Groq API (`llama-3.3-70b-versatile`).
* **Logic:** Iterates through structural document chunks. It features an automated delay (4000ms) and an exponential backoff retry mechanism to aggressively combat HTTP 429 Rate Limiting errors.

**Feature 4: Accessibility & Audio Playback**
* **Tool:** Web Speech API integration.
* **Feature:** A dedicated "Listen" tab that allows users to seamlessly trigger native browser text-to-speech, reading the AI's plain-language markdown out loud. 

**Feature 5: Progress Dashboard**
* **Database:** Connected to Firebase Firestore.
* **Features:** A global state dashboard differentiating between "Community Papers" (uploaded by anyone) and "Your Workspace" (filtered by `user.uid`).

## 6. Technical Architecture

**Tech Stack**
* **Frontend:** React 19, Vite.
* **Styling:** Custom Vanilla CSS with a Brutalist aesthetic, custom cursors, and CSS Grid lines.
* **Animations:** Framer Motion (page transitions, tabs, loading overlays).
* **AI Provider:** Groq Engine (`llama-3.3-70b-versatile`).
* **Backend BaaS:** Firebase (Auth & Firestore) + Cloudinary.

**React Concepts Implemented**
* `useState`: For local form handling, file states, and tab switching.
* `useEffect`: For auth-state synchronization, database fetching, and custom cursor event listeners.
* **Context API (`AuthContext`)**: Centralized global state for user credentials.
* **Component Composition**: Extensive reusable UI components (`Navbar`, `GridLines`, `Hero`).

**API Integration**
* **Groq API:** For hyper-fast LLM inferences.
* **Firebase SDK:** For real-time NoSQL CRUD operations and Auth.
* **Cloudinary REST API:** For fast, unauthenticated asset drops.
* **Environment Security:** All API keys are securely managed via `.env` locally and `import.meta.env` in Vite.

## 7. Project Structure

```text
src
 ├── components    # Reusable UI (Navbar, CustomCursor)
 ├── pages         # Main views (Home, Upload, Dashboard, PaperDetail, Explore, Auth)
 ├── context       # Global state (AuthContext)
 ├── services      # Modular business logic (firebase, groq, pdfExtractor)
 ├── index.css     # Global styles and design system variables
 └── App.jsx       # Global Routing and layout layer
```

## 8. Logic Evaluation

1. **Algorithmic Chunking:** Handles massive documents client-side by splitting them synchronously, preventing maximum call stack limits and prompt overflow.
2. **AI Engineering:** Highly specific system prompts enforce a consistent layman translation, extracting technical terms organically.
3. **Resilience Logic:** Deeply structured `try/catch` and `while` loop mechanisms in the AI service file implement exponential backoff to ensure the app recovers gracefully from rate limits.
4. **UI Mastery:** Custom 60fps lerp-based cursor tracking and framer-motion conditional presence wraps the app in an indisputably premium veneer.

## 9. Development Commands

* `npm install`: Install dependencies.
* `npm run dev`: Launch the dev server.
* `npm run build`: Generate production bundle.
