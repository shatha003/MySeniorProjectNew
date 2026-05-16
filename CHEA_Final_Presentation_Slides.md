# CHEA — Senior Project Presentation Slides

---

## SLIDE 1 — Title Slide

**[Visual: CHEA logo + app screenshot on cyberpunk background]**

**CHEA**
*Cyber Hygiene Educator & Assistant*

A Gamified Cybersecurity Desktop Application

**Candidate:** [Your Name]
**Supervisor:** [Supervisor Name]
**Institution:** [University Name]
**Date:** May 2026

---

## SLIDE 2 — The Problem

**[Visual: Montage of breach headlines, weak password cracking demo]**

### The Threat Is Growing

- **300% increase** in cyberattacks targeting educational institutions since 2020
- Students are primary targets — they have valuable data, rarely update security, and click anything

### The Skill Gap Is Worse

- **81%** of data breaches start with weak or stolen passwords
- **94%** of malware enters via email — yet K-12 covers this least
- Every photo leaks GPS, camera info, and timestamps — students don't know this

### The Tools Are Broken

- Existing solutions are scattered across multiple apps
- Assumes adult technical knowledge
- Either boring educational videos OR scary black-box tools
- Students zone out — retention is near zero

> **Key insight:** Security literacy isn't a one-time lesson — it's a habit that needs to be built.

---

## SLIDE 3 — Literature Review

**[Visual: Research citations with key findings highlighted]**

### What Research Says About Students

| Researcher | Finding |
|---|---|
| Almomani et al. (2021) | Students use weak, guessable credentials and can't recognize social engineering |
| Purnama et al. (2021) | Digital literacy predicts online risk — but knowledge alone doesn't change behavior |
| Cowling et al. (2025) | Digital safety cannot be separated from digital literacy — needs integrated approaches |
| Pramod (2025) | Gamification significantly improves engagement and retention |
| Khairallah & Abu-Naseer (2024) | Gamified learning outperforms traditional lecture-based training |

### What Students Actually Want

- **81%** would engage more with security training if it had points and rewards
- **Strong preference** for gamified learning over lectures
- **Zero** existing tools combine education AND real protection in one platform

---

## SLIDE 4 — Gaps Identified

**[Visual: 5 boxes with icons, one for each gap]**

### Five Critical Gaps in Current Solutions

**1. Tool Integration Gap**
Security tools exist as separate applications → causes "security fatigue"

**2. Age-Appropriateness Gap**
Interfaces assume adult vocabulary and processing → inaccessible to ages 9–15

**3. Education-Protection Gap**
Solutions split into education OR tools → never both in one platform

**4. Engagement Gap**
Lecture-based training fails to retain attention → zero behavioral change

**5. Accessibility Gap**
Subscription models exclude lower-income students → security becomes a privilege

> **Gap addressed by CHEA:** All five — in one unified platform

---

## SLIDE 5 — Our Solution: CHEA

**[Visual: App dashboard showing all features at a glance]**

### What Is CHEA?

CHEA is a **unified cybersecurity platform** that combines **real protection tools** with **interactive education** — wrapped in a gamification system that makes students want to practice security daily.

### Designed for Ages 9–15

- **Visual feedback**: Red/green indicators instead of technical jargon
- **Cyberpunk aesthetic**: Makes security feel exciting, not scary
- **Dual-purpose tools**: Every tool teaches while it protects
- **Free**: No subscription barriers — security is a right, not a privilege

### The Core Philosophy

> "We don't teach cybersecurity. We make students want to practice it."

---

## SLIDE 6 — Features at a Glance

**[Visual: 3 columns — Tools | Games | AI]**

### Security Tools (Real Protection)

| Tool | Function |
|---|---|
| **Link Scanner** | Scan URLs against 70+ engines (VirusTotal) |
| **File Scanner** | Scan files up to 200MB for malware |
| **Image Privacy** | View + strip GPS/camera data from photos |
| **Password Generator** | Create strong passwords with entropy display |
| **Password Checker** | See crack time + AI attack narrative |
| **Encrypted Vault** | Store passwords + cards (AES-256-GCM) |
| **Text Encryption** | Encrypt any message with any password |

### Educational Games (Learning by Doing)

| Game | Description |
|---|---|
| **Quiz Arena** | 5-question quizzes, 3 tiers (Bronze → Gold) |
| **Phishing Dojo** | Spot fake emails — AI generates new ones every round |
| **Scenario Simulator** | 5-round security decisions with AI consequences |

