# CHEA: Cyber Hygiene Educator & Assistant

## Senior Project Presentation

**Candidate:** Shath
**Panel:** Supervisor + 2 University Examiners + 2 External Examiners
**Duration:** ~20 minutes (5 min live demo + 15 min slides)

---

## SLIDE 1 — Title Slide

**CHEA**
**Cyber Hygiene Educator & Assistant**

A Gamified Cybersecurity Desktop Application

Presented by: **Shath**
Supervisor: **[Supervisor Name]**
Date: May 2026

> **Speaker Notes:** Good morning/afternoon everyone. Thank you for taking the time to review my senior project. Today I'll be presenting CHEA — a cybersecurity desktop application that combines practical security tools with education and gamification to make security awareness engaging and practical for everyday users.

---

## SLIDE 2 — Agenda

1. The Problem
2. Our Solution
3. Technology Stack
4. System Architecture
5. Core Features — Security Tools
6. Core Features — Password & Encryption
7. AI-Powered Features
8. Educational Games
9. Security Posture Assessment
10. Gamification System
11. User Interface Design
12. Technical Challenges
13. Live Demonstration
14. Future Work
15. Q&A

> **Speaker Notes:** Here's an overview of what we'll cover today. I'll walk through the problem we identified, our solution, the technical implementation, all feature categories, and then demonstrate the application live. I have about 15 minutes of slides and 5 minutes for the demo.

---

## SLIDE 3 — The Problem

- **Cybersecurity threats are growing exponentially**
  - 2,200+ cyberattacks per day globally
  - Human error accounts for 95% of breaches (IBM, 2024)
- **Existing tools are either too complex or too boring**
  - Commercial tools lack engagement for casual users
  - Educational resources are text-heavy and passive
- **Gamification and AI are underutilized in security education**
  - No existing solution combines tools + education + engagement
- **Gap identified:** An all-in-one, engaging cybersecurity platform for everyday users that is both **practical** and **educational**

> **Speaker Notes:** Before diving into the solution, let's establish why this project exists. Cybersecurity threats are increasing at an alarming rate — IBM reports that human error accounts for 95% of data breaches. The problem isn't a lack of security tools. The problem is that existing tools are either too technical for casual users, or too dry to keep them engaged. Gamification has proven effective in education, and AI is transforming how we interact with technology — but neither has been leveraged effectively in a unified cybersecurity platform.

---

## SLIDE 4 — Our Solution: CHEA

**CHEA — Cyber Hygiene Educator & Assistant**

An all-in-one cybersecurity desktop application that:
- Provides **real, practical security tools** (scanning, encryption, password management)
- Delivers **AI-powered security education** through interactive games
- Uses **gamification** to make security learning addictive
- Built as a **native desktop app** for performance and system access

**Core Philosophy:** Security literacy shouldn't require a computer science degree.

> **Speaker Notes:** CHEA addresses these gaps by providing both practical tools and educational content within a single application. Unlike browser-based tools or fragmented utility suites, CHEA is a cohesive platform. The key differentiators are the gamification layer — which rewards users for security-positive behavior — and the AI-powered educational games that create dynamic, personalized training experiences.

---

## SLIDE 5 — Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type-safe development |
| Vite | Build tool |
| Tailwind CSS | Styling (custom cyberpunk theme) |
| Framer Motion | Animations |
| Zustand | State management |
| React Router v6 | Routing |
| Lucide React | Icon library |

### Backend (Desktop)
| Technology | Purpose |
|---|---|
| Tauri 2.0 (Rust) | Desktop application framework |
| Firebase Auth | User authentication |
| Firebase Firestore | Cloud database |
| VirusTotal API | URL & file malware scanning |
| OpenRouter API | AI chatbot (Grok-4) |

### Security
| Technology | Purpose |
|---|---|
| AES-256-GCM | Data encryption (military-grade) |
| Argon2id | Master password hashing |

> **Speaker Notes:** Let's talk about the technology choices. On the frontend, we used React 18 with TypeScript for type safety and maintainability. Vite provides fast development builds. Tailwind CSS with a custom cyberpunk theme gives us full control over the visual design. Zustand manages global state — specifically user progress and authentication — efficiently without the boilerplate of Redux. Tauri 2.0 with Rust as the backend gives us native desktop capabilities — direct system access for file scanning, PTY for the terminal, and cryptographic operations — while keeping the bundle size much smaller than Electron. Firebase handles authentication and cloud data persistence. For security-critical operations, we use AES-256-GCM for encryption and Argon2id for password hashing — both considered gold-standard in the industry.

