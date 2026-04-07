# CHEA - Cybersecurity Home Defense Application

## Project Overview

CHEA (Cybersecurity Home Defense Application) is a desktop cybersecurity application built with **Tauri** (React + TypeScript + Rust). It provides a comprehensive suite of security tools for everyday users to protect themselves online.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State Management | Zustand |
| Backend | Tauri (Rust) |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Theme | Cyberpunk/neon aesthetic with light/dark mode support |

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | User authentication with email/password |
| `/register` | Register | New user registration |
| `/forgot-password` | ForgotPassword | Password reset flow |
| `/terms` | TermsOfService | Legal terms |
| `/privacy` | PrivacyPolicy | Privacy policy |
| `/dashboard` | Dashboard | Main dashboard with overview |
| `/dashboard/link-scanner` | LinkScanner | URL safety checker using VirusTotal |
| `/dashboard/file-scanner` | FileScanner | File malware scanner using VirusTotal |
| `/dashboard/metadata` | ImagePrivacy | Image metadata scanner & stripper |
| `/dashboard/password-gen` | PasswordGenerator | Strong password generator |
| `/dashboard/password-check` | PasswordChecker | Password strength analyzer |
| `/dashboard/encryption` | Encryption | Text encryption/decryption tool |
| `/dashboard/vault` | CredentialVault | Encrypted password/card storage |
| `/dashboard/ai-agent` | AIAgent | AI cybersecurity assistant |
| `/dashboard/calculator` | Calculator | Security-focused calculator |
| `/dashboard/quiz-arena` | QuizArena | Cybersecurity trivia game |
| `/dashboard/phishing-dojo` | PhishingDojo | Phishing email detection training |
| `/dashboard/settings` | Settings | User settings & master password |

---

## Features & Tools

### 1. Link Scanner
- **Purpose**: Check if URLs are safe to click
- **Backend**: VirusTotal API v3
- **XP Reward**: +10 XP per scan
- **Features**:
  - Real-time scanning via VirusTotal
  - Shows malicious/suspicious/clean status
  - Displays detection stats from 70+ security vendors
  - Community reputation score
  - Scan history (last 10 scans)
  - Detailed engine results table

### 2. File Scanner
- **Purpose**: Scan files for malware
- **Backend**: VirusTotal API v3
- **XP Reward**: +15 XP per scan
- **Features**:
  - File selection via native file dialog (Tauri)
  - SHA-256 hash calculation
  - Supports files up to 650MB
  - Shows file size and metadata
  - Detailed detection results
  - Quarantine/Delete actions for malicious files

### 3. Image Privacy (Metadata Scanner)
- **Purpose**: Find and remove hidden metadata from images
- **Backend**: Rust (`image_privacy.rs`)
- **Features**:
  - Scan image EXIF metadata
  - Strip all metadata
  - Supports common image formats

### 4. Password Generator
- **Purpose**: Generate cryptographically strong passwords
- **XP Reward**: +10 XP per use
- **Features**:
  - Configurable length (6-64 characters)
  - Character sets: uppercase, lowercase, numbers, symbols
  - Exclude confusing characters option
  - Entropy calculation
  - Strength indicators (Too Weak → Super Strong)
  - Presets: Easy (8), Good (12), Strong (16), Super (24)

### 5. Password Checker
- **Purpose**: Analyze password strength
- **XP Reward**: +3 XP per check
- **Features**:
  - Entropy-based strength calculation
  - Time-to-crack estimation
  - Pattern detection (sequences, repeats, dates)
  - Common password detection
  - Improvement suggestions

### 6. Encryption Tool
- **Purpose**: Encrypt/decrypt text messages
- **Backend**: Rust crypto module (`crypto.rs`)
- **XP Reward**: +10 XP per use
- **Algorithms Supported**:
  - **AES-256-GCM** (default) - Authenticated encryption
  - **ChaCha20-Poly1305** - Modern stream cipher
  - **AES-128-CBC** - Legacy support
- **Features**:
  - Password-based key derivation (Argon2id)
  - Base64 encoded output
  - Copy to clipboard
  - Educational tips about encryption

### 7. Credential Vault
- **Purpose**: Securely store passwords and credit cards
- **Security**: Master password + AES-256-GCM encryption
- **XP Reward**: +10 XP per save
- **Features**:
  - Master password protection
  - Store login credentials (website, username, password)
  - Store credit cards with brand detection (Visa, Mastercard, Amex, Discover)
  - Quick copy username/password
  - Reveal/hide passwords
  - Search functionality
  - Delete credentials
  - Visual card display with gradients