### AI Features

- **Nova**: 24/7 cybersecurity chatbot (plain English, diagrams)
- **Security Posture Assessment**: AI gives a personal security report card
- **Attack Narrative**: AI describes how a hacker would attack your password
- **Security Buddy**: Daily personalized challenges

---

## SLIDE 7 — Why Gamification Works

**[Visual: Engagement loop diagram — Use tool → Earn XP → Level up → Come back]**

### The Problem with Traditional Training

```
Traditional Approach:
Learn → Maybe Remember → Rarely Apply → No Habit Formed
  ↓           ↓               ↓              ↓
 Boring    Low Retention   No Behavioral   Gone Tomorrow
                             Change

CHEA Approach:
Use Tool → Earn XP → Level Up → Unlock Content → Keep Streak → Daily Habit
  ↓         ↓          ↓            ↓              ↓            ↓
Real Skill Immediate   Visible    Harder        Returns      Embedded
                Reward  Progress   Challenges    Daily        Habit
```

### How CHEA Keeps Students Engaged

- **XP for everything**: Scanning, generating, playing, chatting
- **10-level progression**: Rookie → Scout → Shield → Guardian → Cyber Ninja...
- **Daily streaks**: Miss a day = streak resets → motivation to return
- **Daily quests**: 3 specific goals refreshed every 24 hours
- **Security Score**: Composite metric showing real progress

---

## SLIDE 8 — System Architecture

**[Visual: Layered diagram of the 5-tier architecture]**

### Five-Layer Architecture

```
┌─────────────────────────────────────────────────┐
│           PRESENTATION LAYER                    │
│ React 18 + TypeScript + Tailwind CSS           │
│ Framer Motion (animations)                      │
│ i18next (English + Arabic with RTL)            │
├─────────────────────────────────────────────────┤
│           BUSINESS LOGIC LAYER                 │
│ Zustand (auth, progress, tasks, activities)    │
│ Custom hooks for real-time updates              │
├─────────────────────────────────────────────────┤
│           BACKEND PROCESSING (Rust)            │
│ encrypt_text / decrypt_text                     │
│ scan_url / scan_file                            │
│ scan_image_metadata / strip_image_metadata      │
│ chat_with_ai                                    │
│ write_to_pty                                    │
├─────────────────────────────────────────────────┤
│           DATA LAYER                           │
│ Firebase Firestore (NoSQL)                     │
│ Firebase Auth                                   │
├─────────────────────────────────────────────────┤
│           EXTERNAL SERVICES                    │
│ VirusTotal API v3                               │
│ OpenRouter API (Grok-4)                         │
└─────────────────────────────────────────────────┘
```

### Why Tauri? (Not Electron or Web)

| Factor | Tauri | Electron |
|---|---|---|
| Bundle Size | ~10 MB | ~150 MB |
| Memory Usage | Low | High |
| Backend | Rust (memory-safe) | Node.js |
| Security | Minimal attack surface | Large (Node exposure) |
| Native WebView | Yes | No (bundles Chromium) |

> **Rust backend** performs cryptographic operations and API calls securely — the frontend never touches raw keys.

---

## SLIDE 9 — Security Design

**[Visual: Encryption flow diagram — plaintext → key derivation → ciphertext]**

### Zero-Knowledge Architecture

```
1. User creates master password
   ↓
2. Client encrypts a known string using AES-256-GCM
   Key derived via Argon2id (64MB memory, 3 iterations)
   ↓
3. Encrypted verification hash → Stored in Firestore
   ↓
4. Master password NEVER leaves the device
   ↓
5. Cloud NEVER sees the actual password
   ↓
6. Even if Firestore is breached → Useless ciphertext
```

### Why This Is Secure

| Technology | Why It Matters |
|---|---|
| **AES-256-GCM** | Same standard used by governments — AEAD (confidentiality + authenticity) |
| **Argon2id** | Memory-hard → resistant to GPU/ASIC attacks. 64MB memory, 3 iterations |
| **Unique IV per encryption** | Same plaintext produces different ciphertext → pattern analysis impossible |
| **No password recovery** | By design — zero-knowledge means no backdoor exists |

### Client-Side Encryption Flow

- Every vault entry encrypted **before** it touches Firestore
- Key is your master password — derived locally via Argon2id
- Decryption happens in the Rust backend
- API keys live in Rust only — never in frontend JavaScript

---

## SLIDE 10 — Database Design

