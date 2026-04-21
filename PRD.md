# Product Requirements Document (PRD)

## 1. Product Overview
**Product Name:** KAIDOKU (解読) - AI Research Decoder
**Objective:** Build an AI-powered SaaS productivity tool designed to decode, simplify, and make complex academic research papers accessible to a wider audience.

## 2. Problem Statement
**Background:** Academic research is historically dense, filled with specialized jargon, and published in unapproachable formats (typically lengthy PDFs).
**Pain Points:**
- Specialized academic language is often impenetrable to laypeople and beginners.
- Critical concepts are buried under complex terminologies.
- Reading 30+ page PDFs on screens causes significant cognitive fatigue.
- Lack of easy tools to extract and summarize just the core sections.
- High accessibility barriers for auditory learners or visually impaired users.
- Existing workarounds (e.g., manually copy-pasting sections into ChatGPT) lack automation, structural context preservation, and document organization.

## 3. Target Audience
- **Primary Users:** University Students deciphering new domains, interdisciplinary researchers needing quick literature reviews, and enthusiasts curious about cutting-edge scientific breakthroughs.
- **User Needs:** A centralized platform for translating text, saving decoded research, accessing alternative consumption methods (audio), and fast, automated processing.

## 4. Product Goals and Vision
- **Vision:** Democratize access to scientific research by transforming complex jargon into plain, understandable language.
- **Primary Goals:**
  - Secure user authentication and workspace segregation.
  - Seamless PDF upload, cloud storage, and client-side raw text extraction.
  - AI-driven iterative processing to provide simplified, layman translations section-by-section.
  - Native auditory playback (TTS) for screen-free consumption.
  - Persistent storage and organization of processed documents.
- **Secondary Goals:**
  - Provide a modern, premium "Brutalist Editorial" UI/UX design.
  - Implement robust frontend architecture using React Context, custom hooks, and modular services.
  - Engineer strong API rate-limit resilience.

## 5. Functional Requirements
### 5.1 Authentication System
- Users must be able to securely sign up, log in, and log out.
- Authorization: Unauthenticated users should be restricted from uploading PDFs, triggering AI extraction jobs, or viewing personalized dashboards.

### 5.2 Smart Document Upload & Extraction
- Support PDF document format parsing.
- **Upload:** Push PDF files securely to cloud storage (Cloudinary).
- **Processing:** Extract text client-side using `pdfjs-dist` to preserve privacy and prevent massive payload transmissions.
- **Chunking:** Dynamically split massive text strings into manageable chunks (e.g., 8,000 characters) to respect LLM token limits and maintain context continuity.

### 5.3 AI Decoding Engine
- Integrate an LLM (Groq API, `llama-3.3-70b-versatile`) to translate dense text chunks into simpler layman terms.
- **Resilience:** The AI processing engine must include intelligent rate-limiting mitigations, incorporating automated delays and exponential backoff retry mechanisms to handle HTTP 429 Rate Limit errors.

### 5.4 Audio Playback Feature
- Include a dedicated "Listen" interface that allows users to play back the AI-decoded plain-language text directly in the browser via Web Speech API.

### 5.5 Dashboard and Persistence
- Implement a dual-view repository: 
  - **Your Workspace:** Documents explicitly processed/uploaded by the authenticated user.
  - **Community Papers:** Global pool of papers uploaded by all users.
- Enable users to read and view their decoded papers managed persistently via Firestore.

## 6. Non-Functional Requirements
### 6.1 Performance
- **Client-Side Execution:** The majority of non-AI processing (text extraction, chunking) should reside on the client to guarantee speed and reduce backend load constraints.
- **UI Responsiveness:** Custom 60fps cursor tracking, lerp-based movement, and seamless transition animations. 

### 6.2 Security
- User identity managed securely defined by Firebase Auth.
- API keys hidden in environment configurations securely (via Vite `.env`).
- Implementation of protected routes via React Context (`AuthContext`).

### 6.3 Reliability
- Graceful error handling in the event of failed text extraction or corrupted PDFs.
- Strict `try/catch` blocks surrounding LLM processing loops to gracefully inform users if maximum retries have been exceeded.

## 7. Technical Architecture (Stack)
- **Frontend Framework:** React 19, Vite.
- **Design System:** Custom Vanilla CSS (Brutalist aesthetic, grid lines).
- **Animations:** Framer Motion.
- **AI Capabilities Engine:** Groq API.
- **Backend / BaaS:** Firebase (Auth & Firestore) + Cloudinary.
- **Libraries Utilities:** `react-router-dom`, `pdfjs-dist`, `jspdf`.

## 8. Future Scope
- Implementation of a global text-search querying across community/user personal workspaces.
- Fine-tuned configuration levels of technical proficiency (e.g., "Explain like I'm 5").
- Ability to make annotations and highlights on the decoded text.
