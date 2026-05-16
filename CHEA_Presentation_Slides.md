# CHEA — Senior Project Presentation Slides

**Duration:** ~20 minutes (15 slides + 5 min live demo)
**Audience:** Supervisor + 2 University Examiners + 2 External Examiners

---

## SLIDE 1 — Title Slide

**CHEA**
**Cyber Hygiene Educator & Assistant**

A Gamified Cybersecurity Desktop Application for Students

**Candidate:** [Your Name]
**Supervisor:** [Supervisor Name]
**Date:** May 2026

---

## SLIDE 2 — The Problem

### The Threat Is Real

- **300% increase** in cyberattacks targeting educational institutions since 2020
- Students are primary targets — they have data, rarely update security, and click anything

### The Skill Gap Is Worse

- **Weak passwords**: "password123" gets cracked in under 1 second
- **No phishing awareness**: 94% of malware enters via email — yet K-12 covers this least
- **No metadata awareness**: Every photo your students take leaks GPS, camera info, timestamps

### The Tools Are Broken

- Existing solutions are scattered across multiple apps
- Assumes adult technical knowledge
- Either boring educational videos OR scary black-box tools
- Students zone out — retention is near zero

> **Key Stat:** 81% of data breaches start with weak or stolen passwords (Verizon DBIR)

---

## SLIDE 3 — The Literature Review

### What Research Says About Students

| Study | Finding |
|---|---|
| Almomani et al. (2021) | Students use weak, guessable credentials and can't recognize social engineering |
| Purnama et al. (2021) | Digital literacy predicts online risk — but knowledge alone doesn't change behavior |
| Cowling et al. (2025) | Digital safety cannot be separated from digital literacy — needs integrated approaches |
| Pramod (2025), Khairallah (2024) | Gamification significantly improves engagement AND knowledge retention |

### What Students Said (Survey Results)

- **81%** would engage more with security training if it had points and rewards
- **Strong preference** for gamified learning over lectures
- **Zero** existing tools combine education AND real protection in one place

---

## SLIDE 4 — Gaps Identified

### Five Critical Gaps in Current Solutions

```
┌─────────────────────────────────────────────────────┐
│ 1. TOOL INTEGRATION GAP                             │
│ Security tools exist as separate apps              │
│ → Causes "security fatigue"                         │
├─────────────────────────────────────────────────────┤
│ 2. AGE-APPROPRIATENESS GAP                         │
│ Interfaces assume adult vocabulary                 │
│ → Results inaccessible to students ages 9–15       │
├─────────────────────────────────────────────────────┤
│ 3. EDUCATION-PROTECTION GAP                         │
│ Solutions split into education OR tools            │
│ → Never both                                       │
├─────────────────────────────────────────────────────┤
│ 4. ENGAGEMENT GAP                                  │
│ Lecture-based training fails to retain attention   │
│ → Zero behavioral change                           │
├─────────────────────────────────────────────────────┤
│ 5. ACCESSIBILITY GAP                                │
│ Subscriptions exclude lower-income students         │
│ → Security becomes a privilege, not a right        │
└─────────────────────────────────────────────────────┘
```

> **Gap addressed by CHEA:** All five

---

## SLIDE 5 — Our Solution: CHEA

### What Is CHEA?

CHEA is a unified cybersecurity platform that combines **real protection tools** with **interactive education** — wrapped in a gamified system that keeps students coming back.

### Why It Works for Ages 9–15

- **Visual feedback**: Red/green indicators instead of technical jargon
- **Cyberpunk aesthetic**: Makes security feel exciting, not scary
- **Dual-purpose tools**: Every tool teaches while it protects
- **Free**: No subscription barriers — security is a right, not a privilege

### The Core Philosophy

> "We don't teach cybersecurity. We make students want to practice it."

---

## SLIDE 6 — Features at a Glance

### Security Tools (Practical Protection)

| Tool | What It Does |
|---|---|
| Link Scanner | Scan any URL against 70+ security engines (VirusTotal) |
| File Scanner | Scan files up to 200MB for malware |
| Image Privacy | See + strip hidden GPS/camera data from photos |
| Password Generator | Create strong passwords with entropy display |
| Password Checker | See crack time + AI-generated attack story |
| Encrypted Vault | Store passwords + credit cards (AES-256-GCM) |
| Text Encryption | Encrypt any message with any password |

### Educational Games (Learning by Doing)

| Game | How It Works |
|---|---|
| Quiz Arena | 5-question quizzes, 3 difficulty tiers (Bronze→Gold) |
| Phishing Dojo | Spot fake phishing emails — AI generates new ones every round |
| Scenario Simulator | 5-round security decisions with AI consequences |

### AI Features