**[Visual: Firestore hierarchy tree]**

### Firestore Structure

```
users/{userId}/
├── progress/data         → XP, level, streak, totalScore, lastActiveDate
├── vaultConfig/main      → encryptedVerifyHash (master password verification)
├── vault/{credentialId}  → encrypted credentials (logins + cards)
├── dailyTasks/           → daily quest progress
├── activities/           → last 15 entries with type icons
└── chatSessions/         → AI chat history
```

### Key Design Decisions

- **User-scoped**: All data accessible only by the authenticated owner
- **Encrypted before write**: Vault entries are ciphertext in Firestore
- **No plaintext PII**: Names/emails handled by Firebase Auth only
- **Real-time sync**: Zustand + Firestore listeners for instant UI updates
- **Offline capability**: Core features work without internet

---

## SLIDE 11 — User Interface Design

**[Visual: Dashboard screenshot with labeled sections]**

### Authentication

- Login / Register / Forgot Password flows
- PublicRoute/ProtectedRoute route guards
- Real-time password strength meter (minimum 12 characters)
- Terms agreement + privacy policy checkboxes

### Dashboard Components

- **Profile**: Avatar, display name, level badge (Bronze → Platinum)
- **XP Progress Bar**: Animated with numerical values and next level target
- **Streak Counter**: Flame icon with consecutive days
- **Security Score**: 0–100 composite (XP + Streak + Vault + Activity)
- **Daily Tasks**: 7 objectives with checkmarks (max 125 XP/day)
- **Activity Feed**: Last 15 entries with type-specific icons
- **Quick Access Grid**: One-click navigation to all tools

### Design System

| Element | Implementation |
|---|---|
| **Theme** | Cyberpunk/Neon — dark mode default + light mode |
| **Colors** | Primary #8ff5ff, Crimson #FF0A54, Violet #4D00FF |
| **Animations** | fade-in, slide-up, shimmer, neon-pulse, cyber-scan |
| **Typography** | Orbitron (headlines), Outfit (UI), Plus Jakarta Sans (body) |
| **Accessibility** | Light/dark modes, keyboard navigation, ARIA labels, EN+AR RTL |

---

## SLIDE 12 — Feature Showcase

**[Visual: Split screen — app demo on one side, feature name on the other]**

### Security Tools (Demo These)

| Feature | Show This |
|---|---|
| Link Scanner | Paste URL → 4-second VirusTotal poll → green/red result |
| File Scanner | Drag-drop file → SHA256 hash → detection stats |
| Image Privacy | Open photo → GPS on Google Maps → strip → clean |
| Password Checker | Type "password123" → 0.3s crack time → AI attack story |
| Encrypted Vault | Create entry → encrypted storage → decrypt on demand |

### Educational Games (Demo These)

| Game | Show This |
|---|---|
| Quiz Arena | 3 questions → streak tracking → explanations |
| Phishing Dojo | Email with red flags → feedback on each flag |
| Scenario Simulator | 2 rounds → choices → AI consequences |

### AI Features (Demo These)

| Feature | Show This |
|---|---|
| Nova Chatbot | "How do I stay safe online?" → plain English answer |
| Security Posture | Complete survey → AI generates letter grade report |
| Security Buddy | 3 daily challenges with progress tracking |

---

## SLIDE 13 — Significance & Impact

**[Visual: Three pillars — Practical | Conceptual | Educational]**

### Practical Significance

- Consolidates 5 security tools + 6 AI features in one platform
- Provides **real protective utility**, not just simulations
  - VirusTotal scanning for real URLs and files
  - AES-256-GCM encrypted vault for real credentials
- Free and accessible — no subscription barriers

### Conceptual Significance

- Challenges the assumption that security must be boring or scary
- Proves professional-grade encryption (AES-256-GCM) can be made accessible to non-technical users ages 9–15
- Addresses the false dichotomy between education and protection

### Impact on Education

- Supplementary tool for K-12 cybersecurity curriculum
- Measurable engagement through XP, levels, and progression metrics
- Phishing Dojo provides **hands-on phishing training** impossible to achieve through textbooks
- AI-powered personalization scales to any number of students

---

## SLIDE 14 — Limitations

**[Visual: Honest, transparent layout]**

### Scope Limitations

- **Target age**: Ages 9–15 — not designed for adults or professional users
- **Platform**: Desktop-only — no mobile or web versions currently

### Technical Limitations