---

## SLIDE 6 — System Architecture

```
┌─────────────────────────────────────────────┐
│          FRONTEND (React + TypeScript)       │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │  Pages   │→ │ Services │→ │   Store   │   │
│  └──────────┘  └──────────┘  └───────────┘   │
└──────────┬──────────────────┬────────────────┘
           │                   │
           ▼                   ▼
┌──────────────────┐  ┌──────────────────────┐
│  Firebase Auth   │  │     Tauri IPC        │
│  Firestore       │  │   ┌──────────────┐  │
│                  │  │   │ Rust Backend │  │
│  • User Auth     │  │   │ • AES-256    │  │
│  • User Progress │  │   │ • Argon2id   │  │
│  • Vault Data    │  │   │ • EXIF Parse │  │
│  • Chat History  │  │   │ • VirusTotal │  │
│  • Daily Tasks  │  │   │ • PTY        │  │
└──────────────────┘  └──────────────────────┘
```

**Key Design Decisions:**
- **Client-side encryption:** Decryption happens in the Rust backend, encrypted data stored in Firestore
- **Zero-knowledge architecture:** Master password is NEVER transmitted or stored
- **Cloud sync + local processing:** Best of both worlds — data persists across devices, sensitive ops are local

> **Speaker Notes:** This diagram shows the overall system architecture. The frontend communicates with two backends. Firebase handles authentication and stores user data — profiles, XP progress, vault entries, chat history. Tauri IPC routes requests to the Rust backend, which performs CPU-intensive operations: encryption and decryption, EXIF metadata parsing, VirusTotal API calls, and PTY management for the terminal. Notice that the master password never leaves the client — we use Argon2id to derive a hash stored in Firestore for verification, but the actual password is only ever used locally to derive encryption keys.

---

## SLIDE 7 — Security Design Principles

### Encryption (AES-256-GCM)
- Military-grade symmetric encryption
- Used for: Vault entries, text encryption tool
- Each vault item encrypted individually with a unique IV (Initialization Vector)
- Nonce + ciphertext + tag stored per item

### Password Hashing (Argon2id)
- Winner of Password Hashing Competition (2015)
- Memory-hard: resistant to GPU/ASIC attacks
- Used for: Master password verification
- Parameters: 64MB memory, 3 iterations, 4 parallelism

### Zero-Knowledge Authentication
1. User sets master password → Argon2id hash stored in Firestore
2. Login: Client derives hash from entered password → compare with stored hash
3. Vault access: Password-derived key encrypts/decrypts vault entries
4. **The server NEVER sees the actual password**

> **Speaker Notes:** I'm going to go deeper on the security design since this is a cybersecurity project. We use AES-256-GCM — the same standard used by governments and militaries. Each vault entry gets its own unique initialization vector, which means even identical plaintexts produce different ciphertexts. This prevents pattern analysis. For the master password, we use Argon2id, which was the winner of the Password Hashing Competition. It was specifically designed to resist GPU and hardware attacks by requiring significant memory — we configure it to use 64 megabytes. The key point is our zero-knowledge approach: the application never transmits or stores the actual master password. Only a verification hash goes to the cloud, derived in a way that makes it computationally infeasible to reverse.

---

## SLIDE 8 — Feature Overview: Security Scanning Tools

### 1. Link Scanner
- Scans any URL against **70+ security engines** via VirusTotal API
- Shows detection ratio (e.g., 3/70 engines flagged as malicious)
- Displays threat categories, community trust score
- Detailed per-engine findings
- **XP Reward:** 10 XP

### 2. File Scanner
- Scans files up to **650MB** via VirusTotal API
- Shows SHA256 hash, detection statistics
- Displays file type information
- Vendor-level detection reports
- **XP Reward:** 15 XP

### 3. Image Privacy / EXIF Metadata Stripper
- Extracts **ALL EXIF metadata** from images (GPS, camera info, timestamps, device settings)
- Demonstrates how much hidden data images contain
- One-click metadata removal for privacy protection
- Supports: JPG, PNG, TIFF
- **XP Reward:** 10 XP

