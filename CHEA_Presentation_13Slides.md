# CHEA — 13 Slide Presentation (Condensed)

---

## Slide 1: Problem Statement

**The Threat Is Real**
- 300% increase in cyberattacks on educational institutions since 2020
- Students are primary targets

**The Skill Gap Is Worse**
- 81% of breaches = weak passwords
- 94% of malware = email/phishing
- Students share GPS, camera data in photos without knowing

**The Tools Are Broken**
- Scattered across multiple apps
- Adult-oriented, technically complex
- Either boring or scary — students zone out

---

## Slide 2: Literature Review

**Student Vulnerability**
- Almomani et al. (2021): Students use weak credentials, can't recognize social engineering
- Purnama et al. (2021): Knowledge alone ≠ behavioral change
- Cowling et al. (2025): Digital safety + digital literacy must be integrated

**Existing Tools Don't Work**
- Bitwarden: Too complex for children, no education
- VirusTotal: Powerful but technical, inaccessible to students
- KnowBe4/HackTheBox: Too advanced (16+), no real protection

---

## Slide 3: Research Gaps + Solution

**5 Critical Gaps**
1. Tool Integration → Security fatigue
2. Age-Appropriateness → Inaccessible to ages 9–15
3. Education-Protection → Never both
4. Engagement → Zero behavioral change
5. Accessibility → Security is a privilege

**Our Solution: CHEA**
- Unifies 5 security tools + 6 AI features
- Visual feedback, non-technical language, cyberpunk aesthetic
- Every tool teaches while it protects (dual-purpose)
- Gamification: XP, levels, streaks, Quiz Arena, Phishing Dojo
- Free — security is a right, not a privilege

---

## Slide 4: Requirements — Survey Findings

**From Literature**
- 81% breaches from weak passwords → least covered in K-12
- 94% malware via email → phishing training minimal
- Gamification improves engagement + retention (Pramod 2025, Khairallah 2024)

**From Survey**
- Students prefer gamified learning with points/rewards
- Strong demand for integrated platform (tools + education)
- Visual feedback + immediate rewards > text-based learning

---

## Slide 5: Functional Requirements (16)

| FR | Feature |
|---|---|
| FR-01 | Password Generation (6–64 chars, entropy display) |
| FR-02 | Password Strength Analysis (crack-time, entropy) |
| FR-03 | Credential Vault (AES-256-GCM client-side encryption) |
| FR-04 | URL Link Scanning (VirusTotal, 70+ engines) |
| FR-05 | File Malware Scanning (SHA-256 hash-first check) |
| FR-06 | Text Encryption (AES-256-GCM, ChaCha20, AES-128-CBC) |
| FR-07 | AI Chatbot — Nova (streaming, plain English) |
| FR-08 | Phishing Dojo (3 tiers, AI-generated emails) |
| FR-09 | Quiz Arena (45 questions, 3 tiers, XP rewards) |
| FR-10 | Image Privacy Scanner (EXIF extraction + stripping) |
| FR-11 | Gamification (XP, 10 levels, streaks, security score) |
| FR-12 | AI Scan Analysis (plain-language threat explanation) |
| FR-13 | AI Attack Narrative ("how a hacker would crack this") |
| FR-14 | AI Phishing Generator (dynamic training emails) |
| FR-15 | AI Scenario Simulator (5-round decisions) |
| FR-16 | AI Security Posture Assessment (15 questions → report card) |

---

## Slide 6: Non-Functional Requirements

**Security** → AES-256-GCM, keys in Rust backend only, master password never transmitted
**Usability** → Ages 9–15, visual indicators, Quick Guides, non-technical language
**Performance** → Crypto <500ms, cold start <5s, VirusTotal polling optimized
**Reliability** → Error messages on API failures, offline capability
**Portability** → Tauri v2 desktop, Windows + macOS, ~10MB bundle
**Accessibility** → Light/dark modes, keyboard nav, WCAG 2.1 AA, EN+AR RTL
**Maintainability** → Modular components, Zustand state, Rust modules
**Privacy** → No data collection, zero-knowledge architecture

---

## Slide 7: System Design — Architecture

**5-Layer Architecture**

- **Presentation**: React 18 + TypeScript, Tailwind, Framer Motion, i18next
- **Business Logic**: Zustand (auth, progress, tasks, activities)
- **Backend**: Rust Tauri (crypto, virustotal, AI agent, image privacy, terminal, diagram)
- **Data**: Firebase Firestore + Auth
- **External**: VirusTotal API v3, OpenRouter (Grok-4)

**Database Schema (Firestore)**
```
users/{userId}/
├── progress/data     → XP, level, streak
├── vaultConfig/main  → encryptedVerifyHash
├── vault/{id}        → encrypted credentials
├── dailyTasks/       → quest progress
├── activities/       → last 15 entries
└── chatSessions/     → AI history
```
- No plaintext sensitive data
- Master password never transmitted

---

## Slide 8: UI Design — Auth & Dashboard

**Authentication**
- Login / Register / Forgot Password
- PublicRoute/ProtectedRoute guards
- Real-time password strength meter
- Terms + Privacy agreement