- **VirusTotal API quotas**: Free tier limits scalability for large deployments
- **AI dependency**: Nova chatbot relies on OpenRouter API availability
- **No master password recovery**: By design (zero-knowledge) — users must remember their password

### Functional Limitations

- **Metadata stripping**: JPEG and PNG only — not TIFF or other formats
- **URL checker**: Detects known threats — not zero-day exploits

### Resource Limitations

- **No automated testing**: Increases regression risk
- **Evaluation**: Based on informal user feedback — no formal longitudinal study yet

---

## SLIDE 15 — Future Work

**[Visual: Roadmap-style layout]**

### Feature Expansion

- **Mobile companion app** (iOS/Android) via React Native or Flutter
- **Browser extension** for real-time URL protection during web browsing
- **Additional modules**: Social media safety, network security basics, malware exercises

### Technical Improvements

- **User-scoped Firestore security rules** (currently time-based access)
- **Blockchain-based vault recovery** for master password
- **API caching layer** for offline functionality and reduced rate limits
- **Automated testing framework** (unit + integration tests)

### Research Opportunities

- **Long-term retention studies**: Measuring cybersecurity habit formation over 6–12 months
- **Comparative analysis**: CHEA vs. traditional classroom education
- **Community deployment**: Open-source for wider adoption + LMS integration

### Localization

- Extend beyond English/Arabic to reach global student populations

---

## SLIDE 16 — Live Demonstration

**[Visual: Transition to app window — 5 minutes]**

| Step | Feature | Time | What to Show |
|---|---|---|---|
| 1 | Dashboard | 30s | XP bar, streak counter, daily tasks, security score |
| 2 | Link Scanner | 45s | Paste a URL → real scan → results |
| 3 | Password Checker | 45s | Weak password → crack time → AI attack narrative |
| 4 | Quiz Arena | 45s | 3 quick questions → explanations → XP earned |
| 5 | Encrypted Vault | 45s | Create credential → encrypted → decrypt |
| 6 | AI Chatbot (Nova) | 45s | Ask "how do I stay safe online?" → answer |
| 7 | Close | 30s | Dashboard → show gamification loop running |

> **Demo tip:** Narrate while you click. Say what you're doing and why it matters.

---

## SLIDE 17 — Q&A Preparation

**[Visual: Key questions on screen]**

### Anticipated Examiner Questions

**"Why Tauri and not Electron or a web app?"**
> Tauri produces ~10MB apps vs Electron's ~150MB. Rust backend handles security-critical crypto operations safely. Native WebView instead of bundled Chromium means lower memory, better performance, and smaller attack surface.

**"How is the master password actually secure?"**
> Zero-knowledge architecture. The password never leaves the device. We encrypt a known string with it and store only that hash in Firestore. Even if the database is breached, attackers get ciphertext without the key — which is useless.

**"Why ages 9–15 specifically?"**
> Research shows this is the critical window for habit formation. Too young for complex adult tools; too old for pure games. This age group is actively building digital habits that will last a lifetime. CHEA meets them where they are.

**"What makes CHEA different from just bundling existing tools?"**
> Three things: (1) The gamification layer makes students want to come back daily. (2) AI generates unique content — phishing emails are different every round. (3) Every tool teaches while it protects — dual-purpose design.

**"Why no master password recovery?"**
> By design. Zero-knowledge means no backdoor — ever. Recovery would require storing the password or a recovery key, which defeats the entire security model. Users are informed at setup.

**"What is the evaluation methodology?"**
> Informal user testing with peers and supervisors. No formal study yet. Future work includes long-term retention studies.

---

## SLIDE 18 — Thank You

**[Visual: CHEA logo + closing animation]**

**CHEA — Cyber Hygiene Educator & Assistant**

Security made simple. Security made fun.

**Thank you for your time.**

**Questions?**

---

## Speaker Notes (Quick Reference)

### Slide 1 — Title
> "Good morning/afternoon. Today I'll present CHEA — a senior project that tackles a growing problem: students are increasingly targeted by cyberattacks, but existing tools are either too complex or too boring to change their behavior."

### Slide 2 — Problem
> "The numbers speak for themselves. 300% more attacks on educational institutions since 2020. 81% of breaches from weak passwords. 94% of malware through email. And K-12 covers these topics the least."

### Slide 3 — Literature Review
> "Research confirms this gap. Students use weak passwords and can't recognize phishing. Knowledge alone doesn't change behavior — you need integrated approaches. And gamification significantly improves both engagement and retention."