> **Speaker Notes:** Let's move into the features. The first category is security scanning tools. The Link Scanner submits URLs to VirusTotal, which aggregates results from over 70 antivirus and security engines. This gives users a comprehensive threat assessment before clicking a link. The File Scanner works similarly — users can scan any file up to 650 megabytes, which gets hashed and checked against VirusTotal's database. The Image Privacy tool is particularly eye-opening — most people don't realize that photos contain GPS coordinates, camera model, lens settings, and timestamps hidden in EXIF metadata. This tool exposes all of it and can strip it with one click. The XP rewards encourage users to actively use these tools.

---

## SLIDE 9 — Feature Overview: Password Management

### 4. Password Generator
- Configurable length: **6 to 64 characters**
- Options: uppercase, lowercase, numbers, symbols
- Excludes confusing characters (ilLIoO0) for readability
- Displays **entropy bits** so users understand strength
- One-click copy to clipboard
- **XP Reward:** 5 XP

### 5. Password Checker
- Real-time strength analysis as you type
- Checks: length, character variety, patterns, common passwords
- Shows **time-to-crack estimate** (real-time, updated on each keystroke)
- **AI-generated attack narrative** — describes how an attacker would approach cracking this specific password
- Improvement suggestions
- **XP Reward:** 3 XP

### 6. Credential Vault (Password Manager)
- Securely stores **login credentials AND credit cards** (Visa, Mastercard, Amex, Discover)
- All data encrypted with **AES-256-GCM** before Firestore storage
- Master password protection with **Argon2id** hashing
- Features: copy username/password, reveal/hide, copy card numbers
- Syncs across devices via Firebase
- **XP Reward:** 20 XP

> **Speaker Notes:** The password management suite covers three tools. The Password Generator creates strong passwords with configurable complexity, and importantly, it shows entropy — which tells users mathematically how strong the password is. The Password Checker is more than just a strength meter — the AI generates an attack narrative that describes in plain English how an attacker would try to crack that specific password. This makes the abstract concept of password strength tangible. The Credential Vault is a full password manager integrated directly into the app. Unlike browser-based password managers, this works across all applications. And critically, vault data is encrypted client-side before it ever touches Firebase — the cloud never sees plaintext.

---

## SLIDE 10 — Feature Overview: Encryption Tools

### 7. Text Encryption / Decryption
- Encrypt any text using **AES-256-GCM**
- User provides a password → key derived from password
- Output: Base64-encoded encrypted string (can be shared)
- One-click copy
- Decryption: Paste encrypted text + enter original password
- Use cases: Secure note sharing, sensitive data in messages, credential exchange

**Example Flow:**
1. User writes: "Meeting at 3pm, room 204"
2. Sets password: "SecurePass123"
3. Gets encrypted string (appears random)
4. Recipient pastes string + enters password → original text revealed

> **Speaker Notes:** The encryption tool uses the same AES-256-GCM algorithm as the vault. The key difference is that this tool is designed for one-off encryptions — you choose a password each time, and the output is a shareable encrypted string. This is useful for sending sensitive information over unencrypted channels like email or messaging apps. Only someone with the password can decrypt it. The encryption happens entirely in the Rust backend, and the encrypted output is a Base64 string that's safe to copy and share.

---

## SLIDE 11 — AI-Powered Feature: Nova

### 8. AI Cybersecurity Chatbot (Nova)
- **Powered by Grok-4** via OpenRouter API
- **Full app knowledge:** Nova is trained to answer any question about CHEA's features
- Supports **Markdown** rendering, code blocks with syntax highlighting
- Supports **Mermaid diagrams** for visualizing security concepts
- Full **Arabic RTL** language support
- **Strictly cybersecurity-focused:** won't answer off-topic questions
- Chat history persisted to Firestore — picks up where you left off
- **XP Reward:** 5 XP per message

**Example Interactions:**
- "Explain how AES-256-GCM encryption works"
- "What are the red flags in phishing emails?"
- "Generate a diagram showing the CIA triad"

> **Speaker Notes:** Nova is the AI component of CHEA — a cybersecurity-specialized chatbot powered by Grok-4 through OpenRouter. What sets Nova apart from a general chatbot is that she has full knowledge of the application — she can guide users through any feature. She renders Markdown, syntax-highlighted code, and can generate Mermaid diagrams for visualizing security concepts like the CIA triad or network topologies. She's also bilingual — full Arabic RTL support. And importantly, she's bounded to cybersecurity topics, which keeps the educational focus intact. Chat history syncs to Firestore so conversations persist across sessions.

