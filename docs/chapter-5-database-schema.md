## 5.1 Database Schema Design

CHEA uses Firebase Firestore as its primary cloud database, providing real-time synchronization, automatic scaling, and native integration with Firebase Authentication. The schema was designed to support five core functionality areas: credential storage, gamification tracking, activity logging, AI chat sessions, and daily task management.

### 5.1.1 Data Architecture Overview

All data in Firestore is organized under the `users/{userId}` path hierarchy, ensuring strict user data isolation. Each authenticated user has exclusive access to their own collection hierarchy through Firestore security rules. This design prevents cross-user data access and simplifies query patterns—all operations within a user's context are naturally scoped.

**Root-Level Collections:**
- `users` — Contains one document per registered user, identified by their Firebase Authentication UID
- Each user document contains six subcollections: `vault`, `vaultConfig`, `progress`, `dailyTasks`, `activities`, and `chatSessions`

### 5.1.2 Collection Definitions

#### **Vault Collection** (`users/{userId}/vault`)

Purpose: Stores encrypted credentials and payment card details

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `name` | String | Required | Display name for the credential (e.g., "GitHub", "School Email") |
| `username` | String | Required | Username or email associated with the account |
| `domain` | String | Optional | Website domain or service name |
| `type` | String | Required: `"login"` or `"card"` | Credential type discriminator |
| `encryptedData` | String | Required | Base64-encoded AES-256-GCM ciphertext containing sensitive data |
| `createdAt` | Timestamp | Auto-generated | Document creation timestamp |
| `updatedAt` | Timestamp | Auto-generated | Last modification timestamp |

**Security Implementation:** The `encryptedData` field stores the ciphertext produced by the Rust `crypto.rs` module using AES-256-GCM with Argon2id key derivation. The actual sensitive data (password for login credentials, or card number, holder name, expiry, and CVV for card types) never leaves the client device in plaintext. Only the encrypted blob is transmitted to Firestore.

**Sample Document Structure:**
```json
{
  "name": "GitHub",
  "username": "student@example.com",
  "domain": "github.com",
  "type": "login",
  "encryptedData": "eyJhbGciOiJBRVMyNTZLRE1NIiwiYWxnIjoiS2V5RGVyaXZhdGlvbjJEZXYifQ==...",
  "createdAt": "2025-04-10T14:30:00Z",
  "updatedAt": "2025-04-10T14:30:00Z"
}
```

#### **VaultConfig Collection** (`users/{userId}/vaultConfig/main`)

Purpose: Stores the encrypted master password verification hash for vault access control

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `encryptedVerifyHash` | String | Required | AES-256-GCM encrypted verification string |

**Access Control Flow:**
1. First-time setup: User sets a master password → System encrypts a fixed verification string (`"chea-vault-verification-string"`) → Stores the encrypted hash in Firestore
2. Unlock attempt: User enters master password → System decrypts stored hash → Compares against verification string → Access granted if match

This approach verifies the master password without ever storing it in plaintext or transmitting it to any server.

#### **Progress Collection** (`users/{userId}/progress/data`)

Purpose: Tracks user's gamification state including XP, level, streak, and overall score

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `xp` | Number | Default: 0 | Total accumulated experience points |
| `level` | Number | Range: 1-10 | Current user level based on XP thresholds |
| `totalScore` | Number | Default: 0 | Cumulative score across all activities |
| `streakDays` | Number | Default: 0 | Consecutive days of active engagement |
| `lastActiveDate` | String | ISO 8601 date | Last date the user was active |
| `createdAt` | Timestamp | Auto-generated | Progress document initialization timestamp |

**Level Progression Thresholds:**

| Level | XP Required | Title |
|-------|-------------|-------|
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

The exponential XP curve reflects gamification research indicating that higher levels should require progressively more effort to maintain long-term engagement (Pramod, 2025; Khairallah and Abu-Naseer, 2024).

#### **DailyTasks Collection** (`users/{userId}/dailyTasks/{date}`)

Purpose: Tracks daily task objectives with progress and completion status, keyed by ISO date (e.g., "2025-04-10")

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `date` | String | Required | ISO date string identifying the day |
| `tasks` | Array of Objects | Required | Array of seven daily task objects |
| `totalScore` | Number | Default: 0 | Sum of points earned from completed tasks |
| `maxScore` | Number | Default: 125 | Maximum achievable daily score |
| `createdAt` | Timestamp | Auto-generated | Document creation timestamp |

**Task Object Structure:**
```json
{
  "id": "scan_task",
  "type": "scan",
  "description": "Complete a scan",
  "target": 1,
  "current": 0,
  "points": 25,
  "completed": false
}
```

**Seven Daily Task Types:**
1. `scan` — Scan a link or file (target: 1, points: 25)
2. `generate_password` — Generate passwords (target: 2, points: 15)
3. `check_password` — Check password strength (target: 1, points: 10)
4. `create_credential` — Save a credential (target: 1, points: 30)
5. `generate_encryption` — Use encryption tool (target: 1, points: 15)
6. `quiz_round` — Complete a quiz round (target: 1, points: 15)
7. `phishing_round` — Complete a phishing round (target: 1, points: 15)

#### **Activities Collection** (`users/{userId}/activities`)