### 8. AI Agent
- **Purpose**: AI-powered cybersecurity assistant
- **Backend**: Rust AI module with streaming support
- **XP Reward**: +5 XP per message
- **Features**:
  - Chat interface with streaming responses
  - Markdown rendering
  - Syntax highlighting for code
  - Mermaid diagram support
  - Multiple chat sessions
  - Session history
  - Copy messages/tables
  - RTL support for Arabic

### 9. Quiz Arena
- **Purpose**: Test cybersecurity knowledge
- **XP Reward**: +15 XP per round
- **Features**:
  - Trivia questions about security
  - Multiple choice format
  - Score tracking
  - Streak bonuses

### 10. Phishing Dojo
- **Purpose**: Learn to spot phishing emails
- **XP Reward**: +15 XP per round
- **Features**:
  - Email analysis exercises
  - Red flag identification
  - Practice mode
  - Score tracking

### 11. Calculator
- **Purpose**: Security-related calculations
- **Features**:
  - Password entropy calculator
  - Hash generator
  - Encryption helpers

---

## Design System

### Color Palette

#### Neon Colors
| Name | Hex | Usage |
|------|-----|-------|
| neon-crimson | #FF0A54 | Primary accent, dark mode highlights |
| neon-cyan | #00E5FF | Secondary accent |
| neon-violet | #4D00FF | Primary accent, light mode highlights |
| neon-blue | #8AB4F8 | Text accents |

#### Cyber Colors (Dark Theme)
| Name | Hex | Usage |
|------|-----|-------|
| cyber-void | #05050A | Deepest background |
| cyber-dark | #0A1128 | Main background |
| cyber-surface | #121A33 | Card/panel background |

#### Semantic Colors
| Name | Usage |
|------|-------|
| primary | Main actions, links |
| secondary | Secondary actions |
| accent | Highlights |
| destructive | Errors, warnings |
| success | Safe, verified |
| muted | Secondary text |

### Typography

| Font | Usage | Import |
|------|-------|--------|
| **Outfit** | Headlines, display text | Google Fonts |
| **Orbitron** | Tech/cyber headers, badges | Google Fonts |
| **DM Sans** | Body text, UI elements | Google Fonts |
| **IBM Plex Sans Arabic** | Arabic language support | Google Fonts |

### Tailwind Configuration

```javascript
// Font families
fontFamily: {
  display: ['Outfit', 'system-ui', 'sans-serif'],
  cyber: ['Orbitron', 'system-ui', 'sans-serif'],
  body: ['DM Sans', 'system-ui', 'sans-serif'],
}

// Custom colors
colors: {
  neon: {
    crimson: '#FF0A54',
    cyan: '#00E5FF',
    violet: '#4D00FF',
    blue: '#8AB4F8',
  },
  cyber: {
    void: '#05050A',
    dark: '#0A1128',
    surface: '#121A33',
  },
}
```

### Animations

| Animation | Description |
|-----------|-------------|
| `fade-in` | Opacity + translateY entrance |
| `slide-up` | Delayed slide-up entrance |
| `shimmer` | Gradient sweep effect |
| `float` | Gentle up-down float |
| `pulse` | Standard pulse |
| `neon-pulse` | Red glow pulse (dark mode) |
| `neon-pulse-light` | Violet glow pulse (light mode) |
| `cyber-scan` | Full-viewport scanline sweep |
| `border-glow` | Animated border glow |
| `glow-rotate` | Rotating gradient background |

### UI Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary/secondary variants, gradient backgrounds |
| `Input` | Text input with label support |
| `PasswordInput` | Password field with reveal toggle |
| `Checkbox` | Custom styled checkbox |
| `Card` | Content container with borders |
| `ThemeToggle` | Light/dark mode switch |
| `PasswordStrength` | Visual strength indicator |
| `TitleBar` | Custom window title bar (Tauri) |

---

## Backend (Rust/Tauri)

### Commands

| Command | Module | Description |
|---------|--------|-------------|
| `encrypt_text` | crypto.rs | Encrypt plaintext with password |
| `decrypt_text` | crypto.rs | Decrypt ciphertext with password |
| `scan_image_metadata` | image_privacy.rs | Extract EXIF data from image |
| `strip_image_metadata` | image_privacy.rs | Remove all metadata from image |
| `scan_url` | virustotal.rs | Submit URL to VirusTotal |
| `scan_file` | virustotal.rs | Submit file to VirusTotal |
| `chat_with_ai` | ai_agent.rs | AI chat with streaming |
| `save_diagram` | diagram.rs | Save Mermaid diagram |
| `write_to_pty` | terminal.rs | Write to PTY |
| `resize_pty` | terminal.rs | Resize PTY |

### Encryption Module (`crypto.rs`)

**Key Derivation**: Argon2id
**Supported Algorithms**:
- AES-256-GCM
- ChaCha20-Poly1305
- AES-128-CBC

### VirusTotal Integration

