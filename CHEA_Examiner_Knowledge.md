# CHEA — Complete Examiner Knowledge Base

Everything you need to know about your project to answer any examiner question.

---

## 1. PROJECT OVERVIEW

### What is CHEA?
CHEA (Cyber Hygiene Educator & Assistant) is a **desktop cybersecurity application** built with **Tauri** (React + TypeScript frontend + Rust backend). It combines practical security tools with AI-powered education and gamification.

### What problem does it solve?
- Users lack basic cybersecurity hygiene (human error = 95% of breaches)
- Existing tools are either too complex or too boring
- No unified platform combining tools + education + engagement
- CHEA makes security learning addictive through gamification

### Why a desktop app instead of web?
- Native file system access for file scanning
- Direct cryptographic operations in Rust (secure)
- Embedded PowerShell terminal
- Smaller bundle size than Electron (~10MB vs ~150MB)
- Offline capability for many features

### Key Stats
- **14+ features** across security tools, AI, and games
- **2 AI-powered features** (Nova chatbot + Security Posture assessment)
- **3 educational games** (Quiz Arena, Phishing Dojo, Scenario Simulator)
- **10+ XP rewards** for engagement
- **2 languages**: English + Arabic (RTL)
- **3 encryption algorithms**: AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC

---

## 2. TECH STACK

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type-safe development |
| Vite 5 | Build tool |
| Tailwind CSS 3.4 | Styling |
| Framer Motion 11 | Animations |
| Zustand 4 | State management |
| React Router v6 | Routing |
| Firebase SDK 12 | Auth + Firestore |
| i18next | Internationalization |
| Lucide React | Icons |
| React Markdown | Markdown rendering |
| Mermaid | Diagram generation |
| xterm.js | Terminal emulator |

### Backend (Rust)
| Crate | Purpose |
|---|---|
| tauri 2.0 | Desktop framework |
| aes-gcm 0.10 | AES-256-GCM encryption |
| chacha20poly1305 0.10 | ChaCha20-Poly1305 encryption |
| aes 0.8 | AES core |
| cbc 0.1 | CBC mode cipher |
| argon2 0.5 | Password hashing (Argon2id) |
| base64 0.22 | Base64 encoding |
| reqwest 0.13 | HTTP client |
| sha2 0.10 | SHA256 hashing |
| tokio 1.50 | Async runtime |
| kamadak-exif 0.6 | EXIF metadata parsing |
| img-parts 0.4 | Image metadata stripping |
| image 0.24 | Image decoding |
| chrono 0.4 | Date/time |
| portable-pty 0.8 | PTY for terminal |
| urlencoding 2.1 | URL encoding |
| dotenvy 0.15 | Environment variables |

### External APIs
| API | Purpose |
|---|---|
| VirusTotal API v3 | URL and file malware scanning |
| OpenRouter API | AI chatbot (x-ai/grok-4-fast model) |
| Firebase Auth | User authentication |
| Firebase Firestore | Cloud database |

---

## 3. ARCHITECTURE

### System Architecture

```
FRONTEND (React + TypeScript)
├── Pages (React components)
├── Services (API calls)
├── Zustand Stores (state)
└── Tauri IPC (invoke)
        │
        ├──→ Firebase Auth (login/register/password reset)
        ├──→ Firebase Firestore (user data, progress, vault)
        └──→ Tauri IPC → Rust Backend
                    ├── encrypt_text / decrypt_text (AES-256-GCM)
                    ├── scan_url / scan_file (VirusTotal)
                    ├── scan_image_metadata / strip_image_metadata (EXIF)
                    ├── chat_with_ai (OpenRouter)
                    └── write_to_pty / resize_pty (Terminal)
```

### Data Flow
1. **User Action** → React Page
2. **Service Call** → Firebase or Tauri IPC
3. **Rust Processing** → Encrypt/Scan/AI/EXIF
4. **Result Return** → Update UI + Firestore

### Firestore Data Structure
```
users/{userId}/
├── progress/data          → XP, level, streak, totalScore
├── vaultConfig/main       → encryptedVerifyHash (master password hash)
├── vault/{credentialId}   → encrypted credentials
├── chatSessions/{id}      → AI chat history
└── activities/            → activity log
```

---

## 4. ALL 14 TAURI COMMANDS

Every Tauri command in `src-tauri/src/lib.rs`:

### 1. `greet`
```rust
fn greet(name: &str) -> String
```
- **Input**: name string
- **Output**: "Hello, {name}! You've been greeted from Rust!"
- **Purpose**: Test command (basic Tauri demo)
- **Where used**: Dev testing