- **Nova**: 24/7 cybersecurity chatbot (plain English, diagrams)
- **Security Posture Assessment**: AI gives you a personal security report card
- **Attack Narrative**: AI describes how a hacker would crack your password
- **Security Buddy**: Daily personalized challenges

---

## SLIDE 7 — Why Gamification Works Here

### The Problem with Traditional Training

```
Traditional: Learn → Maybe Remember → Rarely Apply
         ↓         ↓               ↓
        Boring   Low Retention    No Habit

CHEA: Use Tool → Earn XP → Level Up → Come Back
    ↓         ↓         ↓         ↓
  Real Skill Immediate Reward Visible Progress Daily Habit
```

### CHEA's Engagement Loop

1. **Use a tool or play a game** → Earn XP
2. **XP builds up** → Level up (Rookie → Scout → Shield → Guardian → Cyber Ninja...)
3. **Level unlocks** → Harder quiz content
4. **Daily login** → Streak counter grows
5. **Complete daily quests** → More XP
6. **Security Score rises** → Visible proof of progress

> **Result:** Security becomes a daily habit, not a one-time lesson

---

## SLIDE 8 — System Architecture

### Five-Layer Design

```
┌─────────────────────────────────────────────────────┐
│        PRESENTATION LAYER                          │
│ React 18 + TypeScript + Tailwind CSS              │
│ Framer Motion (animations) + i18next (EN/AR RTL)  │
├─────────────────────────────────────────────────────┤
│        BUSINESS LOGIC LAYER                        │
│ Zustand (auth, progress, daily tasks, activities)  │
│ Custom hooks for tracking + real-time updates      │
├─────────────────────────────────────────────────────┤
│        BACKEND PROCESSING LAYER (Rust)             │
│ encrypt_text / decrypt_text (AES-256-GCM)          │
│ scan_url / scan_file (VirusTotal API)              │
│ scan_image_metadata / strip_image_metadata         │
│ chat_with_ai (OpenRouter / Grok-4)                 │
│ write_to_pty (PowerShell terminal)                 │
├─────────────────────────────────────────────────────┤
│        DATA LAYER                                  │
│ Firebase Firestore (user-scoped NoSQL)             │
│ Firebase Auth (email/password authentication)      │
├─────────────────────────────────────────────────────┤
│        EXTERNAL SERVICES                            │
│ VirusTotal API v3 + OpenRouter API (AI)            │
└─────────────────────────────────────────────────────┘
```

### Why Tauri? (vs Electron or Web)

| Factor | Tauri | Electron |
|---|---|---|
| Bundle Size | ~10 MB | ~150 MB |
| Memory Usage | Low | High |
| Backend | Rust (memory-safe) | Node.js |
| Security Surface | Minimal | Large (Node) |
| Native WebView | ✅ | ❌ (bundles Chromium) |

---

## SLIDE 9 — Security Design

### How Client-Side Encryption Works

```
1. USER CREATES MASTER PASSWORD
   ↓
2. CLIENT (Rust): Encrypt known string → AES-256-GCM → key from Argon2id
   ↓
3. ENCRYPTED VERIFICATION HASH → Stored in Firestore
   ↓
4. MASTER PASSWORD NEVER leaves the device
   ↓
5. CLOUD NEVER sees or stores the actual password
```

### Why This Is Secure

- **AES-256-GCM**: Same standard used by governments and militaries (AEAD)
- **Argon2id**: Memory-hard — resistant to GPU/ASIC cracking attacks (64MB memory, 3 iterations)
- **Zero-Knowledge**: Even if Firestore is breached, attackers get useless encrypted data
- **No Password Recovery**: By design — because there's nothing to recover

### Data Protection

- All vault data encrypted **before** it touches Firestore
- User-scoped Firestore hierarchy: `users/{userId}/vault`, `users/{userId}/progress`
- API keys stored in Rust backend only — never in frontend code

---

## SLIDE 10 — Database Design

### Firestore Structure

```
users/{userId}/
├── progress/data         → XP, level, streak, totalScore
├── vaultConfig/main      → encryptedVerifyHash (master password verification)
├── vault/{credentialId}  → encrypted credentials (logins + cards)
├── dailyTasks/           → daily quest progress
├── activities/           → recent activity log (last 15)
└── chatSessions/         → AI chat history
```

### Key Design Decisions

- **User-scoped**: All data accessible only by the authenticated owner
- **Encrypted before write**: Vault entries are ciphertext in Firestore
- **No plaintext PII**: Names, emails handled by Firebase Auth only
- **Offline-first**: Core features work without internet (vault, tools already opened)

---

## SLIDE 11 — User Interface Design

### Authentication Flow

- Login / Register / Forgot Password
- Real-time password strength meter (min 12 characters)
- PublicRoute/ProtectedRoute guards
- Terms agreement + privacy policy checkboxes

### Dashboard Features