**Dashboard**
- Profile: avatar, name, level badge (Bronze→Platinum)
- XP progress bar (animated)
- Streak counter (flame icon)
- Security Score (0–100)
- Daily Tasks (7 objectives, max 125 XP/day)
- Activity Feed (last 15 entries)
- Quick Access Grid

**Design System**
- Cyberpunk/Neon theme (dark default)
- Colors: #8ff5ff, #FF0A54, #4D00FF
- Fonts: Orbitron, Outfit, Plus Jakarta Sans

---

## Slide 9: UI Design — Security Tools

| Tool | Key Features |
|---|---|
| **Password Generator** | Length slider 6–64, character toggles, presets, entropy display |
| **Password Checker** | Crack-time estimation, AI Attack Narrative |
| **Link Scanner** | URL input, VirusTotal polling, status badges, AI Scan Analysis |
| **File Scanner** | Drag-drop, SHA-256 hash, detection meter, AI Scan Analysis |
| **Encryption Lab** | Encrypt/Decrypt mode, 3 algorithms, copy-to-clipboard |
| **Credential Vault** | Master password lock, searchable list, 22 service icons, Visa/MC/Amex |
| **Image Privacy** | EXIF viewer (GPS on map), one-click strip, before/after |

---

## Slide 10: UI Design — Games & AI

**Educational Games**
- **Quiz Arena**: 45 questions, 3 tiers (Bronze/Silver/Gold), streak tracking, grade results
- **Phishing Dojo**: 3 tiers (Cadet/Analyst/Operator), Classic + AI Challenge mode, red flag feedback
- **Scenario Simulator**: 5-round decisions, AI consequences, personalized feedback

**AI Features**
- **Nova**: 24/7 chatbot, streaming, Markdown + Mermaid, Arabic RTL, Firestore history
- **AI Scan Analysis**: Plain-language VirusTotal explanation
- **AI Attack Narrative**: "How hacker cracks this password" story (never reveals password)
- **AI Phishing Generator**: Dynamic unique training emails
- **AI Scenario Simulator**: Interactive decision-making with AI feedback
- **AI Security Posture**: 15 questions → report card (grade, strengths, weaknesses, tips)
- **AI Security Buddy**: Daily challenges widget, localStorage cached

---

## Slide 11: Significance & Impact

**Practical Significance**
- One platform for all security tools
- Real protection (VirusTotal + encrypted vault)
- Free — no subscription barriers

**Conceptual Significance**
- Proves professional tools can be accessible to ages 9–15
- Education + protection in every tool (dual-purpose)
- Security doesn't have to be boring or scary

**Impact on Education**
- Supplementary tool for K-12 curriculum
- Measurable engagement (XP, levels, streaks)
- Phishing Dojo: hands-on training impossible through textbooks
- AI personalization at scale

---

## Slide 12: Limitations

**Scope**
- Ages 9–15 only — not adults/professionals
- Desktop-only — no mobile/web yet

**Technical**
- VirusTotal API quotas limit scaling
- AI depends on OpenRouter availability
- No master password recovery (by design — zero-knowledge)

**Functional**
- EXIF stripping: JPEG/PNG only
- URL checker: known threats only, not zero-day

**Resource**
- No automated testing
- Evaluation: informal feedback only (no formal study)

---

## Slide 13: Future Work

**Features**
- Mobile app (iOS/Android)
- Browser extension for real-time URL protection
- Social media safety, network security modules

**Technical**
- User-scoped Firestore security rules
- Blockchain-based vault recovery
- API caching for offline + rate limits
- Automated testing framework

**Research**
- Long-term retention studies (6–12 months)
- CHEA vs. classroom comparison

**Deployment**
- Open-source for community contributions
- LMS integration for classroom adoption
- Extended localization (beyond EN/AR)

---

## Speaker Notes (Just the Key Points)

| Slide | One-Liner to Remember |
|---|---|
| 1 | "Students are targeted but tools are too complex — that's the gap" |
| 2 | "Research shows knowledge alone doesn't change behavior — you need integration" |
| 3 | "CHEA addresses all 5 gaps — tool integration, age-appropriateness, education-protection, engagement, accessibility" |
| 4 | "Students want gamified learning with rewards and an integrated platform" |
| 5 | "16 functional requirements: 7 security tools + 3 games + 6 AI features" |
| 6 | "Security-first design: AES-256-GCM, zero-knowledge, master password never transmitted" |
| 7 | "Five-layer architecture: React frontend → Zustand state → Rust backend → Firestore → External APIs" |
| 8 | "Dashboard shows engagement loop: XP, streak, daily tasks, activity feed" |
| 9 | "Every security tool has a teaching element — dual-purpose design" |
| 10 | "Games make it fun, AI makes it personal — together they build habits" |
| 11 | "Real tools + real education + free = practical and conceptual significance" |
| 12 | "Transparent about limits: ages 9–15, desktop-only, no password recovery" |
| 13 | "Future: mobile, browser extension, LMS integration, long-term studies" |