### 2. `encrypt_text` (in `crypto.rs`)
```rust
pub fn encrypt_text(plaintext: String, password: String, algorithm: String) -> Result<String, String>
```
- **Input**: plaintext (text to encrypt), password (key), algorithm ("AES-256-GCM" | "ChaCha20-Poly1305" | "AES-128-CBC")
- **Output**: Base64-encoded JSON string containing: alg, salt, iv, ct (ciphertext)
- **Process**:
  1. Generate random 16-byte salt
  2. Derive key from password + salt using Argon2 (default params)
  3. Generate random IV/nonce
  4. Encrypt plaintext using selected algorithm
  5. Return Base64(salt + iv + ciphertext as JSON)
- **Purpose**: Text encryption tool + vault entry encryption
- **Where used**: Encryption page, CredentialVault, vaultService

### 3. `decrypt_text` (in `crypto.rs`)
```rust
pub fn decrypt_text(encoded: String, password: String) -> Result<String, String>
```
- **Input**: Base64-encoded encrypted payload, password
- **Output**: Decrypted plaintext string
- **Process**:
  1. Base64 decode → JSON
  2. Extract salt, iv, ciphertext
  3. Derive key from password + salt
  4. Decrypt using stored algorithm
  5. Return plaintext or error
- **Error**: "Decryption failed — wrong password or corrupted data"
- **Where used**: Encryption page, CredentialVault, vaultService

### 4. `scan_image_metadata` (in `image_privacy.rs`)
```rust
pub fn scan_image_metadata(path: &str) -> Result<ImageMetadata, String>
```
- **Input**: file path (string)
- **Output**: ImageMetadata struct containing:
  - GPS data (latitude, longitude, Google Maps URL)
  - Camera data (make, model, software)
  - Datetime (original, digitized, modified, accessed, created)
  - Camera settings (aperture, exposure, ISO, focal length, flash, white balance)
  - File properties (dimensions, size, bit depth, color type, megapixels)
  - has_exif, exif_field_count
- **Process**:
  1. Read file system metadata (size, timestamps)
  2. Decode image with `image` crate (get dimensions, color type, bit depth)
  3. Parse EXIF data with kamadak-exif
  4. Extract GPS coordinates, convert DMS to decimal
  5. Generate Google Maps URL from GPS
- **Supported formats**: JPEG, PNG, GIF, WebP, BMP
- **Where used**: ImagePrivacy page

### 5. `strip_image_metadata` (in `image_privacy.rs`)
```rust
pub fn strip_image_metadata(path: &str, output_path: &str) -> Result<(), String>
```
- **Input**: input file path, output file path
- **Output**: Success or error
- **Process**:
  1. Read file as bytes
  2. Parse as JPEG (img-parts JPEG) or PNG (img-parts PNG)
  3. Set EXIF to None (removes all metadata)
  4. Write to output path
- **Supported formats**: JPEG, PNG only
- **Where used**: ImagePrivacy page (strip button)

### 6. `scan_url` (in `virustotal.rs`)
```rust
pub async fn scan_url(url: String) -> Result<ScanResult, String>
```
- **Input**: URL string
- **Output**: ScanResult struct
- **Process**:
  1. POST URL to VirusTotal `/urls` endpoint
  2. Get analysis_id from response
  3. Poll `/analyses/{id}` every 4 seconds (up to 30 attempts = 120s timeout)
  4. Parse stats (malicious, suspicious, harmless, undetected)
  5. Extract all engine detections
  6. Return ScanResult
- **Where used**: LinkScanner page

### 7. `scan_file` (in `virustotal.rs`)
```rust
pub async fn scan_file(file_path: String) -> Result<ScanResult, String>
```
- **Input**: file path (string)
- **Output**: ScanResult struct
- **Process**:
  1. Read file, compute SHA256 hash
  2. Check file size (max 200MB)
  3. Check if hash exists in VirusTotal database
  4. If found → return cached report
  5. If not → upload file to VirusTotal
  6. Get analysis_id, poll for results
  7. Return ScanResult
- **Where used**: FileScanner page