Purpose: Maintains a chronological log of all security actions performed by the user

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `type` | String | Required | Activity type identifier |
| `description` | String | Required | Human-readable activity label |
| `points` | Number | Required | XP value awarded for this activity |
| `metadata` | Map | Optional | Additional context data (e.g., URL scanned, score achieved) |
| `createdAt` | Timestamp | Auto-generated | Activity timestamp |

**Activity Types and Point Values:**

| Activity Type | Description | Points |
|---------------|-------------|--------|
| `scan_link` | Scanned a URL | 10 |
| `scan_file` | Scanned a file | 15 |
| `scan_image` | Scanned an image | 10 |
| `generate_password` | Generated a password | 5 |
| `check_password` | Checked password strength | 3 |
| `generate_encryption` | Encrypted text | 5 |
| `create_credential` | Saved a credential | 20 |
| `chat_ai` | Sent a message to AI assistant | 5 |
| `quiz_round` | Completed a quiz round | 15 |
| `phishing_round` | Completed a phishing round | 15 |
| `quiz_streak` | Quiz streak bonus | 10 |
| `phishing_streak` | Phishing streak bonus | 10 |

#### **ChatSessions Collection** (`users/{userId}/chatSessions`)

Purpose: Stores AI chatbot conversation sessions with nested message history

**Session Document Fields:**

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `title` | String | Required | Auto-generated title from first message |
| `createdAt` | Timestamp | Auto-generated | Session creation time |
| `updatedAt` | Timestamp | Auto-generated | Last message timestamp |

**Messages Subcollection** (`users/{userId}/chatSessions/{sessionId}/messages`):

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| `role` | String | Required: `"user"` or `"assistant"` | Message sender |
| `content` | String | Required | Message text content |
| `createdAt` | Timestamp | Auto-generated | Message timestamp |

### 5.1.3 Firestore Integration Challenges and Solutions

**Challenge:** WebView2 does not support Firestore's gRPC-web transport protocol, causing the standard Firestore SDK to fail for database write operations within the Tauri desktop environment.

**Solution:** Implemented a custom REST API helper (`firestore-rest.ts`) that performs Firestore database operations through standard HTTPS fetch calls with Firebase ID Token authentication. This workaround maintains full CRUD functionality while avoiding the gRPC incompatibility.

The helper provides:
- `firestoreGetDoc` — Retrieve a single document
- `firestoreSetDoc` — Create or update a document
- Bidirectional field type conversion between JavaScript objects and Firestore's REST API format

### 5.1.4 Security Considerations

1. **Client-Side Encryption:** All sensitive data (vault credentials, encrypted messages) is encrypted client-side using AES-256-GCM before transmission to Firestore. The decryption key (derived from the master password via Argon2id) never leaves the user's device.

2. **API Key Protection:** External service API keys (VirusTotal, OpenRouter) are stored exclusively in the Rust backend binary and are never exposed to the frontend JavaScript context or network traffic.

3. **User Data Isolation:** Firestore security rules ensure each user can only access their own `users/{userId}` path, preventing cross-user data leakage.

4. **Master Password Handling:** The vault master password is used only for local key derivation—it is never transmitted to any server. Vault access is verified by decrypting and checking a stored verification hash.

### 5.1.5 Complete Schema Summary

**Table 5.1: Firestore Database Schema Reference**

| Collection Path | Document ID | Field Name | Data Type | Constraints |
|-----------------|-------------|------------|-----------|-------------|
| `users/{userId}/vault` | Auto-generated | `name` | String | Required |
| | | `username` | String | Required |
| | | `domain` | String | Optional |
| | | `type` | String | Required: `"login"` \| `"card"` |
| | | `encryptedData` | String | Required (Base64) |
| | | `createdAt` | Timestamp | Auto |
| | | `updatedAt` | Timestamp | Auto |
| `users/{userId}/vaultConfig` | `main` | `encryptedVerifyHash` | String | Required |
| `users/{userId}/progress` | `data` | `xp` | Number | Default: 0 |
| | | `level` | Number | Range: 1-10 |
| | | `totalScore` | Number | Default: 0 |
| | | `streakDays` | Number | Default: 0 |
| | | `lastActiveDate` | String | ISO 8601 |
| | | `createdAt` | Timestamp | Auto |
| `users/{userId}/dailyTasks/{date}` | ISO date string | `date` | String | Required |
| | | `tasks` | Array | Required |
| | | `totalScore` | Number | Default: 0 |
| | | `maxScore` | Number | Default: 125 |
| | | `createdAt` | Timestamp | Auto |
| `users/{userId}/activities` | Auto-generated | `type` | String | Required |
| | | `description` | String | Required |
| | | `points` | Number | Required |
| | | `metadata` | Map | Optional |
| | | `createdAt` | Timestamp | Auto |
| `users/{userId}/chatSessions` | Auto-generated | `title` | String | Required |
| | | `createdAt` | Timestamp | Auto |
| | | `updatedAt` | Timestamp | Auto |
| `users/{userId}/chatSessions/{sessionId}/messages` | Auto-generated | `role` | String | Required: `"user"` \| `"assistant"` |
| | | `content` | String | Required |
| | | `createdAt` | Timestamp | Auto |