### Slide 4 — Gaps
> "We identified five critical gaps: tool fragmentation, age-inappropriate design, education vs. protection split, engagement failure, and accessibility barriers."

### Slide 5 — Our Solution
> "CHEA addresses all five gaps. It's a unified platform combining real protection tools with interactive education — wrapped in a gamification system."

### Slide 6 — Features
> "CHEA has seven security tools, three educational games, and six AI features. Let me quickly show what that means in practice."

### Slide 7 — Gamification
> "The key insight is that security isn't a one-time lesson — it's a habit. CHEA makes you want to practice. Earn XP. Keep a streak. Unlock harder content."

### Slide 8 — Architecture
> "Under the hood: React frontend, Zustand state management, Rust backend for crypto and API calls, Firebase for data, and external services for scanning and AI."

### Slide 9 — Security
> "Security was a first principle. All vault data is encrypted client-side before it touches Firestore. We use AES-256-GCM — the same standard governments use. The master password never leaves your device."

### Slide 10 — Database
> "Data is structured per-user with encrypted vault entries. The cloud never sees plaintext — everything is ciphertext before write."

### Slide 11 — UI
> "The interface is designed for ages 9–15. Cyberpunk aesthetic makes it exciting. Visual feedback replaces jargon. Full English and Arabic support with RTL."

### Slide 12 — Demo (Transition)
> "Let me show you how this actually works."

### Slide 13 — Significance
> "CHEA's value is both practical — real protection tools in one place — and conceptual. It proves professional-grade security can be made accessible to non-technical users."

### Slide 14 — Limitations
> "To be transparent: this targets ages 9–15 only. Desktop-only. There's no master password recovery by design. And evaluation has been informal."

### Slide 15 — Future Work
> "Future plans include mobile apps, browser extensions, LMS integration, and formal long-term retention studies."

### Slide 16 — Demo
> [Transition to live demo]

### Slide 17 — Q&A
> "I'm happy to take questions on any aspect of the project."

---

## Quick Reference Card (Keep for Memory)

| Term | Plain English |
|---|---|
| **AES-256-GCM** | Government-standard encryption — nobody can read your data without the key |
| **Argon2id** | Super-strong password hashing — even expensive hardware takes centuries to crack |
| **Zero-Knowledge** | We and the cloud can never see your password or vault data |
| **Tauri** | Desktop app framework using Rust — smaller, faster, safer than Electron |
| **Zustand** | Lightweight state manager — simpler alternative to Redux |
| **Firestore** | Cloud database — your data syncs across devices |
| **OpenRouter** | Service connecting to Grok-4 AI |
| **VirusTotal** | Service scanning URLs/files against 70+ security engines |
| **XP System** | Every action earns points → levels up → unlocks harder content |
| **Streak** | Consecutive daily logins → bonus XP → habit formation |
| **IV/Nonce** | Random number used per encryption — ensures same plaintext produces different ciphertext |
| **AEAD** | Authenticated Encryption with Associated Data — both encrypted AND verified (can't be tampered with) |

---

## Content Notes

### For Slides 12-16 (Demo + Q&A)
- Keep the app running and ready before the presentation starts
- Practice the demo sequence 3+ times so it's smooth
- Have a backup plan if the internet goes down (show screenshots instead)

### For Arabic Version
- Translate each slide in order
- Keep the same visual layout
- Adjust intro slide with Arabic name and institution
- Arabic RTL means sidebar and icons flip — test the layout

### For Diagrams
- 7 draw.io diagrams available in the `diagrams/` folder:
  - `tech-stack.drawio` → Slide 8
  - `system-architecture.drawio` → Slide 8
  - `security-design.drawio` → Slide 9
  - `feature-overview.drawio` → Slide 6
  - `ai-features.drawio` → Slide 6
  - `educational-games.drawio` → Slides 6–7
  - `gamification-system.drawio` → Slide 7
  - `ui-theme.drawio` → Slide 11

### For Elevator Pitch
- Separate document: `CHEA_Elevator_Pitch_Script.md`
- Max 3 minutes, no face on camera, just your voice + app demo
- 7 scenes following the template: Intro → Problem → Solution → Features → Games → AI → CTA

### For Examiner Knowledge Base
- Separate document: `CHEA_Examiner_Knowledge.md`
- ~1,800 lines of detailed Q&A for any technical question
- Covers all Tauri commands, encryption flow, API integration, and architecture