### 8. `chat_with_ai` (in `ai_agent.rs`)
```rust
pub async fn chat_with_ai(messages: Vec<serde_json::Value>, on_chunk: tauri::ipc::Channel<String>) -> Result<(), String>
```
- **Input**: array of message objects {role, content}, streaming channel
- **Output**: Streams response chunks via Channel
- **Process**:
  1. Load OPENROUTER_API_KEY from .env
  2. Prepend system prompt (Nova's instructions)
  3. Send to OpenRouter `/chat/completions` with streaming
  4. Stream response chunks back to frontend
  5. Model chain: x-ai/grok-4-fast (primary)
- **System prompt**: Bounds Nova to cybersecurity topics only, defines Mermaid rules
- **Where used**: AIAgent page (Nova chatbot)

### 9. `save_diagram` (in `diagram.rs`)
```rust
pub async fn save_diagram(app: tauri::AppHandle, file_name: String, content_base64: String) -> Result<bool, String>
```
- **Input**: file name, Base64-encoded SVG content
- **Output**: true if saved, false if cancelled
- **Process**:
  1. Decode Base64 → raw bytes
  2. Open native Save-As dialog
  3. Write SVG to user-selected path
- **Where used**: AIAgent page (save Mermaid diagrams)

### 10. `write_to_pty` (in `terminal.rs`)
```rust
pub fn write_to_pty(state: tauri::State<'_, PtyState>, data: String) -> Result<(), String>
```
- **Input**: data string (command to send to shell)
- **Output**: Success or error
- **Process**:
  1. Get or initialize PTY instance
  2. Write data to PTY writer
  3. Flush
- **Shell**: powershell.exe (Windows), bash (Unix)
- **Where used**: Terminal page (send commands)

### 11. `resize_pty` (in `terminal.rs`)
```rust
pub fn resize_pty(_state: tauri::State<'_, PtyState>, _rows: u16, _cols: u16) -> Result<(), String>
```
- **Input**: rows, cols
- **Output**: Success (currently a no-op on Windows)
- **Purpose**: Resize terminal window
- **Where used**: Terminal page (resize events)

---

## 5. ENCRYPTION DEEP DIVE

### How AES-256-GCM Encryption Works in CHEA

```
1. User enters: "Hello World" + password "MySecret123"
2. Rust generates:
   - Salt: 16 random bytes (Base64 encoded)
   - IV/Nonce: 12 random bytes
3. Key Derivation:
   - Argon2::default() derives 32-byte key from password + salt
   - Default Argon2 params: ~64MB memory, 3 iterations, 4 parallelism
4. Encryption:
   - AES-256-GCM encrypts plaintext → ciphertext
   - GCM mode provides both confidentiality AND authenticity (AEAD)
   - Tag is appended to ciphertext
5. Output (Base64(JSON)):
   {
     "alg": "AES-256-GCM",
     "salt": "Base64(salt)",
     "iv": "Base64(nonce)",
     "ct": "Base64(ciphertext+tag)"
   }
6. On decryption:
   - Extract salt + iv + ct from JSON
   - Derive same key from same password + salt
   - Decrypt → verify tag → return plaintext
   - Wrong password = decryption fails (no key match)
```

### Supported Algorithms

| Algorithm | Key Size | Mode | Use Case |
|---|---|---|---|
| AES-256-GCM | 256-bit | Authenticated (AEAD) | Vault, default choice |
| ChaCha20-Poly1305 | 256-bit | Authenticated (AEAD) | Alternative, mobile-friendly |
| AES-128-CBC | 128-bit | Confidentiality only (no auth) | Legacy compatibility |

### Argon2id Parameters (Key Derivation)
- **Memory**: ~64 MB (Argon2 default)
- **Iterations**: 3
- **Parallelism**: 4 lanes
- **Hash length**: 32 bytes (for AES-256), 16 bytes (for AES-128)
- **Why**: Memory-hard = resistant to GPU/ASIC attacks. Even with expensive hardware, cracking is computationally infeasible.

### Master Password System (Zero-Knowledge)

```
SETUP:
1. User creates master password
2. Client encrypts known string "chea-vault-verification-string" using master password
3. encryptedVerifyHash stored in Firestore: users/{userId}/vaultConfig/main
4. Master password NEVER stored anywhere

LOGIN:
1. User enters master password
2. Client decrypts encryptedVerifyHash using entered password
3. If decrypted string === "chea-vault-verification-string" → SUCCESS
4. Master password kept in memory (useAuthStore.masterPassword) for vault access
5. If decryption fails → wrong password
```

**Key point**: The cloud (Firebase) NEVER sees or stores the actual master password. Only an encrypted verification hash. Even if Firestore is compromised, attackers get nothing useful.

### Vault Encryption Flow
```
1. User enters master password → decrypts verify hash → success
2. Master password stored in memory (useAuthStore.masterPassword)
3. When adding a credential:
   - encrypt_text(plaintext: "{username, password}", password: masterPassword, algorithm: "AES-256-GCM")
   - Store encryptedData in Firestore: users/{userId}/vault/{id}
4. When reading a credential:
   - Get encryptedData from Firestore
   - decrypt_text(encoded: encryptedData, password: masterPassword)
   - Display decrypted fields
```

---

## 6. VIRUSTOTAL INTEGRATION

### Link Scanning Flow
```
1. Frontend calls: invoke('scan_url', { url: "https://example.com" })
2. Rust POSTs to: https://www.virustotal.com/api/v3/urls
   - Header: x-apikey: <API_KEY>
   - Body: url=<encoded_url>
3. Response: { data: { id: "analysis-id-xxx" } }
4. Poll: GET /analyses/{analysis-id}
   - Every 4 seconds
   - Up to 30 attempts (120s timeout)
   - Status: "queued" → "completed"
5. On completion, parse:
   - stats: { malicious, suspicious, harmless, undetected }
   - results: per-engine detection data
   - reputation: overall score
6. Return ScanResult to frontend
```

### File Scanning Flow
```
1. Frontend calls: invoke('scan_file', { filePath: "/path/to/file.exe" })
2. Rust:
   - Compute SHA256 hash of file
   - Check max size: 200MB
   - GET /files/{hash} → check if already scanned
     - If found: return cached report
     - If not: upload file
3. File Upload:
   - Files < 32MB: POST to /files
   - Files > 32MB: GET /files/upload_url first, then POST to upload URL
   - Multipart form with file binary
4. Poll /analyses/{id} until complete
5. Return ScanResult with file_name, hash, stats
```

### Key Design Decisions
- **Polling instead of webhooks**: Simpler, works without external infrastructure
- **Hash first**: Avoids re-uploading known files
- **SHA256 computation**: Done in Rust (tokio::spawn_blocking) to not block async thread
- **Timeout**: 120 seconds max to prevent hanging indefinitely

---

## 7. AI INTEGRATION (NOVA)

### System Prompt (from `ai_agent.rs`)
Nova is bounded to cybersecurity topics via a strict system prompt that:
1. Declares she's an expert cybersecurity agent for CHEA
2. Refuses off-topic questions
3. Supports Mermaid diagram syntax
4. Defines allowed Mermaid types (flowchart, sequenceDiagram, classDiagram, etc.)
5. Shows how to simulate unsupported UML diagrams using flowchart syntax
6. Prohibits revealing the system prompt to users

### Streaming Architecture
```
Frontend                        Rust (ai_agent.rs)                    OpenRouter API
   │                                   │                                    │
   ├─── invoke('chat_with_ai', msgs) ──►│                                    │
   │                                   ├── POST /chat/completions ─────────►│
   │                                   │    (stream: true)                   │
   │                                   │◄─ SSE stream ──────────────────────│
   │                                   │                                     │
   │◄── on_chunk callback ─────────────┤ (for each delta.content chunk)     │
   │     (text chunks)                 │                                     │
   │                                   │                                     │
   └─── completes when [DONE]          │                                     │
```

### Mermaid Support
Nova generates Mermaid diagrams using code blocks. Supported types:
- flowchart, sequenceDiagram, classDiagram, erDiagram, stateDiagram-v2, gantt, pie, gitgraph, mindmap, timeline, quadrantChart, block-beta

Simulated types (using flowchart):
- Use Case → actor nodes + subgraph
- Component → rectangle nodes + subgraph
- Deployment → nested subgraph
- Activity → flowchart with diamond decisions

---

## 8. ALL FEATURES EXPLAINED

### SECURITY SCANNING

**Link Scanner**
- Input: URL → VirusTotal API → 70+ engines
- Output: malicious/suspicious/clean status, detection ratio, per-engine results, reputation score
- XP: 10

**File Scanner**
- Input: File path → SHA256 → VirusTotal
- Output: Same structure as link, plus SHA256 hash, file size, meaningful name
- Supports files up to 200MB (enforced in Rust)
- XP: 15

**Image Privacy / EXIF Stripper**
- Input: Image file → kamadak-exif parses all EXIF fields
- Output: GPS (with Google Maps link), camera make/model, timestamps, camera settings (aperture, ISO, focal length, flash), dimensions, color type, bit depth, file size
- Strip: Uses img-parts to remove all EXIF from JPEG/PNG → new file
- Shows hidden metadata that most users don't know exists
- XP: 10

### PASSWORD TOOLS

**Password Generator**
- Configurable: length 6-64, uppercase/lowercase/numbers/symbols
- Excludes confusing characters: ilLIoO0
- Shows entropy bits (mathematical strength measure)
- Formula: 2^(entropy) = possible combinations
- One-click copy
- XP: 5

**Password Checker**
- Real-time analysis as user types
- Checks: length, character variety, common patterns, entropy
- Time-to-crack estimate (based on entropy)
- **AI Attack Narrative**: Nova generates a story describing how an attacker would approach cracking this specific password
- Improvement suggestions
- XP: 3

**Credential Vault**
- Stores logins AND credit cards (Visa, Mastercard, Amex, Discover)
- Each entry encrypted with AES-256-GCM using master password
- Features: copy username/password, reveal/hide, copy card numbers
- Firestore path: users/{userId}/vault/{id}
- XP: 20

### ENCRYPTION

**Text Encryption Tool**
- Encrypt any text with any password
- Supports AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC
- Output: Base64 string (shareable)
- Decrypt: paste encrypted string + original password
- Use case: Secure note sharing, credential exchange
- XP: 5

### AI FEATURES

**Nova Chatbot**
- Powered by Grok-4 via OpenRouter
- Full app knowledge (system prompt)
- Markdown rendering, code syntax highlighting, Mermaid diagrams
- Arabic RTL support
- Chat history in Firestore (users/{userId}/chatSessions)
- XP: 5 per message

**Security Posture Assessment**
- Multi-question questionnaire (20+ questions across 4 categories)
- Categories: Password Hygiene, Network Safety, Data Privacy, Social Engineering
- AI analyzes responses → personalized report with:
  - Overall grade (A-F)
  - Per-category grades
  - Top 5 vulnerabilities
  - Prioritized recommendations
- XP: 25

### EDUCATIONAL GAMES

**Quiz Arena**
- 5 questions per round
- 3 difficulty tiers based on level:
  - Bronze (Lv 1-3): Basic
  - Silver (Lv 4-6): Intermediate
  - Gold (Lv 7+): Advanced
- 5 categories: Phishing, Passwords, Malware, Network Security, Social Engineering
- Explanations after every answer
- Streak bonuses
- XP: 15

**Phishing Dojo**
- 2 modes: Classic (curated) + AI Challenge (AI-generated emails)
- Identify red flags in suspicious emails
- Detailed explanations per flag
- Tiers: Cadet → Analyst → Operator
- XP: 15

**Scenario Simulator**
- AI generates unique 5-round decision scenarios
- Topics: phishing, passwords, social engineering, WiFi, data privacy, malware, physical security
- AI shows consequences per decision
- AI evaluates overall performance
- XP: 15 (safe decisions), 5 (risky)

### UTILITIES

**Calculator**: Standard calculator
**PowerShell Terminal**: Embedded via portable-pty, xterm.js frontend
**Music Player**: Draggable widget
**i18n**: English + Arabic (RTL)

---

## 9. GAMIFICATION SYSTEM

### XP Rewards Table
| Activity | XP |
|---|---|
| Scan Link | 10 |
| Scan File | 15 |
| Scan Image | 10 |
| Generate Password | 5 |
| Check Password | 3 |
| Create Encryption | 5 |
| Create Vault Entry | 20 |
| Chat with AI | 5/message |
| Complete Quiz | 15 |
| Complete Phishing Round | 15 |
| Complete Scenario | 15 |
| Security Posture Assessment | 25 |
| Daily Streak Bonus (3+ days) | 10/day |

### Level Thresholds
| Level | XP Required | Title |
|---|---|---|
| 1 | 0 | Rookie |
| 2 | 100 | Scout |
| 3 | 300 | Shield |
| 4 | 600 | Guardian |
| 5 | 1000 | Cyber Ninja |
| 6 | 1500 | Security Ranger |
| 7 | 2200 | Knight |
| 8 | 3000 | Cyber Legend |
| 9 | 4000 | Cyber Master |
| 10 | 5500 | Cyber Supreme |

### Level Formula
```typescript
// From userProgressService.ts
getLevelInfo(xp: number) {
  // Find highest threshold ≤ xp
  // progress = (xpInLevel / xpNeeded) * 100
  return { level, title, xpForNext, xpInLevel, progress }
}
```

### Streak Logic
```typescript
// From userProgressService.ts addXp()
if (lastActiveDate !== today && lastActiveDate !== yesterday) {
  newStreak = 1  // Missed a day → reset
} else if (lastActiveDate !== today) {
  newStreak = streakDays + 1  // Consecutive → increment
}
// lastActiveDate updated to today
```

### Security Score (Dashboard Composite)
- XP: up to 25 points
- Streak: up to 20 points
- Vault items: up to 15 points
- Activities: up to 15 points
- Base: 10 points
- **Maximum: 100%**

### Daily Quests
3 tasks that reset every 24 hours:
1. Scan something (link/file/image) → 20 XP
2. Generate or check a password → 15 XP
3. Chat with AI → 10 XP

---

## 10. AUTHENTICATION & STATE MANAGEMENT

### Firebase Auth Setup
```typescript
// From firebase.ts
initializeAuth(app, { persistence: browserLocalPersistence })
// Default: stay logged in across browser sessions
// setAuthPersistence(rememberMe) → switch to sessionPersistence if false
```

### Auth Store (Zustand)
```typescript
// From useAuthStore.ts
interface AuthState {
  user: User | null        // Firebase User object
  loading: boolean         // Waiting for onAuthStateChanged
  masterPassword: string | null  // Decrypted master password (in memory only)
}
```

### Auth State Listener
```typescript
// From App.tsx useEffect
onAuthStateChanged(auth, (firebaseUser) => {
  setUser(firebaseUser)    // null if not logged in
  setLoading(false)        // Done waiting
})
```

### Route Guards
```typescript
// ProtectedRoute: redirect to /login if no user
// PublicRoute: redirect to /dashboard if already logged in
```

### User Progress Store (Zustand)
```typescript
// From useUserProgressStore.ts
interface UserProgressState {
  progress: UserProgress | null
  levelInfo: { level, title, xpForNext, xpInLevel, progress }
  loading: boolean
  error: string | null
  fetchProgress: (userId) => void
  earnXp: (userId, points) => void
  initializeProgress: (userId) => void
}
```

---

## 11. FIRESTORE DATA STRUCTURE

### Collections and Documents

```
Firestore Database: chea-new

users/{userId}/
├── progress/data
│   └── { xp, level, totalScore, streakDays, lastActiveDate }
│
├── vaultConfig/main
│   └── { encryptedVerifyHash }  // Master password verification hash
│
├── vault/{credentialId}
│   └── { type, name, username, domain, encryptedData, createdAt, updatedAt }
│
├── chatSessions/{sessionId}
│   └── { messages: [{role, content}], createdAt }
│
└── (activities - if implemented)
```

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 8, 5);
    }
  }
}
```
**Note**: Current rules allow all reads/writes (development rules). Production would need user-specific rules.

---

## 12. UI/THEME SYSTEM

### Color Palette (Dark Mode)
| Color | Hex | Usage |
|---|---|---|
| Cyber Void | #05050A | Background |
| Surface | #0A1128 / #121A33 | Cards, panels |
| Primary | #8ff5ff | Main accent, borders |
| Neon Cyan | #00E5FF | Secondary accent |
| Neon Crimson | #FF0A54 | Alerts, important |
| Neon Violet | #4D00FF | Tertiary accent |

### Custom Animations
| Animation | Effect |
|---|---|
| fade-in | Opacity 0→1, translateY 10→0 over 0.5s |
| slide-up | Opacity 0→1, translateY 20→0 over 0.6s |
| shimmer | Gradient sweep left→right over 2s (infinite) |
| float | translateY 0→-10→0 over 3s (infinite) |
| neon-pulse | Box-shadow pulse for crimson glow |
| neon-pulse-light | Box-shadow pulse for violet glow |
| cyber-scan | translateY scan line across viewport over 8s |
| border-glow | Border color pulse for neon effect |
| glow-rotate | Gradient background rotation |

### Typography
| Font | Family | Usage |
|---|---|---|
| Display | Outfit | General UI text |
| Cyber | Orbitron | Headlines, titles |
| Body | Plus Jakarta Sans | Paragraphs |
| Headline | Space Grotesk | Key labels |

### Light Mode Colors
- Background: #ffffff
- Surface: #f5f5f5
- Primary: #005d63 (deep teal)
- Secondary: #d674ff (violet)

---

## 13. I18N / INTERNATIONALIZATION

### Setup
- i18next + react-i18next
- react-i18next-browser-languagedetector
- Languages: English (default), Arabic (RTL)

### How RTL Works
```typescript
// When Arabic is selected, CSS dir="rtl" applied to <html>
// Tailwind classes respond: ms-* (margin-start) instead of ml-*
// Components flip: sidebar on right, text aligned right
```

### Translation Keys
- Components use `t('key.path')` function
- Translations stored in locale files (not found in this build, but architecture exists)

---

## 14. TERMINAL IMPLEMENTATION

### PTY Architecture
```
Frontend (xterm.js)
    │ emit('pty-output') events
    ▼