- **Profile**: Avatar, display name, level badge (Bronze → Platinum)
- **XP Bar**: Animated progress bar with numerical values
- **Streak Counter**: Flame icon with consecutive days
- **Security Score**: 0–100 composite (XP + Streak + Vault + Activity)
- **Daily Tasks**: 7 objectives with progress indicators (max 125 XP/day)
- **Activity Feed**: Last 15 entries with type-specific icons

### Design System

| Element | Implementation |
|---|---|
| Theme | Cyberpunk/Neon (dark mode default + light mode) |
| Colors | Primary #8ff5ff, Crimson #FF0A54, Violet #4D00FF |
| Animations | fade-in, slide-up, shimmer, neon-pulse, cyber-scan |
| Typography | Orbitron (headlines), Outfit (UI), Plus Jakarta Sans (body) |
| Accessibility | Light/dark modes, keyboard navigation, ARIA labels, EN+AR RTL |

---

## SLIDE 12 — Feature Showcase

### Security Tools (Screen Demo)

| Feature | What to Show |
|---|---|
| Link Scanner | Paste URL → 4-second VirusTotal poll → green/red status |
| File Scanner | Drag-drop file → SHA256 hash → detection stats |
| Image Privacy | Open photo → show GPS on Google Maps → strip metadata |
| Password Checker | Type weak password → show 0.3s crack time → AI attack story |
| Encrypted Vault | Create entry → show encrypted storage → decrypt |

### Educational Games (Screen Demo)

| Game | What to Show |
|---|---|
| Quiz Arena | 3 questions with streak tracking + explanations |
| Phishing Dojo | Classic mode → email with red flags → feedback |
| Scenario Simulator | AI scenario → user choices → consequences |

### AI Features (Screen Demo)

| Feature | What to Show |
|---|---|
| Nova Chatbot | Ask "how do I stay safe online?" → plain English answer |
| Security Posture | Complete survey → AI generates report card |
| Security Buddy | Daily challenges widget with 3 tasks |

---

## SLIDE 13 — Evaluation & Impact

### Practical Significance

- Consolidates 5 security tools + 6 AI features in one platform
- Provides **real protective utility**, not just simulations
- Free and accessible — no subscription barriers

### Conceptual Significance

- Challenges the assumption that security must be boring
- Demonstrates professional-grade encryption (AES-256-GCM) made accessible to non-technical users
- Proves education and protection can coexist in one tool

### Impact on Education

- Supplementary tool for K-12 cybersecurity curriculum
- Measurable engagement via XP and progression metrics
- Phishing Dojo provides training impossible to achieve through textbooks

---

## SLIDE 14 — Limitations

### Scope Limitations

- **Target age**: Ages 9–15 only — not designed for adults or professionals
- **Platform**: Desktop-only — no mobile or web versions yet

### Technical Limitations

- **VirusTotal API quotas**: Limits scalability for large deployments
- **AI dependency**: OpenRouter availability affects Nova chatbot
- **No master password recovery**: By design (zero-knowledge) — users must remember their password

### Functional Limitations

- **Metadata stripping**: JPEG and PNG only — not TIFF or other formats
- **URL checker**: Detects known threats — not zero-day exploits

### Resource Limitations

- **No automated testing**: Increases regression risk
- **Evaluation**: Based on informal user feedback — no formal study yet

---

## SLIDE 15 — Future Work

### Feature Expansion

- **Mobile app** (iOS/Android) via React Native or Flutter
- **Browser extension** for real-time URL protection
- **Additional modules**: Social media safety, network security basics, malware exercises

### Technical Improvements

- User-scoped Firestore security rules (time-based access currently)
- Blockchain-based password recovery for vault
- API caching for offline functionality
- Automated testing framework (unit + integration)

### Research Opportunities

- **Long-term studies**: Measuring retention of cybersecurity habits
- **Comparative analysis**: CHEA vs. traditional classroom education
- **Community deployment**: Open-source for wider adoption + LMS integration

### Localization

- Extend beyond English/Arabic to reach global student populations

---

## SLIDE 16 — Live Demonstration

### (5 minutes — show the app live)

| Step | Feature | Time |
|---|---|---|
| 1 | Open app → Dashboard with XP, streak, security score | 30s |
| 2 | Link Scanner → scan a URL → show results | 45s |
| 3 | Password Checker → show crack time + AI attack narrative | 45s |
| 4 | Quiz Arena → quick 3-question round | 45s |
| 5 | Encrypted Vault → create a credential entry | 45s |
| 6 | AI Chatbot (Nova) → ask a cybersecurity question | 45s |
| 7 | Close with dashboard → show the gamification loop | 30s |

---

## SLIDE 17 — Q&A

### Questions to Prepare For