- API Key: Configured in source
- Endpoints:
  - URL scanning: `/api/v3/urls`
  - File scanning: `/api/v3/files`
  - Analysis results: `/api/v3/analyses/{id}`
  - Upload URL: `/api/v3/files/upload_url`

---

## State Management (Zustand)

### Stores

| Store | Purpose |
|-------|---------|
| `useAuthStore` | User authentication state, master password |
| `useUserProgressStore` | XP, level, streak tracking |
| `useDailyTasksStore` | Daily quest tasks |
| `useActivityStore` | Activity log history |

### Activity Types

```typescript
type ActivityType = 
  | 'scan_link'
  | 'scan_file'
  | 'scan_image'
  | 'generate_password'
  | 'check_password'
  | 'generate_encryption'
  | 'create_credential'
  | 'chat_ai'
  | 'quiz_round'
  | 'phishing_round'
  | 'quiz_streak'
  | 'phishing_streak';
```

---

## Firebase Firestore Schema

### Collections

```
users/{userId}/
├── credentials/
│   └── {credentialId}: CredentialItem
├── chat_sessions/
│   └── {sessionId}: ChatSession
├── chat_messages/
│   └── {messageId}: ChatMessage
├── progress/
│   └── {userId}: UserProgress
├── daily_tasks/
│   └── {userId}: DailyTasks
└── activities/
    └── {activityId}: Activity
```

---

## XP & Leveling System

### Level Tiers
| Level Range | Tier | Color |
|-------------|------|-------|
| 1-3 | Bronze | Amber/Orange |
| 4-6 | Silver | Blue/Gray |
| 7+ | Gold | Purple/Multi |

### XP Sources
| Action | XP |
|--------|-----|
| Link scan | +10 |
| File scan | +15 |
| Password generate | +10 |
| Password check | +3 |
| Encryption use | +10 |
| Credential save | +10 |
| AI message | +5 |
| Quiz round | +15 |
| Phishing round | +15 |

### Security Score Calculation
Base: 10 XP
- XP score: up to 25
- Streak days: up to 20
- Vault items: up to 15
- Activities: up to 15
- Tasks completed: up to 15
**Max**: 100

---

## Custom Styling Classes

### Auth Layout
- `cyber-scanline` - Animated scanline effect
- `auth-form-panel` - Form area with grid pattern
- `auth-image-panel` - Image background area
- `auth-edge-glow` - Neon edge glow divider
- `auth-electric-pulse` - Horizontal pulse animation
- `auth-circuit-grid` - Circuit pattern overlay
- `cyber-input-glow` - Focus glow effect
- `cyber-btn-glow` - Button gradient animation
- `cyber-hud-corner` - HUD corner decorations

### Sidebar
- `sidebar-cyber` - Grid pattern background
- `sidebar-nav-item` - Nav item hover effect
- `sidebar-nav-active` - Active nav indicator
- `sidebar-logo-glow` - Logo glow effect

### App Shell
- `app-shell` - Main layout container
- `titlebar` - Custom title bar
- `titlebar-btn` - Window control buttons

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Custom title bar | Window drag |
| Title bar buttons | Minimize, Maximize, Close |

---

## Security Notes

1. **Master Password**: Used to encrypt vault data, stored in memory only
2. **Encryption**: All sensitive data encrypted with AES-256-GCM
3. **Key Derivation**: Argon2id prevents brute-force attacks
4. **Local Processing**: Encryption/decryption happens locally via Rust
5. **No Password Reuse**: Vault encourages unique passwords per service

---

## Dependencies

### Production
- `firebase` - Authentication & Firestore
- `@firebase/firestore` - Database SDK
- `react-router-dom` - Routing
- `zustand` - State management
- `framer-motion` - Animations
- `lucide-react` - Icons
- `react-markdown` - Markdown rendering
- `mermaid` - Diagram rendering
- `@xterm/xterm` - Terminal emulator
- `clsx`, `tailwind-merge` - Class utilities
- `@tauri-apps/api` - Tauri IPC

### Development
- `typescript` - Type safety
- `vite` - Build tool
- `tailwindcss` - Styling
- `eslint` - Linting
- `@tauri-apps/cli` - Tauri CLI

---

## Build & Run Commands

```bash
# Development
cd project/
bun run tauri dev        # Full dev server (frontend + backend)
bun run dev              # Vite dev server only

# Build
bun run build            # Production build (TypeScript + Vite)

# Lint
bun run lint             # Run ESLint

# Preview
bun run preview          # Preview production build
```

---

## Version

**Current Version**: 0.1.0

---

## Credits

- **Icons**: Lucide React
- **Fonts**: Google Fonts (Outfit, Orbitron, DM Sans, IBM Plex Sans Arabic)
- **Security API**: VirusTotal
- **AI**: Powered by AI models