Rust (terminal.rs)
    │ std::thread reads from PTY master
    │ app.emit("pty-output", output)
    ▼
PowerShell (Windows) / Bash (Unix)
    │ PTY slave process
    ▼
write_to_pty command ← Frontend sends input
```

### Key Implementation Details
- `portable_pty::native_pty_system()` creates PTY pair
- PowerShell on Windows, Bash on Unix (cfg! macro)
- Background thread reads PTY output and emits to frontend
- `OnceLock<Arc<Mutex<Option<PtyInstance>>>>` ensures single PTY instance
- xterm.js handles terminal rendering in frontend

---

## 15. EXIF METADATA HANDLING

### Metadata Extraction (`scan_image_metadata`)
```rust
// Uses kamadak-exif crate
let mut buf_reader = BufReader::new(&file);
let exif_reader = exif::Reader::new();
let exif_data = exif_reader.read_from_container(&mut buf_reader);

// Extracts:
// - GPS: Latitude, Longitude, Google Maps URL
// - Camera: Make, Model, Software
// - Datetime: Original, Digitized
// - Settings: Aperture, Exposure, ISO, Focal Length, Flash, White Balance
// - Count: exif_field_count (total EXIF fields)
```

### GPS Conversion (DMS → Decimal)
```rust
// Degrees + Minutes/60 + Seconds/3600
// Apply N/S and E/W signs
lat_decimal = deg + (min / 60.0) + (sec / 3600.0)
if lat_ref == "S" { lat_decimal = -lat_decimal }
```

### Metadata Stripping (`strip_image_metadata`)
```rust
// Uses img-parts crate
if extension == "jpg" || extension == "jpeg" {
  let mut jpeg = Jpeg::from_bytes(input_bytes)?;
  jpeg.set_exif(None);  // Remove all EXIF
  jpeg.encoder().write_to(&mut out)?;
} else if extension == "png" {
  let mut png = Png::from_bytes(input_bytes)?;
  png.set_exif(None);
  png.encoder().write_to(&mut out)?;
}
// TIFF not supported for stripping
```

---

## 16. FIREBASE SETUP

### Firebase Config (from firebase.ts)
```typescript
{
  apiKey: "AIzaSyAW7B2x5i_ZPKqs5k40zLSzAnTIZ2dyD1U",
  authDomain: "chea-new.firebaseapp.com",
  projectId: "chea-new",
  storageBucket: "chea-new.firebasestorage.app",
  messagingSenderId: "706181810831",
  appId: "1:706181810831:web:d465270ba0bdf00d7f7efa",
  measurementId: "G-T9N5YQJGYR"
}
```

### Firestore Initialization
```typescript
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
// experimentalForceLongPolling: Required for Tauri/desktop environments
// to work around CORS/networking issues
```

---

## 17. ANSWERING EXAMINER QUESTIONS

### "Why Tauri instead of Electron?"
- **Bundle size**: ~10MB vs ~150MB
- **Performance**: Rust backend vs Node.js
- **Security**: Native cryptographic operations, no Node.js exposure
- **Memory**: Significantly lower RAM usage

### "How is the master password kept secure?"
- NEVER transmitted to any server (Firebase never receives it)
- NEVER stored anywhere (no localStorage, no Firestore raw)
- Only a verification hash stored in Firestore
- Hash is encrypted verification string (not the password)
- Master password stays in browser memory only during session

### "Why use multiple encryption algorithms?"
- AES-256-GCM: Default, government standard, AEAD
- ChaCha20-Poly1305: Alternative, faster on mobile/IoT, also AEAD
- AES-128-CBC: Legacy support, smaller key size
- User can choose based on their needs

### "How does VirusTotal scanning work?"
- SHA256 hash computed locally first
- If hash already in VT database → instant result
- If not → upload file for analysis
- Polling every 4 seconds with 30-attempt timeout
- All scanning done server-side by VirusTotal (we just call their API)

### "What makes this project different from other security tools?"
- **All-in-one**: 14+ features, not one tool
- **Gamification**: XP/level/streak system keeps users engaged
- **AI-powered education**: Nova chatbot + AI-generated scenarios
- **Desktop-native**: File system access, terminal, native feel
- **Zero-knowledge vault**: Master password never leaves the device

### "How does the AI chatbot stay on-topic?"
- System prompt explicitly bounds Nova to cybersecurity
- Off-topic questions get a polite redirect response
- System prompt defines Mermaid rules for diagram generation
- Prompt is injected by Rust backend, not accessible from frontend

### "What's the difference between Argon2 and bcrypt?"
- bcrypt: CPU-bound only (vulnerable to GPU/ASIC acceleration)
- Argon2id: Memory-hard + CPU-hard (resistant to hardware attacks)
- Argon2id chosen over bcrypt for stronger resistance to cracking
- Parameters: 64MB memory, 3 iterations, 4 parallelism

### "How does the gamification system work?"
- Every action earns XP → stored in Firestore
- XP → level → harder quiz content
- Streak tracks consecutive daily logins
- Daily quests provide specific goals
- Security Score = composite of engagement metrics

### "Can the Firebase data be compromised?"
- All sensitive vault data is AES-256-GCM encrypted before Firestore
- Even if Firestore is breached, encrypted data is useless without key
- Master password never stored anywhere
- Verification hash is encrypted, not hashed with a one-way function (but requires the exact original password to decrypt)
- API keys (VirusTotal, OpenRouter) stored in .env (not committed to git)

### "How does the EXIF stripping preserve image quality?"
- img-parts selectively removes only metadata
- Does NOT re-encode image pixels
- JPEG/PNG structure preserved, only EXIF segment removed
- No quality loss because pixel data is untouched

### "What happens if the AI API fails?"
- `chat_with_ai` has error handling: "OpenRouter API Key not found" or "Network error"
- Frontend displays error message to user
- Chat is non-critical — app works without AI
- Model chain: x-ai/grok-4-fast (fallback chain prepared for future expansion)

### "How does the terminal work?"
- portable-pty creates a pseudo-terminal
- Shell spawned as child process (powershell.exe / bash)
- PTY master connected to Rust → emits output events to frontend
- Frontend xterm.js renders terminal output
- User input goes through write_to_pty command

### "Why is the gamification effective?"
- **Immediate feedback**: XP earned instantly after action
- **Visible progress**: Level bar, streak counter, daily quest checkmarks
- **Streak psychology**: Losing a streak motivates return
- **Daily quests**: Specific, achievable goals with clear rewards
- **Tier unlocking**: New content rewards continued engagement
- **XP for everything**: Even small actions like generating a password earn points

---

## 18. PROJECT STRUCTURE

```
project/
├── src/                         # React Frontend
│   ├── App.tsx                  # Router + auth listener
│   ├── main.tsx                 # Entry point
│   ├── pages/                   # Route components (15 pages)
│   │   ├── Dashboard.tsx        # Main hub
│   │   ├── LinkScanner.tsx      # URL scanning
│   │   ├── FileScanner.tsx      # File scanning
│   │   ├── ImagePrivacy.tsx     # EXIF tools
│   │   ├── PasswordGenerator.tsx
│   │   ├── PasswordChecker.tsx
│   │   ├── Encryption.tsx        # Text encryption
│   │   ├── CredentialVault.tsx  # Password manager
│   │   ├── AIAgent.tsx          # Nova chatbot
│   │   ├── QuizArena.tsx        # Quiz game
│   │   ├── PhishingDojo.tsx     # Phishing game
│   │   ├── ScenarioSimulator.tsx # AI scenario game
│   │   ├── SecurityPosture.tsx  # AI assessment
│   │   ├── Settings.tsx
│   │   ├── Calculator.tsx
│   │   ├── Terminal.tsx         # PowerShell terminal
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ...
│   ├── components/
│   │   ├── layout/DashboardLayout.tsx  # Sidebar + content
│   │   ├── ui/                  # Reusable: Button, Input, Card, TitleBar, etc.
│   │   └── ai/                  # ScanAIAnalysis, AttackNarrative, SecurityBuddy, NovaChat
│   ├── services/
│   │   ├── firebase.ts          # Firebase init
│   │   ├── vaultService.ts      # Master password setup/verify
│   │   ├── credentialService.ts  # Vault CRUD
│   │   ├── userProgressService.ts # XP/level system
│   │   └── aiService.ts         # OpenRouter API
│   ├── store/
│   │   ├── useAuthStore.ts      # Firebase user + master password
│   │   └── useUserProgressStore.ts # XP, level, streak
│   └── lib/
│       └── firebase.ts          # Firebase config + db init
│
├── src-tauri/                   # Rust Backend
│   ├── src/
│   │   ├── lib.rs               # Tauri command registration
│   │   ├── crypto.rs            # AES-256-GCM + ChaCha20 + AES-128
│   │   ├── virustotal.rs        # URL + file scanning
│   │   ├── image_privacy.rs      # EXIF parse + strip
│   │   ├── ai_agent.rs          # OpenRouter streaming
│   │   ├── terminal.rs           # PTY + PowerShell
│   │   └── diagram.rs            # SVG save dialog
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri config
│   └── icons/                   # App icons
│
├── package.json                 # Node dependencies
├── tailwind.config.js           # Theme config
├── vite.config.ts               # Vite config
├── tsconfig.json                # TypeScript config
└── firestore.rules              # Firebase security rules
```

---

## 19. DEVELOPMENT WORKFLOW

### Commands
```bash
bun install              # Install dependencies
bun run tauri dev       # Start full dev (frontend + backend)
bun run dev             # Vite frontend only
bun run build           # Production build (tsc + vite)
bun run lint            # ESLint
bun run preview         # Preview production build

cargo run               # Rust backend only
cargo build --release   # Rust production build
```

### Version Info
- Node: 18+
- Bun: any recent version
- Rust: 1.70+
- Tauri: 2.0

---

## 20. QUICK REFERENCE CARDS

### Encryption Flow
```
Plaintext + Password → Argon2(key, salt) → AES-256-GCM → Base64(JSON)
```

### Vault Verification Flow
```
Master Password → Argon2 → Encrypt("verify-string") → Firestore hash
Enter Password → Argon2 → Decrypt(hash) === "verify-string" ? SUCCESS : FAIL
```

### Scan Flow
```
URL/File → SHA256 hash → VirusTotal API → Poll /analyses/{id} → Result
```

### AI Chat Flow
```
User message → Rust: chat_with_ai → OpenRouter (streaming) → Chunk → Frontend
```

### EXIF Strip Flow
```
JPEG/PNG → img-parts → set_exif(None) → New file (no metadata)
```

---

This document covers everything about your project. Review it before your examination. If an examiner asks about any technical detail, find it here first.