**"Why Tauri and not Electron?"**
> Tauri is ~10MB vs Electron's ~150MB. Rust backend for security-critical crypto ops. Native WebView instead of bundled Chromium. Lower memory, better performance, smaller attack surface.

**"How is the master password actually secure?"**
> Zero-knowledge. The password never leaves the device. Only an encrypted verification hash is stored in Firestore. Even if the database is breached, attackers get ciphertext without the key.

**"Why ages 9–15?"**
> Research shows this is the critical window for habit formation. Too young for complex adult tools; too old for pure games. This age group is actively building digital habits that last a lifetime.

**"What makes this different from just putting existing tools in one app?"**
> The gamification layer. The AI-generated content (unique phishing emails every round). The dual-purpose tools (every tool teaches while it protects). The engagement loop (XP/levels/streaks).

---

## SLIDE 18 — Thank You

**CHEA — Cyber Hygiene Educator & Assistant**

Security made simple. Security made fun.

**Questions?**

[Your Name]
[Your Email]
[GitHub Link]

---

## Quick Reference Card (For Your Memory)

| Term | Plain English |
|---|---|
| AES-256-GCM | Government-standard encryption — nobody can read your data without the key |
| Argon2id | Super-strong password hashing — even expensive hardware takes centuries to crack |
| Zero-Knowledge | We (and the cloud) can never see your password or vault data |
| Tauri | Desktop app framework using Rust — smaller, faster, safer than Electron |
| Zustand | Lightweight state manager — like Redux but much simpler |
| Firestore | Cloud database — your data syncs across devices |
| OpenRouter | Service that connects to Grok-4 AI |
| VirusTotal | Service that scans URLs/files against 70+ security engines |
| XP System | Every action earns points → levels up → unlocks harder content |
| Streak | Consecutive daily logins → bonus XP → habit formation |

---

## What to Say for Each Slide (Speaker Notes)

### Slide 1 — Title
> "Good morning/afternoon everyone. Today I'll be presenting CHEA — a senior project that tackles a growing problem: students are increasingly targeted by cyberattacks, but existing tools are either too complex or too boring to actually change their behavior."

### Slide 2 — Problem
> "The numbers speak for themselves. 300% more attacks on educational institutions since 2020. 81% of breaches from weak passwords. 94% of malware through email. And yet — K-12 education covers these topics the least."

### Slide 3 — Literature Review
> "Research confirms this gap. Students use weak passwords and can't recognize phishing. Knowledge alone doesn't change behavior — you need integrated approaches. And gamification has been proven to significantly improve both engagement and retention."

### Slide 4 — Gaps
> "We identified five critical gaps in existing solutions. Tool fragmentation. Age-inappropriate design. Education vs. protection split. Engagement failure. And accessibility barriers."

### Slide 5 — Our Solution
> "CHEA addresses all five gaps. It's a unified platform combining real protection tools with interactive education — wrapped in a gamification system that makes students want to come back."

### Slide 6 — Features
> "Let me quickly show what CHEA actually does. Seven security tools — from link scanning to encrypted vaults. Three educational games — including AI-generated phishing scenarios. And six AI features — including a 24/7 chatbot."

### Slide 7 — Gamification
> "The key insight is that security isn't a one-time lesson — it's a habit. CHEA makes you WANT to practice. Earn XP. Keep a streak. Unlock harder content. Real tools. Real skills. No boring PDFs."

### Slide 8 — Architecture
> "Under the hood, CHEA uses Tauri — a Rust-based desktop framework. Five layers: React frontend, Zustand state, Rust backend for crypto and API calls, Firebase for data, and external services for scanning and AI."

### Slide 9 — Security
> "Security was a first principle. All vault data is encrypted client-side before it touches Firestore. We use AES-256-GCM — the same standard governments use. The master password never leaves your device — it's zero-knowledge."

### Slide 10 — Database
> "Data is structured per-user with encrypted vault entries. The cloud never sees plaintext — everything is ciphertext before write."

### Slide 11 — UI
> "The interface is designed for ages 9-15. Cyberpunk aesthetic makes it exciting. Visual feedback replaces jargon. Full English and Arabic support with RTL."

### Slide 12 — Demo (Transition)
> "Let me show you how this actually works."

### Slide 13 — Evaluation
> "CHEA's value is both practical — real protection tools in one place — and conceptual. It proves that professional-grade security can be made accessible to non-technical users."

### Slide 14 — Limitations
> "To be transparent about our scope: this targets ages 9-15 only. It's desktop-only. There's no master password recovery — by design. And evaluation has been informal."

### Slide 15 — Future Work
> "Future plans include mobile apps, browser extensions, LMS integration, and long-term retention studies."

### Slide 16 — Demo
> [Transition to live demo]

### Slide 17 — Q&A
> "I'm happy to take questions on any aspect of the project."