---

## SLIDE 12 — Educational Game: Quiz Arena

### 9. Quiz Arena
- **5-question cybersecurity quizzes** per round
- **3 difficulty tiers** based on user level:
  - **Bronze (Levels 1–3):** Basic concepts — password hygiene, phishing basics, malware definitions
  - **Silver (Levels 4–6):** Intermediate — social engineering tactics, network security, attack vectors
  - **Gold (Levels 7+):** Advanced — APTs, zero-day vulnerabilities, cryptographic protocols
- **5 categories:** Phishing, Passwords, Malware, Network Security, Social Engineering
- **Detailed explanations** for every answer (not just correct/incorrect)
- **Streak bonuses** for consecutive correct answers
- **XP Reward:** 15 XP

**Gamification Layer:**
- Questions get harder as user level increases
- Streak multipliers reward consistent engagement
- Explanations reinforce learning, not just scoring

> **Speaker Notes:** The Quiz Arena is the first of three educational games. It delivers cybersecurity quizzes that scale with the user's level. Beginners get fundamental questions about password hygiene and phishing, while advanced users face questions about advanced persistent threats and cryptographic protocols. The key educational element is the explanation system — after each question, users learn not just that an answer is right or wrong, but why. This transforms the quiz from a test into a learning tool. The difficulty scaling means the game stays challenging as users progress, which supports long-term engagement.

---

## SLIDE 13 — Educational Game: Phishing Dojo

### 10. Phishing Dojo
- **Interactive phishing email detection training**
- **2 game modes:**
  - **Classic Mode:** Curated library of real-world phishing emails
  - **AI Challenge Mode:** AI-generated phishing emails for unique training scenarios
- Users identify **red flags** in suspicious emails
- **Detailed explanations** of each red flag discovered
- **Tiered ranking system:** Cadet → Analyst → Operator
- **XP Reward:** 15 XP per round

**AI Integration:**
- AI generates unique phishing templates
- Each AI-generated email is different, preventing memorization
- Teaches pattern recognition, not pattern matching

> **Speaker Notes:** Phishing remains the most common attack vector, responsible for 90% of data breaches. The Phishing Dojo trains users to recognize phishing emails through hands-on practice. The AI Challenge Mode is particularly valuable — it uses AI to generate unique phishing emails each time, so users can't simply memorize known phishing templates. They learn to recognize the underlying red flags: mismatched URLs, urgency tactics, suspicious sender addresses, grammatical errors, and more. The ranking system from Cadet to Operator provides clear progression milestones.

---

## SLIDE 14 — Educational Game: Scenario Simulator

### 11. Scenario Simulator
- **AI-powered dynamic security decision simulator**
- **5-round decision-making challenges** per scenario
- AI generates a unique scenario narrative each time
- User makes security decisions at each step
- AI generates **consequences** for each decision (immediate + long-term)
- AI evaluates final choices and provides personalized feedback
- **Topics covered:** Phishing, passwords, social engineering, WiFi security, data privacy, malware, physical security

**Example Scenario:**
1. "You receive an email from 'IT Support' asking you to reset your password via a link..."
2. User choice → AI consequence → next round
3. After 5 rounds → AI evaluation + personalized feedback

> **Speaker Notes:** The Scenario Simulator is the most sophisticated educational game. Unlike quizzes with fixed questions, this tool uses AI to generate unique scenarios every time. Users face a multi-step security decision narrative where each choice has consequences — some obvious, some subtle. The AI tracks decisions across 5 rounds and provides an overall evaluation at the end. This teaches decision-making under uncertainty, which is closer to real-world security situations than multiple-choice quizzes. Topics span the full range of cybersecurity concerns from social engineering to physical security.

---

## SLIDE 15 — AI-Powered Security Posture Assessment

### 12. Security Posture Assessment
- **Multi-question interactive security questionnaire** (20+ questions)
- AI analyzes all responses and generates a **personalized security report**
- **Graded assessment (A through F)** across 4 security categories:
  - Password Hygiene
  - Network Safety
  - Data Privacy
  - Social Engineering
- **Overall grade** combining category scores
- **Top 5 vulnerabilities** specific to the user's situation
- **Prioritized recommendations** with actionable steps
- **XP Reward:** 25 XP

