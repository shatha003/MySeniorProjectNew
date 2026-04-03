# HyperTool - Senior Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Core Features](#4-core-features)
5. [Database Schema](#5-database-schema)
6. [Backend Implementation](#6-backend-implementation)
7. [Frontend Implementation](#7-frontend-implementation)
8. [Security Implementation](#8-security-implementation)
9. [API Integrations](#9-api-integrations)
10. [Gamification System](#10-gamification-system)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment](#12-deployment)

---

## 1. Project Overview

### 1.1 Executive Summary

**HyperTool** is a comprehensive cybersecurity desktop application built with **Tauri** framework, combining the power of **React + TypeScript** for the frontend and **Rust** for the backend. The application provides a unified platform for individuals and small businesses to manage their digital security needs through an intuitive, user-friendly interface.

### 1.2 Problem Statement

The application addresses critical cybersecurity challenges:

| Problem Area | Description | Impact Level |
|-------------|-------------|--------------|
| **Fragmented Security Tools** | Users manage credentials, file scanning, and threat detection through disparate applications | High |
| **Image Privacy Risks** | Embedded metadata in shared images exposes location and device information | Medium |
| **Password Fatigue** | Users reuse weak passwords across multiple accounts | Critical |
| **Knowledge Gap** | Users lack accessible, personalized guidance for cybersecurity best practices | High |
| **Enterprise Complexity** | Existing solutions require significant technical expertise | High |

### 1.3 Core Value Proposition

HyperTool provides a single, unified platform that combines:

- **Proactive Security**: Scan links and files before interaction
- **Privacy Protection**: Remove sensitive metadata from images
- **Credential Management**: Secure password generation and storage
- **AI-Powered Guidance**: Personalized security recommendations
- **Engaging Experience**: Gamified progress system for sustained security practices

### 1.4 Target User Personas

1. **Individual Consumer** (Ages 25-55): Moderate tech literacy, concerned about privacy
2. **Small Business Owner** (Ages 30-60): Limited budget for enterprise security solutions
3. **Student/Academic** (Ages 18-35): Frequently shares files and images online
4. **Remote Worker** (Ages 25-50): Managing multiple credentials, verifying resource safety

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HyperTool Desktop Application                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Tauri Frontend (WebView)                     │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │    │
│  │  │ Dashboard │ │  Link     │ │   File    │ │  Image    │            │    │
│  │  │  Module   │ │  Scanner  │ │  Scanner  │ │  Privacy  │            │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘            │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │    │
│  │  │ Password  │ │Credential │ │   AI      │ │ Gamification│           │    │
│  │  │Generator  │ │  Vault    │ │   Agent   │ │   System   │           │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                          ┌────────▼────────┐                                │
│                          │   Tauri Core    │                                │
│                          │  (IPC Bridge)   │                                │
│                          └────────┬────────┘                                │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                      Rust Backend (Secure Core)                      │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │   │
│  │  │ Crypto Engine│ │ Image Privacy │ │  AI Agent   │                 │   │
│  │  │   (AES-256)  │ │   Processor   │ │   Service   │                 │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │   │
│  │  ┌──────────────┐ ┌──────────────┐                                  │   │
│  │  │ VirusTotal   │ │ Diagram Gen  │                                  │   │
│  │  │   Client    │ │   Service    │                                  │   │
│  │  └──────────────┘ └──────────────┘                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                     ┌─────────────────────┼─────────────────────┐
                     │                     │                     │
             ┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
             │   Firebase    │   │  AI Services  │   │ Security APIs │
             │  (Auth & DB)  │   │ (OpenRouter)  │   │ (VirusTotal)  │
             └───────────────┘   └───────────────┘   └───────────────┘
```

### 2.2 Component Architecture

#### Frontend Components (React + TypeScript)

| Component | Responsibility | State Management |
|-----------|---------------|------------------|
| **App Shell** | Main application container, navigation, theme management | Global state |
| **Auth Pages** | Login, registration, password setup screens | Local state |
| **Dashboard** | Overview, security score, recent activity, quick actions | Local + Global |
| **Link Scanner** | URL input, scan results, history | Local state |
| **File Scanner** | File upload, scan progress, results display | Local state |
| **Image Privacy** | Image upload, metadata display, removal controls | Local state |
| **Password Generator** | Password options, generation, strength indicator | Local state |
| **Credential Vault** | Credential list, add/edit forms, search | Global state |
| **AI Agent** | Chat interface, conversation history | Local state |
| **Gamification** | Progress display, achievements, level indicators | Global state |
| **Settings** | User preferences, security settings | Global state |

#### Backend Modules (Rust)

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| **crypto.rs** | Encryption/decryption operations | `encrypt_text()`, `decrypt_text()`, `derive_key()` |
| **image_privacy.rs** | Image metadata handling | `scan_image_metadata()`, `strip_image_metadata()` |
| **virustotal.rs** | URL and file scanning | `scan_url()`, `scan_file()` |
| **ai_agent.rs** | AI chat integration | `chat_with_ai()` |
| **diagram.rs** | Diagram generation | `save_diagram()` |

### 2.3 Data Flow Architecture

#### Link Scanning Flow
```
User Input → Frontend Validation → IPC Call → Rust VirusTotal Client →
External VirusTotal API → Response Processing → Result Display →
Local History Storage → Gamification Points Award
```

#### Credential Storage Flow
```
User Input → Frontend Validation → IPC Call → Rust Crypto Engine →
AES-256-GCM Encryption → Firestore Storage → Firebase Sync →
Confirmation → Gamification Points Award
```

#### AI Chat Flow
```
User Message → Context Assembly → IPC Call → Rust AI Agent →
OpenRouter API → Response Streaming → Frontend Display →
Conversation History Storage in Firestore
```

---

## 3. Technology Stack

### 3.1 Frontend Technologies

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Tauri** | 2.10.1 | Desktop framework | Lightweight, secure, cross-platform |
| **React** | 18.3.1 | UI library | Component-based, mature ecosystem |
| **TypeScript** | 5.5.3 | Type safety | Reduces runtime errors, improves DX |
| **Tailwind CSS** | 3.4.10 | Styling | Utility-first, rapid prototyping |
| **Zustand** | 4.5.0 | State management | Lightweight, minimal boilerplate |
| **Framer Motion** | 11.3.0 | Animations | Smooth, performant transitions |
| **React Router** | 6.26.0 | Routing | Declarative routing |
| **Firebase** | 12.10.0 | Backend services | Authentication, Firestore database |
| **React Markdown** | 10.1.0 | Markdown rendering | For AI chat responses |
| **Lucide React** | 0.577.0 | Icons | Modern icon library |
| **Mermaid** | 11.12.3 | Diagrams | Flowchart and diagram rendering |

### 3.2 Backend Technologies (Rust)

| Crate | Version | Purpose |
|-------|---------|---------|
| **tauri** | 2.x | Tauri backend integration |
| **serde** | 1.x | Serialization/deserialization |
| **tokio** | 1.50.0 | Async runtime |
| **reqwest** | 0.13.2 | HTTP client |
| **aes-gcm** | 0.10 | AES-256-GCM encryption |
| **chacha20poly1305** | 0.10 | ChaCha20-Poly1305 encryption |
| **aes** | 0.8 | AES encryption |
| **cbc** | 0.1 | CBC mode encryption |
| **argon2** | 0.5 | Password hashing and key derivation |
| **base64** | 0.22 | Base64 encoding/decoding |
| **rand** | 0.8 | Secure random generation |
| **kamadak-exif** | 0.6.1 | EXIF metadata parsing |
| **img-parts** | 0.4.0 | Image metadata manipulation |
| **image** | 0.24 | Image processing |
| **chrono** | 0.4.44 | Date/time handling |
| **sha2** | 0.10.9 | SHA hashing for files |
| **urlencoding** | 2.1.3 | URL encoding |
| **dotenvy** | 0.15.7 | Environment variable management |
| **tauri-plugin-dialog** | 2.0.0 | Native dialogs |
| **tauri-plugin-opener** | 2.5.3 | URL opening |
| **tauri-plugin-google-auth** | 0.5.1 | Google OAuth |

### 3.3 External Services

| Service | Purpose | API Documentation |
|---------|---------|-------------------|
| **Firebase Authentication** | User authentication (Email/Password, Google OAuth) | https://firebase.google.com/docs/auth |
| **Firebase Firestore** | Cloud database for user data, credentials, activities | https://firebase.google.com/docs/firestore |
| **OpenRouter API** | AI model access for chat functionality | https://openrouter.ai/docs |
| **VirusTotal API** | URL and file malware scanning | https://developers.virustotal.com |

---

## 4. Core Features

### 4.1 Authentication System

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| AUTH-001 | User can register with email and password | Critical | ✓ Implemented |
| AUTH-002 | User can login with email and password | Critical | ✓ Implemented |
| AUTH-003 | User can login with Google OAuth | High | ✓ Implemented |
| AUTH-004 | System validates password strength during registration | Critical | ✓ Implemented |
| AUTH-005 | System supports Firebase Authentication | Critical | ✓ Implemented |
| AUTH-006 | User can logout from the application | Critical | ✓ Implemented |
| AUTH-007 | System implements session management | Critical | ✓ Implemented |
| AUTH-008 | User can reset password | High | ✓ Implemented |

#### Implementation Details

**Authentication Flow:**
1. User enters credentials (email/password or Google OAuth)
2. Firebase Authentication validates credentials
3. On success, Firebase creates session token
4. User data stored in Firestore
5. Application state updated via Zustand store
6. Protected routes enforce authentication

**Files:**
- `src/pages/Login.tsx` - Login page component
- `src/pages/Register.tsx` - Registration page component
- `src/pages/ForgotPassword.tsx` - Password reset component
- `src/store/useAuthStore.ts` - Authentication state management
- `src/lib/firebase.ts` - Firebase configuration

### 4.2 Link Scanner

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| LS-001 | User can input a URL for scanning | Critical | ✓ Implemented |
| LS-002 | System validates URL format before API call | Critical | ✓ Implemented |
| LS-003 | System displays threat level indicator | Critical | ✓ Implemented |
| LS-004 | System shows detailed scan results | High | ✓ Implemented |
| LS-005 | System awards gamification points | Medium | ✓ Implemented |
| LS-006 | Integration with VirusTotal API | Critical | ✓ Implemented |

#### Implementation Details

**VirusTotal API Integration:**
- Base URL: `https://www.virustotal.com/api/v3`
- Authentication: API Key in `x-apikey` header
- Rate Limits: 4 requests/minute (free tier)
- Polling mechanism for scan completion (up to 2 minutes)

**Response Structure:**
```typescript
interface ScanResult {
  target: string;
  status: 'clean' | 'suspicious' | 'malicious';
  reputation: number;
  detections: {
    engine: string;
    result: string;
    category: string;
  }[];
  stats: {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
  };
}
```

**Files:**
- `src/pages/LinkScanner.tsx` - Link scanner UI
- `src-tauri/src/virustotal.rs` - VirusTotal API client

### 4.3 File Scanner

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FS-001 | User can upload files for malware scanning | Critical | ✓ Implemented |
| FS-002 | System displays file hash (SHA-256) | High | ✓ Implemented |
| FS-003 | System shows malware detection results | Critical | ✓ Implemented |
| FS-004 | System maintains scan history | Medium | ✓ Implemented |
| FS-005 | Maximum file size: 650MB (VirusTotal limit) | Critical | ✓ Implemented |
| FS-006 | Large file upload (>32MB) uses special upload URL | High | ✓ Implemented |

#### Implementation Details

**File Scanning Process:**
1. User selects file
2. File hashed locally (SHA-256)
3. Check if hash exists in VirusTotal database
4. If not found, upload file to VirusTotal
5. Poll for analysis completion
6. Display results with threat level

**Files:**
- `src/pages/FileScanner.tsx` - File scanner UI
- `src-tauri/src/virustotal.rs` - VirusTotal API client (scan_file function)

### 4.4 Image Privacy (Metadata Removal)

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| IP-001 | User can upload images for metadata extraction | Critical | ✓ Implemented |
| IP-002 | System displays all EXIF metadata fields | Critical | ✓ Implemented |
| IP-003 | System highlights sensitive metadata (GPS, device info) | Critical | ✓ Implemented |
| IP-004 | System can strip all metadata | Critical | ✓ Implemented |
| IP-005 | System supports JPEG and PNG formats | Critical | ✓ Implemented |
| IP-006 | System displays GPS location on map | Medium | ✓ Implemented |

#### Implementation Details

**Metadata Categories:**
- **GPS Data**: Latitude, Longitude, Altitude, Speed, Google Maps URL
- **Camera Info**: Make, Model, Software
- **DateTime**: Original, Digitized, Modified, Accessed, Created
- **Image Settings**: ISO, Aperture, Exposure, Focal Length, Flash
- **File Properties**: Dimensions, file size, color type, bit depth

**Supported Formats:** JPEG, PNG

**Files:**
- `src/pages/ImagePrivacy.tsx` - Image privacy UI
- `src-tauri/src/image_privacy.rs` - Image metadata processing

### 4.5 Password Generator

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| PG-001 | System generates cryptographically secure passwords | Critical | ✓ Implemented |
| PG-002 | User can specify password length (8-64 characters) | Critical | ✓ Implemented |
| PG-003 | User can toggle character types | Critical | ✓ Implemented |
| PG-004 | System displays password strength meter | Critical | ✓ Implemented |
| PG-005 | System provides copy-to-clipboard | Critical | ✓ Implemented |

#### Strength Algorithm

**Entropy Calculation:**
```typescript
const charsetSize = (has_lowercase * 26) +
                   (has_uppercase * 26) +
                   (has_numbers * 10) +
                   (has_symbols * 32);
const entropy = length * log2(charsetSize);
```

**Strength Levels:**
- Weak: < 40 bits
- Moderate: 40-60 bits
- Strong: 60-80 bits
- Very Strong: > 80 bits

**Files:**
- `src/pages/PasswordGenerator.tsx` - Password generator UI
- `src/components/ui/PasswordStrength.tsx` - Strength indicator component

### 4.6 Password Checker

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| PC-001 | User can check password strength | Critical | ✓ Implemented |
| PC-002 | System displays entropy calculation | High | ✓ Implemented |
| PC-003 | System shows improvement suggestions | Medium | ✓ Implemented |

#### Implementation Details

**Checks Performed:**
- Length analysis
- Character variety (uppercase, lowercase, numbers, symbols)
- Common password patterns
- Entropy calculation
- Breached password check (future enhancement)

**Files:**
- `src/pages/PasswordChecker.tsx` - Password checker UI

### 4.7 Encryption Tool

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| ET-001 | User can encrypt text with multiple algorithms | Critical | ✓ Implemented |
| ET-002 | System supports AES-256-GCM | Critical | ✓ Implemented |
| ET-003 | System supports ChaCha20-Poly1305 | High | ✓ Implemented |
| ET-004 | System supports AES-128-CBC | High | ✓ Implemented |
| ET-005 | User can decrypt encrypted text | Critical | ✓ Implemented |

#### Implementation Details

**Supported Algorithms:**
1. **AES-256-GCM** (Recommended)
   - 256-bit key
   - Galois/Counter Mode
   - Authenticated encryption
   - 12-byte nonce

2. **ChaCha20-Poly1305**
   - 256-bit key
   - Stream cipher
   - Authenticated encryption
   - 12-byte nonce

3. **AES-128-CBC**
   - 128-bit key
   - Cipher Block Chaining
   - PKCS7 padding
   - 16-byte IV

**Key Derivation:**
- Algorithm: Argon2id
- Parameters: t=3, m=64MB, p=4, output length varies by algorithm

**Files:**
- `src/pages/Encryption.tsx` - Encryption UI
- `src-tauri/src/crypto.rs` - Encryption implementation

### 4.8 Credential Vault

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| CV-001 | User can store credentials | Critical | ✓ Implemented |
| CV-002 | All credentials encrypted with AES-256-GCM | Critical | ✓ Implemented |
| CV-003 | User must authenticate with master password | Critical | ✓ Implemented |
| CV-004 | System supports login credentials | High | ✓ Implemented |
| CV-005 | System supports payment cards | High | ✓ Implemented |
| CV-006 | User can edit and delete credentials | Critical | ✓ Implemented |

#### Implementation Details

**Credential Types:**
1. **Login Credentials**
   - Website/Service name
   - Username/Email
   - Encrypted password

2. **Payment Cards**
   - Cardholder name
   - Encrypted card number
   - Expiry date
   - CVV

**Encryption:**
- Each credential encrypted separately
- Algorithm: AES-256-GCM
- Key: Derived from master password
- Storage: Firestore (encrypted)

**Master Password:**
- Never stored in plaintext
- Used to derive encryption key
- Verification string encrypted and stored

**Files:**
- `src/pages/CredentialVault.tsx` - Vault UI
- `src/services/vaultService.ts` - Vault service functions
- `src/services/credentialService.ts` - Credential CRUD operations
- `src-tauri/src/crypto.rs` - Encryption functions

### 4.9 AI Agent

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| AI-001 | User can chat with AI assistant | Critical | ✓ Implemented |
| AI-002 | AI provides security-focused responses | Critical | ✓ Implemented |
| AI-003 | System maintains conversation history | Critical | ✓ Implemented |
| AI-004 | System supports markdown formatting | Medium | ✓ Implemented |
| AI-005 | System can generate Mermaid diagrams | Medium | ✓ Implemented |
| AI-006 | Streaming responses for real-time interaction | High | ✓ Implemented |

#### Implementation Details

**AI Models Used (Fallback Chain):**
1. `openrouter/free` - Primary model
2. `stepfun/step-3.5-flash:free` - Fallback 1
3. `arcee-ai/trinity-large-preview:free` - Fallback 2
4. `arcee-ai/trinity-mini:free` - Fallback 3
5. `cognitivecomputations/dolphin-mistral-24b-venice-edition:free` - Fallback 4

**System Prompt:**
- Expert in cybersecurity and AI
- Declines non-security questions
- Supports Mermaid diagram generation
- Provides code only when explicitly requested

**Supported Mermaid Diagram Types:**
- flowchart, sequenceDiagram, classDiagram, erDiagram
- stateDiagram-v2, gantt, pie, gitgraph, mindmap
- timeline, quadrantChart, block-beta

**Files:**
- `src/pages/AIAgent.tsx` - AI chat UI
- `src-tauri/src/ai_agent.rs` - AI integration
- `src/services/chatService.ts` - Chat history management

### 4.10 Dashboard

#### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| DASH-001 | Dashboard displays security score | Critical | ✓ Implemented |
| DASH-002 | Dashboard shows XP and level progress | Critical | ✓ Implemented |
| DASH-003 | Dashboard displays daily tasks | High | ✓ Implemented |
| DASH-004 | Dashboard shows recent activity | High | ✓ Implemented |
| DASH-005 | Quick access to all features | High | ✓ Implemented |

#### Security Score Calculation

**Components:**
- **Base Score** (10 points): Active user
- **XP Score** (0-25 points): Based on total XP earned
- **Streak Score** (0-20 points): 2 points per day, max 10 days
- **Vault Score** (0-15 points): 3 points per credential, max 5
- **Activity Score** (0-15 points): 3 points per activity, max 5
- **Task Score** (0-15 points): 3 points per completed daily task

**Maximum Score:** 100 points

**Files:**
- `src/pages/Dashboard.tsx` - Dashboard UI

---

## 5. Database Schema

### 5.1 Firebase Firestore Schema

#### Collections Structure

```
users/{userId}
├── progress/data                    # User progress and XP
├── vaultConfig/main                  # Vault encryption config
├── vault/{credentialId}            # Encrypted credentials
├── activities/{activityId}          # Activity log
├── chatSessions/{sessionId}         # Chat sessions
│   └── messages/{messageId}        # Chat messages
└── dailyTasks/{taskId}             # Daily task tracking
```

#### 5.1.1 User Progress Document

**Path:** `users/{userId}/progress/data`

```typescript
interface UserProgress {
  xp: number;              // Total XP earned
  level: number;           // Current level (1-10)
  totalScore: number;      // Cumulative score
  streakDays: number;      // Consecutive days active
  lastActiveDate: string;  // ISO date string (YYYY-MM-DD)
  createdAt?: Date;        // Account creation timestamp
}
```

**Level Thresholds:**
| Level | XP Required | Title |
|-------|------------|-------|
| 1 | 0 | Novice |
| 2 | 100 | Apprentice |
| 3 | 300 | Guardian |
| 4 | 600 | Defender |
| 5 | 1000 | Sentinel |
| 6 | 1500 | Champion |
| 7 | 2200 | Hero |
| 8 | 3000 | Legend |
| 9 | 4000 | Mythic |
| 10 | 5500 | Omniscient |

#### 5.1.2 Vault Configuration Document

**Path:** `users/{userId}/vaultConfig/main`

```typescript
interface VaultConfig {
  encryptedVerifyHash: string;  // Encrypted verification string
}
```

**Purpose:**
- Stores encrypted verification string for master password validation
- Verification string: "hypertool-vault-verification-string"
- Encrypted with master password-derived key

#### 5.1.3 Credential Documents

**Path:** `users/{userId}/vault/{credentialId}`

```typescript
interface CredentialItem {
  type: 'login' | 'card';           // Credential type
  name: string;                      // Display name
  username: string;                   // Username or cardholder name
  domain: string;                    // Website or issuer
  encryptedData: string;             // Encrypted JSON with sensitive data
  serviceId?: string;                // Optional service identifier
  createdAt: Date;                  // Creation timestamp
  updatedAt: Date;                  // Last update timestamp
}
```

**Encrypted Data Format:**
```json
{
  "login": {
    "password": "encrypted_password"
  },
  "card": {
    "cardNumber": "encrypted_number",
    "cvv": "encrypted_cvv"
  }
}
```

#### 5.1.4 Activity Documents

**Path:** `users/{userId}/activities/{activityId}`

```typescript
interface Activity {
  type: ActivityType;               // Activity type
  description: string;             // Human-readable description
  points: number;                  // XP awarded
  metadata: Record<string, string>; // Additional metadata
  createdAt: Date;                // Timestamp
}
```

**Activity Types:**
```typescript
type ActivityType =
  | 'scan_link'        // 10 XP
  | 'scan_file'        // 15 XP
  | 'scan_image'       // 10 XP
  | 'generate_password' // 5 XP
  | 'check_password'   // 3 XP
  | 'generate_encryption' // 5 XP
  | 'create_credential';   // 20 XP
```

#### 5.1.5 Chat Session Documents

**Path:** `users/{userId}/chatSessions/{sessionId}`

```typescript
interface ChatSession {
  title: string;           // Session title
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last message timestamp
}
```

#### 5.1.6 Chat Message Documents

**Path:** `users/{userId}/chatSessions/{sessionId}/messages/{messageId}`

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';  // Message sender
  content: string;             // Message content
  createdAt: Date;            // Timestamp
}
```

#### 5.1.7 Daily Task Documents

**Path:** `users/{userId}/dailyTasks/{taskId}`

```typescript
interface DailyTask {
  id: string;               // Task identifier
  description: string;       // Task description
  current: number;          // Current progress
  target: number;           // Target count
  points: number;           // XP awarded on completion
  completed: boolean;       // Completion status
  date: string;             // Task date (YYYY-MM-DD)
}
```

**Daily Tasks:**
| Task | Target | Points |
|------|--------|--------|
| Scan 1 link | 1 | 10 |
| Generate 1 password | 1 | 5 |
| Check 1 password | 1 | 3 |
| Generate 1 encryption | 1 | 5 |
| Create 1 credential | 1 | 20 |

---

## 6. Backend Implementation

### 6.1 Rust Backend Architecture

#### 6.1.1 Module Structure

```
src-tauri/src/
├── main.rs              # Entry point
├── lib.rs               # Tauri command registration
├── crypto.rs            # Encryption/decryption
├── image_privacy.rs     # Image metadata processing
├── virustotal.rs        # VirusTotal API client
├── ai_agent.rs          # AI chat integration
└── diagram.rs           # Diagram generation
```

#### 6.1.2 Tauri Commands

**Registered Commands:**
```rust
#[tauri::command]
fn greet(name: &str) -> String

#[tauri::command]
fn encrypt_text(plaintext: String, password: String, algorithm: String) -> Result<String, String>

#[tauri::command]
fn decrypt_text(encoded: String, password: String) -> Result<String, String>

#[tauri::command]
fn scan_image_metadata(path: &str) -> Result<ImageMetadata, String>

#[tauri::command]
fn strip_image_metadata(path: &str, output_path: &str) -> Result<(), String>

#[tauri::command]
async fn scan_url(url: String) -> Result<ScanResult, String>

#[tauri::command]
async fn scan_file(file_path: String) -> Result<ScanResult, String>

#[tauri::command]
async fn chat_with_ai(messages: Vec<Value>, on_chunk: Channel<String>) -> Result<(), String>

#[tauri::command]
async fn save_diagram(content: String, path: String) -> Result<(), String>
```

### 6.2 Crypto Module

#### 6.2.1 Encryption Algorithms

**AES-256-GCM (Recommended)**
```rust
fn encrypt_aes256_gcm(plaintext: &[u8], password: &str) -> Result<EncryptedData, Error> {
    // Derive 32-byte key using Argon2id
    let mut salt = [0u8; 16];
    OsRng.fill_bytes(&mut salt);
    let key = derive_key(password, &salt, 32)?;

    // Create cipher
    let cipher = Aes256Gcm::new_from_slice(&key)?;

    // Generate 12-byte nonce
    let mut nonce = [0u8; 12];
    OsRng.fill_bytes(&mut nonce);

    // Encrypt
    let ciphertext = cipher.encrypt(nonce.as_ref().into(), plaintext)?;

    Ok(EncryptedData { salt, nonce, ciphertext })
}
```

**ChaCha20-Poly1305**
```rust
fn encrypt_chacha20_poly1305(plaintext: &[u8], password: &str) -> Result<EncryptedData, Error> {
    // Derive 32-byte key
    let mut salt = [0u8; 16];
    OsRng.fill_bytes(&mut salt);
    let key = derive_key(password, &salt, 32)?;

    // Create cipher
    let cipher = ChaCha20Poly1305::new_from_slice(&key)?;

    // Generate 12-byte nonce
    let mut nonce = [0u8; 12];
    OsRng.fill_bytes(&mut nonce);

    // Encrypt
    let ciphertext = cipher.encrypt(nonce.as_ref().into(), plaintext)?;

    Ok(EncryptedData { salt, nonce, ciphertext })
}
```

**AES-128-CBC (Legacy)**
```rust
fn encrypt_aes128_cbc(plaintext: &[u8], password: &str) -> Result<EncryptedData, Error> {
    // Derive 16-byte key
    let mut salt = [0u8; 16];
    OsRng.fill_bytes(&mut salt);
    let key = derive_key(password, &salt, 16)?;

    // Generate 16-byte IV
    let mut iv = [0u8; 16];
    OsRng.fill_bytes(&mut iv);

    // Pad with PKCS7
    let padded = pkcs7_pad(plaintext, 16);

    // Create cipher
    let cipher = Aes128CbcEnc::new_from_slices(&key, &iv)?;

    // Encrypt
    let ciphertext = cipher.encrypt_padded_vec_mut::<NoPadding>(&padded)?;

    Ok(EncryptedData { salt, nonce: iv, ciphertext })
}
```

#### 6.2.2 Key Derivation

**Argon2id Parameters:**
- Algorithm: Argon2id (resistant to side-channel attacks)
- Time Cost (t): 3 iterations
- Memory Cost (m): 64 MB
- Parallelism (p): 4 threads
- Output Length: 16 or 32 bytes (depending on algorithm)

```rust
fn derive_key(password: &str, salt: &[u8], key_len: usize) -> Result<Vec<u8>, String> {
    let params = Params::new(65536, 3, 4, Some(key_len as u32))?;
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

    let mut key = vec![0u8; key_len];
    argon2.hash_password_into(password.as_bytes(), salt, &mut key)?;

    Ok(key)
}
```

#### 6.2.3 Data Format

**Encrypted Payload Structure:**
```json
{
  "alg": "AES-256-GCM",
  "salt": "base64_encoded_salt",
  "iv": "base64_encoded_iv_or_nonce",
  "ct": "base64_encoded_ciphertext"
}
```

**Final Encoding:**
- Payload JSON serialized to string
- String encoded with Base64
- Single Base64 string returned to frontend

### 6.3 Image Privacy Module

#### 6.3.1 Metadata Extraction

**EXIF Fields Extracted:**

**GPS Data:**
- Latitude (DMS + decimal)
- Longitude (DMS + decimal)
- Google Maps URL

**Camera Info:**
- Make
- Model
- Software

**Timestamps:**
- DateTimeOriginal
- DateTimeDigitized
- Modified (system)
- Accessed (system)
- Created (system)

**Camera Settings:**
- FNumber (aperture)
- ExposureTime
- PhotographicSensitivity (ISO)
- FocalLength
- Flash
- WhiteBalance
- Orientation
- XResolution, YResolution
- ResolutionUnit

**File Properties:**
- File type (JPEG, PNG, etc.)
- File size
- Dimensions (width × height)
- Color type (RGB, RGBA, etc.)
- Bit depth
- Megapixels

#### 6.3.2 Metadata Removal

**Process:**
1. Parse image bytes
2. Remove EXIF segment
3. Re-encode image
4. Save to output path

**Implementation:**
```rust
pub fn strip_image_metadata(path: &str, output_path: &str) -> Result<(), String> {
    let input = std::fs::read(path)?;
    let input_bytes = Bytes::from(input);

    let ext = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();

    if ext == "jpg" || ext == "jpeg" {
        let mut jpeg = Jpeg::from_bytes(input_bytes)?;
        jpeg.set_exif(None);
        jpeg.encoder().write_to(&mut File::create(output_path)?)?;
    } else if ext == "png" {
        let mut png = Png::from_bytes(input_bytes)?;
        png.set_exif(None);
        png.encoder().write_to(&mut File::create(output_path)?)?;
    } else {
        return Err("Unsupported format".to_string());
    }

    Ok(())
}
```

### 6.4 VirusTotal Module

#### 6.4.1 URL Scanning

**Process:**
1. Submit URL to VirusTotal
2. Receive analysis ID
3. Poll for completion
4. Return results

**Polling Strategy:**
- Check every 4 seconds
- Maximum 30 attempts (2 minutes)
- Timeout if analysis not complete

**Implementation:**
```rust
pub async fn scan_url(url: String) -> Result<ScanResult, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(120))
        .build()?;

    // Submit URL
    let body = format!("url={}", urlencoding::encode(&url));
    let res = client.post(format!("{}/urls", BASE_URL))
        .header("x-apikey", API_KEY)
        .header("content-type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await?;

    let analysis_id = parse_analysis_id(res).await?;

    // Poll for results
    poll_analysis(&client, &analysis_id, url, None, None).await
}
```

#### 6.4.2 File Scanning

**Process:**
1. Calculate file hash (SHA-256)
2. Check if hash exists in VirusTotal
3. If not found, upload file
4. Large files (>32MB) get special upload URL
5. Poll for completion
6. Return results

**Hashing Implementation:**
```rust
fn hash_file(path: &str) -> std::io::Result<(String, u64)> {
    let file = File::open(path)?;
    let mut reader = BufReader::new(file);
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 8192];
    let mut size: u64 = 0;

    loop {
        let n = reader.read(&mut buffer)?;
        if n == 0 { break; }
        size += n as u64;
        hasher.update(&buffer[..n]);
    }

    Ok((format!("{:x}", hasher.finalize()), size))
}
```

#### 6.4.3 Response Structure

```rust
pub struct ScanResult {
    pub target: String,                // URL or filename
    pub status: String,               // clean/suspicious/malicious
    pub reputation: i64,              // VT reputation score
    pub categories: Vec<String>,       // Categorized threats
    pub detections: Vec<Detection>,    // Engine-specific results
    pub scan_date: String,            // Scan timestamp
    pub file_size: Option<u64>,       // File size (if applicable)
    pub file_hash: Option<String>,    // SHA-256 hash
    pub stats: ScanStats,            // Detection statistics
}

pub struct ScanStats {
    pub malicious: i64,    // Number of engines detecting malware
    pub suspicious: i64,    // Number of engines detecting suspicious
    pub harmless: i64,     // Number of engines marking harmless
    pub undetected: i64,   // Number of engines with no detection
}
```

### 6.5 AI Agent Module

#### 6.5.1 AI Model Chain

**Fallback Strategy:**
1. Try primary model (`openrouter/free`)
2. If unavailable, try `stepfun/step-3.5-flash:free`
3. If unavailable, try `arcee-ai/trinity-large-preview:free`
4. If unavailable, try `arcee-ai/trinity-mini:free`
5. If unavailable, try `cognitivecomputations/dolphin-mistral-24b-venice-edition:free`
6. If all fail, return error

**Benefits:**
- Increased reliability
- Always have at least one working model
- Graceful degradation

#### 6.5.2 Streaming Implementation

**Process:**
1. Send chat request to OpenRouter API
2. Receive SSE (Server-Sent Events) stream
3. Parse events
4. Extract content chunks
5. Send chunks to frontend via Tauri channel

**Event Parsing:**
```rust
while let Some(chunk) = resp.chunk().await? {
    let chunk_str = String::from_utf8_lossy(&chunk);
    text_buffer.push_str(&chunk_str);

    while let Some(idx) = text_buffer.find("\n\n") {
        let event = text_buffer[..idx].to_string();
        text_buffer = text_buffer[idx + 2..].to_string();

        for line in event.split('\n') {
            if line.starts_with("data: ") {
                let data = &line[6..];
                if data.trim() == "[DONE]" { break; }

                if let Ok(json) = serde_json::from_str::<Value>(data) {
                    if let Some(content) = json["choices"][0]["delta"]["content"].as_str() {
                        let _ = on_chunk.send(content.to_string());
                    }
                }
            }
        }
    }
}
```

#### 6.5.3 System Prompt

**Purpose:**
- Define AI role and boundaries
- Specify supported diagram types
- Guide response style
- Enforce security-only topics

**Key Constraints:**
- Only answer security/AI questions
- Use Mermaid for diagrams
- Wrap text in double quotes
- Support specific diagram types only
- Simulate unsupported UML diagrams with flowcharts

---

## 7. Frontend Implementation

### 7.1 Application Structure

#### 7.1.1 Directory Layout

```
src/
├── components/
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── PasswordStrength.tsx
│   │   ├── Checkbox.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── TitleBar.tsx
│   ├── layout/              # Layout components
│   │   └── DashboardLayout.tsx
│   ├── auth/                # Authentication components
│   │   └── AuthLayout.tsx
│   └── Mermaid.tsx         # Mermaid diagram renderer
├── pages/                   # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── Dashboard.tsx
│   ├── LinkScanner.tsx
│   ├── FileScanner.tsx
│   ├── ImagePrivacy.tsx
│   ├── PasswordGenerator.tsx
│   ├── PasswordChecker.tsx
│   ├── Encryption.tsx
│   ├── CredentialVault.tsx
│   ├── AIAgent.tsx
│   ├── Settings.tsx
│   ├── TermsOfService.tsx
│   ├── PrivacyPolicy.tsx
│   ├── GoogleAuthCallback.tsx
│   └── PlaceholderPage.tsx
├── services/                # API services
│   ├── vaultService.ts
│   ├── credentialService.ts
│   ├── chatService.ts
│   ├── userProgressService.ts
│   ├── activityService.ts
│   ├── dailyTasksService.ts
│   └── passwordHistoryService.ts
├── store/                   # Zustand state stores
│   ├── useAuthStore.ts
│   ├── useUserProgressStore.ts
│   ├── useDailyTasksStore.ts
│   └── useActivityStore.ts
├── hooks/                   # Custom React hooks
│   └── useTrackActivity.ts
├── lib/                     # Libraries and utilities
│   ├── firebase.ts
│   ├── firestore-rest.ts
│   ├── oauth-config.ts
│   └── utils.ts
├── data/                    # Static data
│   └── serviceIcons.tsx
├── components/               # Specialized components
│   └── theme-provider.tsx
├── App.tsx                  # Main application component
└── main.tsx                 # Entry point
```

### 7.2 State Management

#### 7.2.1 Authentication Store

**File:** `src/store/useAuthStore.ts`

```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
```

**Usage:**
```typescript
const { user, loading } = useAuthStore();
```

#### 7.2.2 User Progress Store

**File:** `src/store/useUserProgressStore.ts`

```typescript
interface ProgressState {
  progress: UserProgress | null;
  levelInfo: LevelInfo;
  fetchProgress: (userId: string) => Promise<void>;
  addXp: (userId: string, points: number) => Promise<void>;
}
```

**Level Information:**
```typescript
interface LevelInfo {
  level: number;        // Current level (1-10)
  title: string;        // Level title (e.g., "Guardian")
  xpForNext: number;    // XP required for next level
  xpInLevel: number;    // XP earned in current level
  progress: number;      // Progress percentage (0-100)
}
```

#### 7.2.3 Daily Tasks Store

**File:** `src/store/useDailyTasksStore.ts`

```typescript
interface DailyTasksState {
  tasks: DailyTasksData | null;
  summary: {
    completed: number;
    total: number;
  };
  totalScore: number;
  maxScore: number;
  fetchTasks: (userId: string) => Promise<void>;
  updateTask: (taskId: string, current: number) => Promise<void>;
}
```

#### 7.2.4 Activity Store

**File:** `src/store/useActivityStore.ts`

```typescript
interface ActivityState {
  activities: Activity[];
  loading: boolean;
  fetchActivities: (userId: string) => Promise<void>;
  logActivity: (userId: string, type: ActivityType, metadata?: Record<string, string>) => Promise<string>;
}
```

### 7.3 Service Layer

#### 7.3.1 Vault Service

**File:** `src/services/vaultService.ts`

**Functions:**
- `setupMasterPassword(userId, masterPassword)` - Initialize vault
- `verifyMasterPassword(userId, masterPassword)` - Validate password
- `hasVaultSetup(userId)` - Check if vault exists

**Implementation:**
```typescript
export async function setupMasterPassword(userId: string, masterPassword: string): Promise<boolean> {
  // Encrypt verification string with master password
  const encryptedVerifyHash = await invoke<string>('encrypt_text', {
    plaintext: VERIFY_STRING,
    password: masterPassword,
    algorithm: 'AES-256-GCM'
  });

  // Store in Firestore
  const configRef = doc(db, 'users', userId, 'vaultConfig', 'main');
  await setDoc(configRef, { encryptedVerifyHash });

  return true;
}
```

#### 7.3.2 Credential Service

**File:** `src/services/credentialService.ts`

**Functions:**
- `addCredential(userId, credential)` - Add new credential
- `getUserCredentials(userId)` - Get all credentials
- `deleteCredential(userId, credentialId)` - Delete credential

**Implementation:**
```typescript
export async function addCredential(userId: string, credential: Omit<CredentialItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const vaultRef = collection(db, `users/${userId}/vault`);
  const docRef = await addDoc(vaultRef, {
    ...credential,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}
```

#### 7.3.3 Chat Service

**File:** `src/services/chatService.ts`

**Functions:**
- `createChatSession(userId, title)` - Create new session
- `getChatSessions(userId)` - Get all sessions
- `getChatMessages(userId, sessionId)` - Get session messages
- `addChatMessage(userId, sessionId, role, content)` - Add message
- `updateChatSessionTitle(userId, sessionId, title)` - Update title
- `deleteChatSession(userId, sessionId)` - Delete session

#### 7.3.4 User Progress Service

**File:** `src/services/userProgressService.ts`

**Functions:**
- `getUserProgress(userId)` - Get user progress
- `initializeUserProgress(userId)` - Initialize progress
- `addXp(userId, points)` - Add XP and update level
- `getLevelInfo(xp)` - Calculate level from XP
- `ensureUserProgress(userId)` - Ensure progress exists

**Level Calculation:**
```typescript
export function getLevelInfo(xp: number): LevelInfo {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
      break;
    }
  }

  const xpInLevel = xp - currentLevel.xp;
  const xpNeeded = nextLevel.xp - currentLevel.xp;
  const progress = (xpInLevel / xpNeeded) * 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xpForNext: nextLevel.xp,
    xpInLevel,
    progress: Math.min(progress, 100),
  };
}
```

#### 7.3.5 Activity Service

**File:** `src/services/activityService.ts`

**Functions:**
- `logActivity(userId, type, metadata)` - Log activity
- `getRecentActivities(userId, maxCount)` - Get recent activities

**Activity Points:**
```typescript
export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  scan_link: 10,
  scan_file: 15,
  scan_image: 10,
  generate_password: 5,
  check_password: 3,
  generate_encryption: 5,
  create_credential: 20,
};
```

### 7.4 Component Architecture

#### 7.4.1 Routing Structure

**File:** `src/App.tsx`

**Routes:**
```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
  <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
  <Route path="/terms" element={<TermsOfService />} />
  <Route path="/privacy" element={<PrivacyPolicy />} />

  {/* Protected Routes */}
  <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="link-scanner" element={<LinkScanner />} />
    <Route path="file-scanner" element={<FileScanner />} />
    <Route path="image-privacy" element={<ImagePrivacy />} />
    <Route path="password-gen" element={<PasswordGenerator />} />
    <Route path="password-check" element={<PasswordChecker />} />
    <Route path="encryption" element={<Encryption />} />
    <Route path="vault" element={<CredentialVault />} />
    <Route path="ai-agent" element={<AIAgent />} />
    <Route path="settings" element={<Settings />} />
  </Route>

  {/* Default Route */}
  <Route path="/" element={<Navigate to="/login" replace />} />
</Routes>
```

#### 7.4.2 Protected Route Pattern

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

#### 7.4.3 UI Component Library

**Reusable Components:**
- **Button** - Primary, secondary, outline variants
- **Card** - Container with header and content
- **Input** - Text input with validation
- **PasswordInput** - Password field with show/hide toggle
- **PasswordStrength** - Strength indicator with meter
- **Checkbox** - Boolean input with label
- **TitleBar** - Custom window title bar
- **ThemeToggle** - Light/dark mode switch

**Design System:**
- Color palette: Tailwind CSS colors
- Typography: Inter font family
- Spacing: Tailwind spacing scale
- Radius: Consistent border radius
- Shadows: Tailwind shadow utilities

### 7.5 Firebase Integration

#### 7.5.1 Firebase Configuration

**File:** `src/lib/firebase.ts`

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC2-5eY7G-SlS1WJlbqGYdwgQicba-guRA",
  authDomain: "seniorproject-d1dbb.firebaseapp.com",
  projectId: "seniorproject-d1dbb",
  storageBucket: "seniorproject-d1dbb.firebasestorage.app",
  messagingSenderId: "220494552719",
  appId: "1:220494552719:web:c2c06a1a1f18862eb31afa",
  measurementId: "G-F5QQMTS4CM"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const googleProvider = new GoogleAuthProvider();
```

#### 7.5.2 Authentication Flow

**Email/Password:**
```typescript
await signInWithEmailAndPassword(auth, email, password);
await createUserWithEmailAndPassword(auth, email, password);
await sendPasswordResetEmail(auth, email);
```

**Google OAuth:**
```typescript
await signInWithPopup(auth, googleProvider);
```

**Session Management:**
```typescript
onAuthStateChanged(auth, (user) => {
  setUser(user);
  setLoading(false);
});
```

#### 7.5.3 Firestore Operations

**Read:**
```typescript
const docRef = doc(db, 'users', userId, 'progress', 'data');
const snapshot = await getDoc(docRef);
const data = snapshot.data();
```

**Write:**
```typescript
await setDoc(docRef, {
  xp: 100,
  level: 2,
}, { merge: true });
```

**Query:**
```typescript
const q = query(
  collection(db, `users/${userId}/vault`),
  orderBy('createdAt', 'desc')
);
const snapshot = await getDocs(q);
```

**Batch Operations:**
```typescript
const batch = writeBatch(db);
snapshot.docs.forEach(doc => {
  batch.delete(doc.ref);
});
await batch.commit();
```

---

## 8. Security Implementation

### 8.1 Authentication Security

#### 8.1.1 Password Requirements

**Minimum Requirements:**
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Strength Validation:**
- Checked against common password lists
- Real-time strength indicator
- Visual feedback during input

#### 8.1.2 Session Management

**Implementation:**
- Firebase session tokens stored locally
- Configurable auto-lock timeout
- Persistent or session-based storage
- Secure logout clears all data

**Auto-Lock:**
- Configurable timeout (default: 5 minutes)
- Inactivity detection
- Lock screen requiring master password

### 8.2 Data Encryption Standards

#### 8.2.1 Encryption Algorithms

| Algorithm | Key Size | Mode | Authenticated | Use Case |
|------------|-----------|-------|--------------|----------|
| **AES-256-GCM** | 256 bits | GCM | Yes | Default, recommended |
| **ChaCha20-Poly1305** | 256 bits | Stream | Yes | Alternative |
| **AES-128-CBC** | 128 bits | CBC | No | Legacy support |

#### 8.2.2 Key Derivation

**Algorithm:** Argon2id

**Parameters:**
- Memory Cost: 64 MB
- Time Cost: 3 iterations
- Parallelism: 4 threads
- Output Length: 16 or 32 bytes

**Security Benefits:**
- Resistant to GPU attacks (memory-hard)
- Side-channel attack resistant
- Configurable parameters
- Industry-standard

#### 8.2.3 Data Protection

**Data Types Encrypted:**

| Data Type | Encryption | Key Derivation |
|-----------|------------|----------------|
| Credentials | AES-256-GCM | Argon2id (master password) |
| Vault verification string | AES-256-GCM | Argon2id (master password) |
| Encryption text | Multiple algorithms | Argon2id (user password) |
| API Keys | AES-256-GCM | Device-specific key |

### 8.3 Secure Communication

#### 8.3.1 HTTPS Enforcement

- All API calls use HTTPS
- Certificate validation enabled
- No plaintext HTTP

#### 8.3.2 API Key Management

- API keys stored in environment variables
- Never committed to version control
- Loaded at runtime from `.env` file

**Example:**
```bash
# .env file
OPENROUTER_API_KEY=your_api_key_here
VIRUSTOTAL_API_KEY=your_vt_key_here
```

#### 8.3.3 Input Validation

**Frontend:**
- URL format validation
- File type validation
- Size limits enforced
- Sanitization before processing

**Backend:**
- Type checking with TypeScript
- Validation before encryption
- Error handling without information leakage

### 8.4 Privacy Considerations

#### 8.4.1 Data Minimization

- Only essential data collected
- User data stored in Firestore
- Encrypted at rest
- No telemetry without consent

#### 8.4.2 User Control

- Export functionality (future)
- Delete account (future)
- Data access request (future)
- Consent management

#### 8.4.3 Third-Party Services

**Services Used:**
- Firebase: Authentication, Firestore
- VirusTotal: URL/file scanning
- OpenRouter: AI chat

**Data Sharing:**
- Credentials: Never shared (encrypted locally)
- URLs/Files: Shared with VirusTotal for scanning
- Chat history: Stored in Firestore (encrypted)
- Usage data: Firebase Analytics (optional)

---

## 9. API Integrations

### 9.1 VirusTotal API

#### 9.1.1 Configuration

**Base URL:** `https://www.virustotal.com/api/v3`

**Authentication:**
```rust
const API_KEY: &str = "f0c0be10cd79cdbda397cc236c5bf064cf542558587cd653a9c75768f783478f";
```

#### 9.1.2 Endpoints

**URL Scanning:**
- `POST /urls` - Submit URL for scanning
- `GET /urls/{url_id}` - Get URL analysis

**File Scanning:**
- `GET /files/{id}` - Get file analysis
- `POST /files` - Upload file for scanning
- `GET /files/upload_url` - Get upload URL for large files

**Analysis:**
- `GET /analyses/{id}` - Get analysis results

#### 9.1.3 Rate Limits

**Free Tier:**
- 4 requests/minute
- 1000 requests/day
- 500 scans/day
- 650MB file size limit

#### 9.1.4 Response Processing

**URL Scan Flow:**
1. Submit URL → Get analysis ID
2. Poll analysis endpoint every 4 seconds
3. Wait for status "completed"
4. Parse results and return

**File Scan Flow:**
1. Calculate SHA-256 hash
2. Check if hash exists in VT database
3. If not found, upload file
4. Poll for completion
5. Return results

### 9.2 OpenRouter API

#### 9.2.1 Configuration

**Base URL:** `https://openrouter.ai/api/v1`

**Authentication:** Bearer token in Authorization header

**Models:**
- Primary: `openrouter/free`
- Fallbacks: Multiple free models

#### 9.2.2 Chat Endpoint

**Endpoint:** `POST /chat/completions`

**Request:**
```json
{
  "model": "openrouter/free",
  "messages": [
    {
      "role": "system",
      "content": "You are a cybersecurity expert..."
    },
    {
      "role": "user",
      "content": "How can I create a strong password?"
    }
  ],
  "stream": true
}
```

**Response (Streaming):**
```
data: {"choices":[{"delta":{"content":"To create a strong"}}]}
data: {"choices":[{"delta":{"content":" password, follow these guidelines:"}}]}
data: {"choices":[{"delta":{"content":"\n\n1. Use at least 12 characters"}}]}
data: [DONE]
```

#### 9.2.3 Error Handling

**Fallback Strategy:**
- Try each model in sequence
- On failure, try next model
- Log errors for debugging
- Return user-friendly error if all fail

### 9.3 Firebase API

#### 9.3.1 Authentication API

**Email/Password:**
```typescript
signInWithEmailAndPassword(auth, email, password);
createUserWithEmailAndPassword(auth, email, password);
sendPasswordResetEmail(auth, email);
```

**Google OAuth:**
```typescript
signInWithPopup(auth, googleProvider);
```

**Session Management:**
```typescript
onAuthStateChanged(auth, (user) => {
  // Handle auth state change
});
```

#### 9.3.2 Firestore API

**Document Operations:**
```typescript
// Read
getDoc(docRef);
setDoc(docRef, data);
updateDoc(docRef, data);
deleteDoc(docRef);

// Query
getDocs(query(collectionRef, orderBy('createdAt', 'desc')));

// Batch
const batch = writeBatch(db);
batch.set(docRef, data);
await batch.commit();
```

**Real-time Listeners:**
```typescript
onSnapshot(docRef, (doc) => {
  // Handle document changes
});
```

---

## 10. Gamification System

### 10.1 XP System

#### 10.1.1 Earning XP

**Activities and Points:**
| Activity | Points | Daily Limit |
|----------|--------|-------------|
| Link Scan | 10 | None |
| File Scan | 15 | None |
| Image Metadata Scan | 10 | None |
| Password Generation | 5 | None |
| Password Check | 3 | None |
| Encryption Generation | 5 | None |
| Credential Creation | 20 | None |
| Daily Task Completion | Variable | 5 tasks/day |

#### 10.1.2 Level Calculation

**Exponential Curve:**
- Level 1: 0 XP (Novice)
- Level 2: 100 XP (Apprentice)
- Level 3: 300 XP (Guardian)
- Level 4: 600 XP (Defender)
- Level 5: 1,000 XP (Sentinel)
- Level 6: 1,500 XP (Champion)
- Level 7: 2,200 XP (Hero)
- Level 8: 3,000 XP (Legend)
- Level 9: 4,000 XP (Mythic)
- Level 10: 5,500 XP (Omniscient)

**Progress Calculation:**
```typescript
const xpInLevel = xp - currentLevel.xp;
const xpNeeded = nextLevel.xp - currentLevel.xp;
const progress = (xpInLevel / xpNeeded) * 100;
```

### 10.2 Daily Tasks

#### 10.2.1 Task Types

| Task | Target | XP | Description |
|------|--------|-----|-------------|
| Scan Link | 1 | 10 | Scan 1 URL for threats |
| Generate Password | 1 | 5 | Generate 1 secure password |
| Check Password | 1 | 3 | Check 1 password strength |
| Generate Encryption | 1 | 5 | Encrypt text |
| Create Credential | 1 | 20 | Add credential to vault |

#### 10.2.2 Task Tracking

**Implementation:**
- Tasks reset daily
- Progress tracked per task
- Completion status stored
- XP awarded on completion

**Daily Score:**
- Maximum: 43 XP (all tasks completed)
- Percentage displayed on dashboard
- Contributes to security score

### 10.3 Streak System

#### 10.3.1 Streak Calculation

**Rules:**
- Consecutive days of activity
- Streak resets if inactive for >1 day
- Streak bonus: 2 points per day (max 20 points)

**Implementation:**
```typescript
let newStreak = progress.streakDays;
if (progress.lastActiveDate !== today && progress.lastActiveDate !== yesterday) {
  newStreak = 1;
} else if (progress.lastActiveDate !== today) {
  newStreak = progress.streakDays + 1;
}
```

### 10.4 Security Score

#### 10.4.1 Score Calculation

**Components:**
1. **Base Score:** 10 points (active user)
2. **XP Score:** Up to 25 points (based on total XP)
3. **Streak Score:** Up to 20 points (2 points/day)
4. **Vault Score:** Up to 15 points (3 points/credential)
5. **Activity Score:** Up to 15 points (3 points/activity)
6. **Task Score:** Up to 15 points (3 points/task completed)

**Maximum Score:** 100 points

#### 10.4.2 Score Display

**Dashboard:**
- Circular progress indicator
- Breakdown on hover
- Color-coded (red/yellow/green)
- Historical tracking (future)

**Tiers:**
- 0-49: Needs Improvement
- 50-74: Good
- 75-89: Very Good
- 90-100: Excellent

---

## 11. Testing Strategy

### 11.1 Frontend Testing

#### 11.1.1 Unit Testing

**Tools:**
- React Testing Library
- Vitest
- Jest (if needed)

**Test Coverage:**
- Component rendering
- User interactions
- State changes
- Error handling

**Example:**
```typescript
describe('PasswordGenerator', () => {
  it('generates password with correct length', () => {
    render(<PasswordGenerator />);
    const lengthInput = screen.getByLabelText('Length');
    fireEvent.change(lengthInput, { target: { value: 16 } });
    fireEvent.click(screen.getByText('Generate'));
    const password = screen.getByDisplayValue(/./);
    expect(password).toHaveLength(16);
  });
});
```

#### 11.1.2 Integration Testing

**Tools:**
- React Testing Library
- Mock Service Worker (MSW)

**Test Scenarios:**
- User authentication flow
- Complete feature workflows
- API integration
- Error recovery

#### 11.1.3 E2E Testing

**Tools:**
- Playwright (future)
- Cypress (alternative)

**Test Scenarios:**
- Complete user journeys
- Cross-browser testing
- Accessibility testing

### 11.2 Backend Testing

#### 11.2.1 Unit Testing

**Tools:**
- Rust's built-in test framework
- Mock dependencies

**Test Coverage:**
- Encryption/decryption
- Key derivation
- Data parsing
- Error handling

**Example:**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let plaintext = "Hello, World!";
        let encrypted = encrypt_text(plaintext.to_string(), "password".to_string(), "AES-256-GCM".to_string()).unwrap();
        let decrypted = decrypt_text(encrypted, "password".to_string()).unwrap();
        assert_eq!(plaintext, decrypted);
    }
}
```

#### 11.2.2 Integration Testing

**Test Scenarios:**
- API client integration
- Database operations
- Tauri IPC commands
- Error propagation

### 11.3 Security Testing

#### 11.3.1 Vulnerability Scanning

**Tools:**
- `cargo audit` - Rust dependencies
- `npm audit` - Node.js dependencies
- Snyk (optional)
- OWASP ZAP (optional)

**Frequency:** Before each release

#### 11.3.2 Penetration Testing

**Test Areas:**
- Input validation
- SQL injection prevention
- XSS prevention
- Authentication bypass
- Encryption verification

### 11.4 Performance Testing

#### 11.4.1 Load Testing

**Scenarios:**
- Concurrent users
- API rate limits
- Database performance
- Memory usage

**Tools:**
- Apache Benchmark (ab)
- wrk
- k6

#### 11.4.2 Optimization

**Areas:**
- Bundle size
- Code splitting
- Lazy loading
- Caching strategies
- Database indexing

---

## 12. Deployment

### 12.1 Build Process

#### 12.1.1 Development Build

**Command:**
```bash
bun run tauri dev
```

**Process:**
1. Start Vite dev server (port 3001)
2. Build Rust backend in debug mode
3. Launch Tauri application
4. Hot reload enabled

#### 12.1.2 Production Build

**Command:**
```bash
bun run tauri build
```

**Process:**
1. Run TypeScript compiler
2. Build frontend with Vite
3. Optimize assets
4. Build Rust backend in release mode
5. Package application

**Build Outputs:**

| Platform | Output Location |
|----------|----------------|
| Windows | `src-tauri/target/release/bundle/msi/` |
| macOS | `src-tauri/target/release/bundle/dmg/` |
| Linux | `src-tauri/target/release/bundle/deb/` |

### 12.2 Distribution

#### 12.2.1 Package Formats

**Windows:**
- MSI installer
- Setup wizard
- Desktop shortcut
- Start menu entry

**macOS:**
- DMG disk image
- Drag-and-drop installation
- App bundle
- Code signing (future)

**Linux:**
- DEB package (Debian/Ubuntu)
- AppImage (universal)
- Desktop file
- Icon integration

#### 12.2.2 Signing and Verification

**Windows:**
- Code signing certificate (future)
- Authenticode signature
- SmartScreen bypass

**macOS:**
- Developer ID certificate (future)
- App notarization
- Gatekeeper compliance

### 12.3 Update Mechanism

#### 12.3.1 Auto-Update

**Tauri Updater (Future):**
- Check for updates on launch
- Download in background
- Prompt user to install
- Delta updates (optional)

**Configuration:**
```json
{
  "updater": {
    "active": true,
    "endpoints": [
      "https://releases.hypertool.app/{{target}}/{{current_version}}"
    ],
    "dialog": true,
    "pubkey": "your_public_key"
  }
}
```

### 12.4 CI/CD Pipeline (Future)

#### 12.4.1 GitHub Actions

**Workflow:**
1. Trigger on push/PR
2. Run tests (frontend + backend)
3. Run linters
4. Security audit
5. Build for all platforms
6. Create release draft
7. Upload artifacts

**Example:**
```yaml
name: Build and Release
on: [push, pull_request]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: bun install
      - name: Run tests
        run: bun run test
      - name: Build
        run: bun run tauri build
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
```

### 12.5 Environment Variables

#### 12.5.1 Required Variables

**Backend (.env):**
```bash
OPENROUTER_API_KEY=your_openrouter_key
VIRUSTOTAL_API_KEY=your_virustotal_key
```

**Frontend:**
- Firebase config (in `src/lib/firebase.ts`)
- No runtime environment variables needed

#### 12.5.2 Security Best Practices

- Never commit `.env` files
- Use environment-specific configs
- Rotate API keys regularly
- Use secrets management for CI/CD

---

## Conclusion

HyperTool is a comprehensive cybersecurity desktop application that successfully addresses the critical security needs of individuals and small businesses. Through its modern tech stack (Tauri + React + TypeScript + Rust), it provides a secure, performant, and user-friendly platform.

### Key Achievements:

1. **Unified Platform**: Integrates multiple security tools in one application
2. **Modern Architecture**: Leverages Tauri for cross-platform desktop applications
3. **Strong Security**: Implements industry-standard encryption (AES-256-GCM, Argon2id)
4. **Engaging UX**: Gamification system encourages consistent security practices
5. **AI Integration**: Provides personalized security guidance via AI chat
6. **Real-time Protection**: VirusTotal integration for URL and file scanning
7. **Privacy Focus**: Image metadata removal protects user privacy

### Future Enhancements:

1. **Cross-device Sync**: Vault sync across devices
2. **Browser Extension**: Auto-fill credentials in browsers
3. **Mobile App**: iOS and Android versions
4. **Advanced Analytics**: Detailed security insights
5. **Team Features**: Shared vaults for teams
6. **Advanced Scanning: Integration with additional security APIs
7. **Offline Mode**: Cached databases for offline use

### Impact:

HyperTool democratizes cybersecurity by making enterprise-grade security tools accessible to non-technical users. Through its intuitive interface and gamified learning system, it empowers users to build better security habits and protect their digital lives.

---

**Document Version:** 1.0
**Last Updated:** 2025
**Project:** HyperTool - Senior Project