**AI Report Generation:**
- Personalized narrative explaining risks
- Context-aware recommendations (based on user's answers)
- Actionable next steps ranked by impact

> **Speaker Notes:** The Security Posture Assessment is the capstone educational feature. It combines an interactive questionnaire with AI-powered analysis to generate a personalized security report. Users answer questions about their security habits — password practices, network usage, data handling, social engineering susceptibility. The AI then analyzes this holistically and produces a report with letter grades for each category, identifies their top vulnerabilities, and provides prioritized recommendations. This is more actionable than generic security advice because it's specific to their actual habits. The 25 XP reward reflects the depth and value of this feature.

---

## SLIDE 16 — Gamification System

### XP Rewards
| Activity | XP |
|---|---|
| Scan Link | 10 |
| Scan File | 15 |
| Scan Image | 10 |
| Generate Password | 5 |
| Check Password | 3 |
| Create Encryption | 5 |
| Create Vault Entry | 20 |
| Chat with AI (per message) | 5 |
| Complete Quiz | 15 |
| Complete Phishing Round | 15 |
| Complete Scenario | 15 |
| Security Posture Assessment | 25 |

### Leveling System
- **Level = floor(XP / 100) + 1**
- **Bronze Tier:** Levels 1–3 (basic quiz content)
- **Silver Tier:** Levels 4–6 (intermediate content)
- **Gold Tier:** Levels 7+ (advanced content)

### Streak System
- Tracks consecutive daily logins
- Resets if user misses a day
- Streak bonus: +10 XP per day for 3+ day streaks

### Daily Quests
3 rotating tasks refreshed every 24 hours:
1. Scan something (link/file/image) → 20 XP
2. Generate or check a password → 15 XP
3. Chat with AI → 10 XP

### Security Score (Dashboard)
Composite score (max 100%):
- XP contribution: up to 25 points
- Streak: up to 20 points
- Vault items: up to 15 points
- Activities: up to 15 points
- Base score: 10 points

> **Speaker Notes:** The gamification system is what makes CHEA engaging. Every action earns XP, which levels users up and unlocks harder quiz content. The streak system rewards daily engagement — missing a day resets the streak, which creates a compelling reason to return. Daily quests give users specific goals each day rather than an open-ended tool. The Security Score on the dashboard is a composite metric that reflects not just XP, but consistency and breadth of usage. A user who has Vault entries and maintains a streak will score higher than someone with the same XP but spotty engagement. This mirrors real-world security — consistency matters.

---

## SLIDE 17 — User Interface Design

### Cyberpunk / Neon Aesthetic
**Dark Mode (Default):**
- Primary: Cyan (#8ff5ff)
- Accent: Neon Crimson (#FF0A54), Neon Violet (#4D00FF)
- Background: Cyber Void (#05050A)

**Light Mode:**
- Clean white backgrounds with teal/violet accents
- Primary: Deep Teal (#005d63)

### Custom Animations
- `fade-in` — Smooth page transitions
- `slide-up` — Card entrance effects
- `shimmer` — Progress bar loading
- `neon-pulse` — Pulsing glow effects
- `cyber-scan` — Scanning line animation
- `glow-rotate` — Rotating gradient

### Typography
- Display: Outfit
- Headlines: Orbitron (cyberpunk aesthetic)
- Body: Plus Jakarta Sans

### Desktop-Native Features
- Custom title bar (frameless window with controls)
- Draggable music player widget
- Embedded PowerShell terminal (via PTY)
- Responsive sidebar navigation

### Accessibility & i18n
- Full English + Arabic (RTL) support
- Keyboard navigation
- ARIA labels
- Color contrast compliance

> **Speaker Notes:** Now let's talk about the user experience. CHEA uses a cyberpunk neon aesthetic — dark backgrounds with vibrant cyan, crimson, and violet accents. This isn't just for looks — the theme is thematically appropriate for a cybersecurity app, evoking a "digital defender" feel. We implemented custom animations including neon pulse effects, scanning line animations, and shimmer loading states — all via Framer Motion and CSS. The typography uses Orbitron for headlines, giving it that futuristic cyber feel while Plus Jakarta Sans keeps body text readable. As a desktop app, CHEA supports native features like the custom title bar and embedded PowerShell terminal. We also prioritized accessibility — full bilingual support with Arabic RTL, keyboard navigation, and color contrast compliance.

---

## SLIDE 18 — Desktop Utilities

### Calculator
- Standard calculator for quick math
- Accessible from the sidebar

### PowerShell Terminal
- **Embedded PowerShell terminal** via Rust PTY (portable-pty)
- Full command-line access within the app
- For power users who want direct system access
- All within the secure desktop environment

### Music Player
- Background music player widget
- **Draggable positioning** — users can place it anywhere on screen
- Enhances the user experience without being intrusive

> **Speaker Notes:** Beyond the security tools, CHEA includes practical desktop utilities. The calculator provides quick access without leaving the app. The PowerShell terminal is particularly useful — using Rust's portable-pty library, we've embedded a fully functional PowerShell session directly in the application. This is valuable for power users who want command-line access without switching to a separate terminal window. And the draggable music player adds to the overall experience without distracting from the core functionality.

---

## SLIDE 19 — Technical Challenges & Solutions

### 1. Tauri IPC Communication
**Challenge:** Bridging React frontend with Rust backend cleanly and type-safely.
**Solution:** Custom Tauri commands with TypeScript interfaces. All IPC calls wrapped in typed service functions in `src/services/`.

### 2. AES-256-GCM Encryption in Rust
**Challenge:** Implementing NIST-standard encryption correctly (IV management, tag verification).
**Solution:** Used the `aes-gcm` crate with unique random IVs per encryption. Rust ownership model ensures memory safety during crypto operations.

### 3. Argon2id Password Hashing
**Challenge:** Memory-hard hashing with correct parameters for security without UX friction.
**Solution:** Configured with 64MB memory, 3 iterations, 4 parallelism — strong security with <1 second verification time.

### 4. EXIF Metadata Extraction & Removal
**Challenge:** Parsing complex EXIF structures and cleanly removing metadata without corrupting images.
**Solution:** Used `kamadak-exif` for parsing and `img-parts` for clean metadata removal. Supported formats: JPEG, PNG, TIFF.

### 5. AI Integration — Staying On-Topic
**Challenge:** Preventing the AI chatbot from answering off-topic questions.
**Solution:** System prompt engineering + prompt validation. Nova is bounded to cybersecurity topics with fallback responses for off-topic queries.

### 6. Gamification Data Persistence
**Challenge:** Syncing XP, streaks, and daily quests across devices in real-time.
**Solution:** Firestore document with `onSnapshot` listeners for real-time UI updates. Streak logic calculated server-side to prevent client manipulation.

> **Speaker Notes:** Let me highlight a few of the key technical challenges we faced. The Tauri IPC required careful type design to keep the TypeScript frontend and Rust backend in sync. For encryption, we had to implement AES-256-GCM correctly — including proper IV generation, tag verification, and secure memory handling, which Rust's ownership model helped enforce. Argon2id configuration was a tradeoff between security strength and user experience — 64MB memory makes it resistant to hardware attacks while keeping verification under one second. The EXIF handling was technically interesting because we needed to both parse complex metadata structures and cleanly remove them without corrupting the image file. And for the AI integration, we engineered the system prompt to keep Nova strictly focused on cybersecurity — without this, users could use the chatbot for general purposes, diluting the educational focus.

---

## SLIDE 20 — Live Demonstration

### Demo Steps (5 minutes)

1. **Dashboard Overview** — Show security score, level, daily quests
2. **Link Scanner** — Scan a real URL (e.g., Google.com)
3. **Password Generator** — Generate a strong password, show entropy
4. **Password Checker** — Show the AI attack narrative
5. **Quiz Arena** — Quick 3-question round
6. **Credential Vault** — Create a vault entry, show encryption
7. **AI Chatbot (Nova)** — Ask a cybersecurity question with diagram

> **Speaker Notes:** Now let's see CHEA in action. I'll be demonstrating the key features live on this machine. [Transition to live application]

---

## SLIDE 21 — Project Scope & Development

### What's Implemented
- 14+ fully functional features
- All core pages and routing
- Full authentication flow (login, register, password reset)
- Gamification system (XP, levels, streaks, daily quests)
- AI chatbot with Firestore persistence
- Desktop-native terminal integration
- Full i18n support (EN + AR RTL)
- Real-time data sync across sessions

### Development Timeline
| Phase | Duration |
|---|---|
| Research & Planning | 2 weeks |
| Core Architecture (Tauri + Auth) | 2 weeks |
| Security Tools (Scanning + Encryption) | 3 weeks |
| Password Management + Vault | 2 weeks |
| AI Integration + Games | 3 weeks |
| UI Polish + Gamification | 2 weeks |
| Testing & Documentation | 2 weeks |
| **Total** | **~16 weeks** |

### Tools & Collaboration
- Version control: Git + GitHub
- Task management: Linear / Notion
- Communication: Regular supervisor meetings

> **Speaker Notes:** For those interested in the development process — the project spanned approximately 16 weeks. The architecture and authentication came first — establishing the foundation before building features on top. The security tools and encryption came next, followed by the AI integration and educational games. The UI polish and gamification system were iterative throughout. We used Git for version control with regular commits, and I maintained communication with my supervisor throughout the development.

---

## SLIDE 22 — Future Work

### Short-Term Improvements
- **Mobile companion app** — Extend core vault and scanner to iOS/Android
- **Browser extension** — One-click link scanning from any browser
- **PDF security reports** — Export Security Posture reports as shareable documents

### Medium-Term Enhancements
- **Team/organization mode** — Shared security training with admin dashboards
- **Network scanner** — Local network device discovery and security assessment
- **Backup/export vault** — Encrypted vault export with recovery options
- **More AI games** — Additional game types beyond phishing and scenarios

### Long-Term Vision
- **Community threat feed** — CHEA users share and vote on suspicious URLs
- **CTI integration** — Integration with threat intelligence platforms
- **Custom training paths** — Personalized learning based on Security Posture results

> **Speaker Notes:** For future work, the immediate priorities are a mobile companion app and browser extension to extend the vault and scanner beyond the desktop. Medium-term, a team mode for organizations would allow shared security training with admin oversight. Long-term, a community threat feed where CHEA users collectively identify and vote on suspicious URLs could create a powerful crowdsourced security network. The platform architecture supports all of these extensions — the modular design means new features can be added without restructuring the core.

---

## SLIDE 23 — Conclusion

### What CHEA Achieves
✅ **14+ integrated security tools** in one application
✅ **AI-powered education** through dynamic games and assessments
✅ **Gamification** that makes security learning addictive
✅ **Military-grade encryption** (AES-256-GCM + Argon2id)
✅ **Native desktop experience** via Tauri/Rust
✅ **Bilingual support** (English + Arabic RTL)
✅ **Zero-knowledge architecture** protecting user privacy

### Key Contributions
1. **Unified platform** — First desktop app combining tools, education, and gamification
2. **AI-generated training content** — Dynamic, personalized, never重复
3. **Engagement metrics** — Streak system and daily quests drive retention
4. **Security by design** — Client-side encryption with zero-knowledge architecture

### Learnings
- Full-stack development: React + TypeScript + Tauri/Rust + Firebase
- Cryptographic implementation: AES-256-GCM, Argon2id
- AI API integration: System prompts, context management, content validation
- UI/UX design: Cyberpunk aesthetic, animations, accessibility
- Agile development: Iterative builds, supervisor feedback cycles

> **Speaker Notes:** In conclusion, CHEA achieves its goal of making cybersecurity accessible and engaging. It delivers 14 integrated tools — from URL scanning to AI chatbots — all in a single application with a cohesive gamification layer. The security architecture demonstrates proper cryptographic implementation with a zero-knowledge approach. The development process itself was a comprehensive exercise in full-stack development, from React frontend through Tauri/Rust backend to cloud services. Thank you for your time — I'm happy to take any questions.

---

## SLIDE 24 — Q&A

### Questions for Discussion

1. **How does the zero-knowledge authentication actually verify the master password without storing it?**
2. **What safeguards prevent the AI chatbot from generating harmful content?**
3. **How does the gamification system handle users who exploit the XP rewards?**
4. **What privacy considerations were addressed for the Firestore data storage?**
5. **How does the EXIF stripping handle edge cases like corrupted metadata or unsupported formats?**

---

**Contact:** [Your email]
**Repository:** [GitHub link]
**Demo Video:** [Link if available]

> **Speaker Notes:** I'm happy to take questions on any aspect of the project. I've prepared a few potential discussion points here, but I'm open to any questions about the architecture, the security implementation, the AI integration, the gamification design, or the development process. Thank you again for your time and consideration.
