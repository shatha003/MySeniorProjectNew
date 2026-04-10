## 4.2 System Requirements

From our literature review of 26 peer-reviewed sources and a survey of 69 students, we identified what CHEA needed to actually do. This section lays out the functional and non-functional requirements we worked from.

### 4.2.1 Functional Requirements

These are the features CHEA had to implement. We derived them directly from the research gaps in the literature (Ibrahim et al., 2024; Zhang-Kennedy and Chiasson, 2021) and confirmed them through our survey — students genuinely want integrated security tools in one place, not scattered across different apps.

**Table 4.1: Functional Requirements**

| Req. ID | Requirement | Description |
|---------|-------------|-------------|
| FR-01 | Password Generation and Strength Analysis | The system shall allow users to generate cryptographically secure passwords with configurable parameters (length, character types) and analyse the strength of existing passwords by calculating entropy, estimating crack time, and detecting common patterns such as sequences, repeats, and known weak passwords. |
| FR-02 | Credential Vault with Encryption | The system shall provide an encrypted vault for storing login credentials and credit card details, protected by a user-defined master password. All sensitive data shall be encrypted client-side using AES-256-GCM before storage in the cloud database. The system shall support adding, viewing, copying, searching, and deleting credentials, and shall verify the master password without storing it in plaintext. |
| FR-03 | URL Link Scanning | The system shall allow users to submit URLs for security analysis via the VirusTotal API. The system shall display the scan result (malicious, suspicious, or clean), the number of detections from 70+ security engines, aggregate statistics (malicious, suspicious, harmless, undetected counts), and a community reputation score. The system shall maintain a scan history of the last 10 scans. |
| FR-04 | File Malware Scanning | The system shall allow users to scan files for malware by computing a local SHA-256 hash, checking the hash against VirusTotal's database, and uploading unknown files for analysis. The system shall display file metadata (name, size, hash), detection results from multiple engines, and provide quarantine or deletion actions for files identified as malicious. |
| FR-05 | Text Encryption and Decryption | The system shall allow users to encrypt and decrypt text messages using three algorithms: AES-256-GCM, ChaCha20-Poly1305, and AES-128-CBC. All key derivation shall use Argon2id with a random salt per operation. The system shall produce Base64-encoded output suitable for sharing and shall support round-trip encryption and decryption with password verification. |
| FR-06 | AI-Powered Cybersecurity Chatbot | The system shall provide an AI chatbot that answers cybersecurity-related questions via the OpenRouter API with streaming responses. The chatbot shall support multiple chat sessions, session history, markdown rendering, and Mermaid diagram generation. The system shall restrict the chatbot to cybersecurity and AI topics only. |
| FR-07 | Phishing Email Recognition Training | The system shall provide a gamified phishing identification exercise across three difficulty tiers (Cadet for levels 1-3, Analyst for levels 4-6, Operator for levels 7+). Each round shall present emails that users classify as phishing or legitimate, with detailed feedback including red flag explanations for each email. The system shall calculate XP based on correct identifications, streak bonuses, and completion bonuses. |
| FR-08 | Cybersecurity Knowledge Quiz | The system shall provide a quiz game with cybersecurity trivia questions across multiple difficulty tiers. The quiz shall track scores, award XP for correct answers with streak and completion bonuses, and log results to the user's activity history. |
| FR-09 | Image Privacy Scanner | The system shall scan JPEG and PNG images for EXIF metadata, extracting camera information, GPS coordinates (with Google Maps URL generation), timestamps, and camera settings. The system shall provide a metadata stripping function that removes all EXIF data while preserving the image pixel data. |
| FR-10 | Gamification and Progress Tracking | The system shall implement a gamification framework with experience points (XP), a 10-tier level progression system (Novice through Omniscient), daily streak tracking, and daily task objectives. XP shall be awarded for tool usage, quiz completion, and phishing identification. The system shall display real-time progress indicators including level title, XP progress bar, streak counter, and security score. |

### 4.2.2 Non-Functional Requirements

These are the quality constraints we had to meet. The literature pointed out gaps in age-appropriate design (Sağlam and Miller, 2023) and accessibility, so we paid extra attention to those areas.

**Table 4.2: Non-Functional Requirements**

| Req. ID | Category | Requirement |
|---------|----------|-------------|
| NFR-01 | Security | All sensitive user data (vault credentials, encrypted messages) shall be encrypted client-side using AES-256-GCM with Argon2id key derivation before transmission to the cloud database. API keys for external services (VirusTotal, OpenRouter) shall be stored exclusively in the Rust backend binary and shall not be exposed in the frontend JavaScript context or network traffic. |
| NFR-02 | Usability | The system interface shall be designed for students aged 9-15, using visual indicators (colour-coded strength meters, status badges), non-technical language, icon-based navigation, and a cyberpunk-themed aesthetic that appeals to younger users. All core features shall be accessible within three clicks from the dashboard. |
| NFR-03 | Performance | Local cryptographic operations (encryption, decryption, hashing, EXIF scanning) shall complete in under 500 milliseconds. Application cold start shall not exceed 5 seconds. Page navigation between dashboard sections shall complete in under 300 milliseconds. External API operations (VirusTotal scanning, AI chatbot) shall display loading indicators and shall timeout after 120 seconds. |
| NFR-04 | Reliability | The system shall handle API failures gracefully by displaying user-friendly error messages and providing retry mechanisms. The Firestore REST API workaround shall ensure database operations function correctly within the Tauri WebView2 environment. The AI chatbot shall implement model fallback to maintain service availability when the primary model is unavailable. |
| NFR-05 | Portability | The system shall be packaged as a native desktop application using Tauri v2, supporting Windows (via WebView2) and macOS (via WebKit) from a single codebase. The application binary shall not exceed 10 MB, and runtime memory usage shall remain below 200 MB under normal operation. |
| NFR-06 | Accessibility | The system shall support both light and dark mode themes, with automatic detection of the operating system's colour scheme preference. All interactive elements shall be reachable via keyboard navigation. Text shall maintain a minimum contrast ratio compliant with WCAG 2.1 AA guidelines. The interface shall support right-to-left (RTL) text rendering for Arabic language content. |
| NFR-07 | Maintainability | The frontend codebase shall be organised into a modular structure separating components, pages, services, stores, and utilities. All TypeScript code shall pass strict type-checking with zero `any` types. ESLint shall enforce consistent code style across the project. |
| NFR-08 | Privacy | The system shall not collect, transmit, or store any user data without explicit user action. The master password for the credential vault shall never be transmitted to any server. All encryption and decryption operations shall be performed exclusively on the user's local device via the Rust backend. |

---

## 4.3 System Models

To design CHEA properly, we needed clear models of how the system would work — how it's structured, how data flows through it, and how the database is organised. These models turned our requirements into something we could actually build from.

### 4.3.1 System Architecture

We went with a layered architecture because it keeps things clean: the UI doesn't need to know about crypto, the crypto code doesn't need to know about databases, and so on. We split CHEA into five layers. The full architecture is shown in `system-architecture.drawio` (see Figure 4.1).

**Figure 4.1: CHEA System Architecture** (Reference: `system-architecture.drawio`)

**Presentation Layer:** This is the React 18 + TypeScript frontend, rendered inside a Tauri WebView2 container. It includes the dashboard layout, all 11 feature pages (Link Scanner, File Scanner, Password Generator, Encryption Lab, Credential Vault, AI Agent, Quiz Arena, Phishing Dojo, Image Privacy), authentication forms, and the custom title bar. We used Tailwind CSS for styling with a cyberpunk/neon design system that supports both light and dark themes, and Framer Motion for page transition animations. The presentation layer talks only to the business logic layer through React component props, Zustand state stores, and Tauri IPC calls.

**Business Logic Layer:** This layer sits between the UI and the Rust backend. It's made up of Zustand stores (`useAuthStore`, `useActivityStore`, `useUserProgressStore`, `useDailyTasksStore`) and Firebase service modules (`vaultService`, `credentialService`, `chatService`, `activityService`, `userProgressService`, `dailyTasksService`, `quizService`, `phishingService`). It handles auth state, gamification logic (XP calculation, level progression, streak tracking), activity logging, and data formatting between frontend and backend. The `useTrackActivity` custom hook is the central piece here — whenever a user completes a security action, this hook logs the activity, awards XP, and updates daily tasks all at once.

**Backend Processing Layer:** This is the Rust side of things. We implemented it as a set of Tauri command modules that handle anything computationally heavy or security-sensitive — things we didn't want running in JavaScript. The modules are: `crypto.rs` (AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC encryption with Argon2id key derivation), `virustotal.rs` (URL and file scanning via VirusTotal API v3), `ai_agent.rs` (streaming chat via OpenRouter API with Server-Sent Events), `image_privacy.rs` (EXIF metadata scanning and stripping for JPEG/PNG), `terminal.rs` (pseudo-terminal emulation), and `diagram.rs` (Mermaid diagram export). The frontend calls these through Tauri's IPC mechanism (`invoke`), which serialises parameters as JSON and returns results asynchronously.

**Data Layer:** We used Firebase Firestore, a NoSQL cloud database. Data is organised hierarchically under `users/{userId}/`, with subcollections for vault credentials, chat sessions, user progress, daily tasks, and activity logs. One issue we ran into early on: WebView2 doesn't support Firestore's gRPC-web transport, so we had to build a custom REST API helper (`firestore-rest.ts`) that does database operations through standard HTTPS fetch calls with Firebase ID token auth. It was frustrating to debug, but it works reliably now.

**External Services Layer:** These are the third-party APIs CHEA connects to. VirusTotal API v3 handles URL and file threat analysis using 70+ security engines. OpenRouter API gives us access to large language models (we use Qwen 3.6 Plus) for the AI chatbot. Firebase Auth manages user authentication (email/password registration, login, password reset). All API keys are stored in the Rust backend — they never reach the frontend.

### 4.3.2 Use Case Model

We identified four main actors that interact with CHEA. The use case diagram is shown in `use-case-diagram.drawio` (see Figure 4.2).

**Figure 4.2: CHEA Use Case Diagram** (Reference: `use-case-diagram.drawio`)

**Actors:**

1. **Student (Primary Actor):** The main user, aged 9-15. They interact with all the security tools, educational features, and gamification elements. Everything in CHEA revolves around this actor.

2. **CHEA System:** The system itself acts as a secondary actor — it processes user inputs, manages state, runs cryptographic operations, and renders the UI.

3. **VirusTotal API:** An external system that receives URL and file scan requests from CHEA and returns threat analysis results including detection counts, engine-specific results, and reputation scores.

4. **OpenRouter AI API:** An external system that receives chat messages from CHEA and returns streaming cybersecurity educational responses via Server-Sent Events.

**Use Case Categories:**

*Security Tools:*
- UC-01: Generate Secure Password — The student configures password parameters (length, character types) and receives a cryptographically generated password.
- UC-02: Analyse Password Strength — The student inputs a password and receives an entropy-based strength rating with improvement suggestions.
- UC-03: Scan URL for Threats — The student submits a URL and receives a security analysis report from VirusTotal.
- UC-04: Scan File for Malware — The student selects a file and receives a malware detection report.
- UC-05: Encrypt/Decrypt Text — The student selects an encryption algorithm, enters a password and plaintext, and receives encrypted output (or vice versa for decryption).
- UC-06: Manage Credential Vault — The student sets up a master password, adds credentials, views decrypted data, copies fields, and deletes entries.
- UC-07: Scan Image Metadata — The student selects an image and receives EXIF data including GPS coordinates and camera settings.
- UC-08: Strip Image Metadata — The student selects an image and receives a cleaned version with all metadata removed.

*Educational Features:*
- UC-09: Chat with AI Assistant — The student asks cybersecurity questions and receives educational responses with streaming delivery.
- UC-10: Practise Phishing Identification — The student classifies emails as phishing or legitimate across difficulty tiers and receives feedback with red flag explanations.
- UC-11: Complete Cybersecurity Quiz — The student answers trivia questions and receives scores with XP rewards.

*System Operations:*
- UC-12: Register Account — The student creates an account with email and password.
- UC-13: Log In/Log Out — The student authenticates and manages sessions.
- UC-14: Track Progress — The system automatically awards XP, updates levels, tracks streaks, and manages daily tasks.

### 4.3.3 Data Flow Model

Here's how data actually flows through the system for our key features. The data flow diagram is shown in `data-flow-diagram.drawio` (see Figure 4.3).

**Figure 4.3: CHEA Data Flow Diagram** (Reference: `data-flow-diagram.drawio`)

**Process 1: URL Scanning**

URL scanning involves the frontend, Rust backend, and VirusTotal working together:

1. The student enters a URL in the Link Scanner interface (Data Store: User Input).
2. The React frontend validates the URL format and calls the Tauri IPC command `scan_url` with the URL as a parameter.
3. The Rust `virustotal.rs` module receives the URL, URL-encodes it, and submits a POST request to the VirusTotal `/urls` endpoint with the API key in the `x-apikey` header.
4. VirusTotal returns an analysis ID. The Rust module enters a polling loop, querying the `/analyses/{id}` endpoint at 4-second intervals.
5. When the analysis status becomes "completed," the Rust module parses the response into a `ScanResult` structure containing status, reputation, detections, and statistics.
6. The `ScanResult` is serialised as JSON and returned to the frontend via Tauri IPC.
7. The React frontend displays the results, logs the activity to Firestore (Data Store: Activity Log), awards XP to the user (Data Store: User Progress), and updates the daily task counter (Data Store: Daily Tasks).

**Process 2: Text Encryption**

The encryption pipeline runs entirely on the client side:

1. The student enters plaintext and a password in the Encryption Lab interface, and selects an algorithm (AES-256-GCM, ChaCha20-Poly1305, or AES-128-CBC).
2. The React frontend calls the Tauri IPC command `encrypt_text` with the plaintext, password, and algorithm.
3. The Rust `crypto.rs` module generates a random 16-byte salt using the OS cryptographic RNG (`OsRng`).
4. The module derives an encryption key from the password and salt using Argon2id (32 bytes for AES-256-GCM and ChaCha20-Poly1305, 16 bytes for AES-128-CBC).
5. A random nonce/IV is generated (12 bytes for GCM/ChaCha20, 16 bytes for CBC).
6. The plaintext is encrypted using the selected algorithm. For AES-128-CBC, PKCS#7 padding is applied.
7. The output (algorithm identifier, Base64-encoded salt, IV, and ciphertext) is serialised as a JSON `EncryptedPayload`, then Base64-encoded for transport.
8. The encrypted string is returned to the frontend and displayed to the student, who may copy it to the clipboard.

**Process 3: AI Chat Interaction**

The AI chat uses a streaming architecture so responses appear in real time:

1. The student types a message in the AI Agent chat interface.
2. The React frontend calls the Tauri IPC command `chat_with_ai` with the message and conversation history, passing a Tauri `Channel` for streaming.
3. The Rust `ai_agent.rs` module prepends the cybersecurity-only system prompt and sends a streaming POST request to the OpenRouter API.
4. OpenRouter returns a Server-Sent Events (SSE) stream. The Rust module reads `data:` lines, extracts content chunks from `choices[0].delta.content`.
5. Each content chunk is immediately sent to the frontend via the Tauri Channel, enabling character-by-character rendering.
6. The `data: [DONE]` marker signals stream completion.
7. The frontend renders the complete message with markdown formatting, logs the activity, and awards XP.

### 4.3.4 Entity Relationship Model

Our database uses Firebase Firestore, which is a NoSQL document database — so instead of traditional relational tables, we have collections and documents organised in a hierarchy. Here's how we structured it. The entity relationship diagram is shown in `entity-relationship-diagram.drawio` (see Figure 4.4).

**Figure 4.4: CHEA Entity Relationship Diagram** (Reference: `entity-relationship-diagram.drawio`)

All data lives under the `users/{userId}` path. This keeps each user's data isolated and makes queries within a user's context fast.

**Root Collection: `users`**

Each document in the `users` collection represents a registered user, with their Firebase Authentication UID as the document ID. This is the parent for all user-specific subcollections.

**Subcollection: `vault`**

The `vault` subcollection stores individual credential entries. Each document contains:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Display name for the credential (e.g., "GitHub", "School Email") |
| `username` | String | Username or email associated with the account |
| `domain` | String | Website domain or service name |
| `type` | String | Credential type: "login" or "card" |
| `encryptedData` | String | Base64-encoded encrypted payload containing the password or card details |
| `createdAt` | Timestamp | Document creation timestamp |

The `encryptedData` field stores the AES-256-GCM encrypted ciphertext produced by the Rust `crypto.rs` module. Only the encrypted payload is sent to Firestore — decryption always happens on the user's device.

**Subcollection: `vaultConfig`**

The `vaultConfig` subcollection contains a single document with the ID `main`, storing the vault master password verification hash:

| Field | Type | Description |
|-------|------|-------------|
| `encryptedVerifyHash` | String | AES-256-GCM encrypted verification string |

When the user sets up the vault, we encrypt a fixed verification string with their master password and store it. To unlock the vault, the system decrypts this hash and checks it against the expected value — so we can verify the master password without ever storing it in plaintext.

**Subcollection: `progress`**

The `progress` subcollection contains a single document with the ID `data`, storing the user's gamification state:

| Field | Type | Description |
|-------|------|-------------|
| `xp` | Number | Total experience points accumulated |
| `level` | Number | Current level (1-10) |
| `totalScore` | Number | Cumulative score across all activities |
| `streakDays` | Number | Consecutive days of activity |
| `lastActiveDate` | String | ISO date string of the last active day |
| `createdAt` | Timestamp | Progress document creation timestamp |

**Subcollection: `dailyTasks`**

The `dailyTasks` subcollection stores date-keyed documents (e.g., `2025-04-10`) containing the user's daily task progress:

| Field | Type | Description |
|-------|------|-------------|
| `tasks` | Array | Array of task objects, each containing `id`, `type`, `description`, `target`, `current`, `points`, and `completed` status |

Seven daily task types are defined: scan, generate_password, check_password, create_credential, use_encryption, play_quiz, and spot_phish.

**Subcollection: `activities`**

The `activities` subcollection stores an activity log with entries documenting each security action performed by the user:

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | Activity type (e.g., `scan_link`, `generate_password`, `quiz_round`) |
| `metadata` | Object | Additional context about the activity |
| `timestamp` | Timestamp | Time the activity was performed |

**Subcollection: `chatSessions`**

The `chatSessions` subcollection stores AI chat session metadata, with a nested `messages` subcollection for individual messages:

*Session document fields:*

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Session title (auto-generated from first message) |
| `createdAt` | Timestamp | Session creation time |
| `updatedAt` | Timestamp | Last message timestamp |

*Message document fields (within `chatSessions/{sessionId}/messages/`):*

| Field | Type | Description |
|-------|------|-------------|
| `role` | String | Message sender: "user" or "assistant" |
| `content` | String | Message text content |
| `timestamp` | Timestamp | Message timestamp |

The relationship between these entities is strictly hierarchical: a user owns multiple vault credentials, one vault configuration, one progress record, multiple daily task records, multiple activity log entries, and multiple chat sessions, each containing multiple messages. This parent-child structure enforces data isolation at the Firestore security rule level.

---

# Chapter 5: System Design

## 5.1 Database Schema Design

We chose Firebase Firestore as our database because it offers real-time sync, automatic scaling, and integrates natively with Firebase Auth — all things we needed. The schema was designed around CHEA's core functions: storing credentials, tracking gamification progress, logging activities, and managing AI chat sessions.

All data is scoped under `users/{userId}` so each user's data stays isolated. The complete Firestore schema is presented in Table 5.1.

**Table 5.1: Complete Firestore Database Schema**

| Collection Path | Document ID | Field Name | Data Type | Constraints | Description |
|-----------------|-------------|------------|-----------|-------------|-------------|
| `users/{userId}/vault` | Auto-generated | `name` | String | Required | Display name for the credential |
| | | `username` | String | Required | Username or email |
| | | `domain` | String | Optional | Website domain |
| | | `type` | String | Required: "login" \| "card" | Credential type |
| | | `encryptedData` | String | Required | Base64 AES-256-GCM ciphertext |
| | | `createdAt` | Timestamp | Auto | Creation timestamp |
| `users/{userId}/vaultConfig` | `main` | `encryptedVerifyHash` | String | Required | Encrypted master password verification string |
| `users/{userId}/progress` | `data` | `xp` | Number | Default: 0 | Total experience points |
| | | `level` | Number | Range: 1-10 | Current user level |
| | | `totalScore` | Number | Default: 0 | Cumulative score |
| | | `streakDays` | Number | Default: 0 | Consecutive active days |
| | | `lastActiveDate` | String | ISO 8601 date | Last activity date |
| | | `createdAt` | Timestamp | Auto | Initialisation timestamp |
| `users/{userId}/dailyTasks` | ISO date string (e.g., "2025-04-10") | `tasks` | Array of Objects | Required | Daily task list with id, type, description, target, current, points, completed |
| `users/{userId}/activities` | Auto-generated | `type` | String | Required | Activity identifier |
| | | `metadata` | Map | Optional | Activity context data |
| | | `timestamp` | Timestamp | Auto | Activity time |
| `users/{userId}/chatSessions` | Auto-generated | `title` | String | Required | Session title |
| | | `createdAt` | Timestamp | Auto | Session creation time |
| | | `updatedAt` | Timestamp | Auto | Last update time |
| `users/{userId}/chatSessions/{sessionId}/messages` | Auto-generated | `role` | String | Required: "user" \| "assistant" | Message sender |
| | | `content` | String | Required | Message text |
| | | `timestamp` | Timestamp | Auto | Message time |

For vault credentials, we use client-side encryption. When a user saves a credential, the Rust `crypto.rs` module encrypts the plaintext password with AES-256-GCM using the user's master password. Only the Base64-encoded ciphertext (`encryptedData`) gets sent to Firestore. This means even if Firestore were compromised, the stored credentials would still be encrypted and useless without the master password.

## 5.2 User Interface Design

We went with a cyberpunk/neon aesthetic because our target users are students aged 9-15, and we wanted something that feels more like a game than a security tool. The dark theme uses deep navy backgrounds with neon crimson accents and glowing UI elements. Navigation runs through a persistent sidebar with icon-labelled sections. Both light and dark themes are supported. Here are the five key interfaces.

### 5.2.1 Dashboard Interface

The Dashboard is the central hub — it's the first thing users see after logging in, and it gives them an overview of their security progress and gamification stats. It displays:

- **User Profile Section:** Shows the user's avatar (generated from initials), display name, and current level title with a colour-coded badge (Bronze for levels 1-3, Silver for 4-6, Gold for 7+).
- **XP Progress Bar:** An animated progress bar showing the user's current XP relative to the next level threshold, with the numerical XP value displayed.
- **Streak Counter:** Displays the number of consecutive active days with a flame icon, encouraging daily engagement.
- **Security Score:** A composite score (0-100) calculated from XP, streak days, vault items, activities, and completed tasks.
- **Daily Tasks Panel:** A list of seven daily objectives (scan a link, generate a password, check password strength, save a credential, use encryption, play quiz, spot phishing) with progress indicators and completion checkmarks.
- **Recent Activity Feed:** Displays the last 15 activities with icons, descriptions, and timestamps.
- **Quick Access Grid:** A grid of cards providing one-click navigation to all 11 security tools, organised by category (Scanning Tools, Password Tools, Encryption & Vault, Game Zone).

The flow is straightforward: the user logs in, lands on the Dashboard, and can navigate anywhere from there. Every action they complete automatically updates the XP, streak, and activity feed in real time.

### 5.2.2 Password Generator Interface

The Password Generator is a focused tool for creating cryptographically secure passwords. It includes:

- **Configuration Panel:** A set of controls including a length slider (6-64 characters), toggle switches for character types (uppercase, lowercase, numbers, symbols), an "exclude confusing characters" checkbox, and preset buttons (Easy: 8, Good: 12, Strong: 16, Super: 24).
- **Generated Password Display:** A large text field showing the generated password with a copy-to-clipboard button and a regenerate button.
- **Strength Indicator:** An animated colour-coded meter (Too Weak in red, Weak in orange, Fair in yellow, Strong in green, Very Strong in emerald, Super Strong in cyan) with entropy bits and character distribution information.
- **Educational Tips:** Contextual tips explaining why password length and character variety matter, displayed below the generator.

The user adjusts the settings and the password generates automatically (and regenerates whenever a setting changes). Copying the password awards +10 XP, logs the activity, and increments the daily task counter.

### 5.2.3 Link Scanner Interface

The Link Scanner checks URLs against VirusTotal. It includes:

- **URL Input Field:** A text input with a "Scan" button, featuring a link icon and placeholder text prompting the user to enter a URL.
- **Scan History:** A collapsible list of the last 10 scanned URLs with status badges (green checkmark for clean, red warning for malicious, yellow alert for suspicious).
- **Results Panel:** Upon scan completion, displays:
  - **Status Badge:** Large colour-coded badge showing "Clean," "Suspicious," or "Malicious."
  - **Statistics Summary:** Four stat cards showing counts for malicious, suspicious, harmless, and undetected engines.
  - **Reputation Score:** A numerical community reputation indicator.
  - **Engine Results Table:** A detailed table listing each security engine's detection result and category, sortable by engine name.

The user enters a URL and clicks "Scan." A loading animation plays while the Rust backend submits the URL to VirusTotal and polls for results (usually 12-18 seconds). Once done, the results panel animates in. The user earns +10 XP, the scan is logged, and the daily scan task is incremented.

### 5.2.4 Phishing Dojo Interface

The Phishing Dojo is a gamified training exercise for spotting phishing emails. It includes:

- **Difficulty Selection:** Three tier buttons (Cadet, Analyst, Operator) corresponding to the user's level range, each with a distinct colour and description.
- **Email Display:** A simulated email client view showing the sender name, sender email address, subject line, and body text of the current email, rendered in a realistic email layout.
- **Classification Buttons:** Two large buttons — "Phishing!" (red) and "Legitimate" (green) — for the user to classify the email.
- **Feedback Panel:** After classification, a detailed feedback section slides in showing:
  - **Correct/Incorrect Indicator:** Visual confirmation of whether the user's classification was correct.
  - **Red Flags List:** For phishing emails, a list of identified red flags with explanations (e.g., "Suspicious Sender," "Fake Domain," "Urgency Tactics").
  - **Explanation:** A paragraph explaining why the email is or is not phishing, written in student-friendly language.
- **Progress Tracker:** Shows the current round number, correct count, streak count, and accumulated XP for the session.

The user picks a difficulty tier (automatically matched to their level), and 5 emails are shown one at a time. They read each email and classify it, getting immediate feedback. After all 5, a summary screen shows the total score, XP earned (base XP + streak bonus + completion bonus), and an option to play again.

### 5.2.5 Credential Vault Interface

The Credential Vault stores login credentials and credit card details securely. It includes:

- **Vault Lock/Unlock Screen:** Before accessing the vault, the user must enter their master password. First-time users see a "Set Up Vault" flow where they create and confirm a master password. The vault uses an encrypted hash stored in Firestore to verify the password — the master password is never stored in plaintext.
- **Credential List:** A searchable list of stored credentials, each displayed as a card showing the service name, username (partially masked), and type icon (login or card).
- **Credential Detail View:** Clicking a credential expands it to show the full username (with copy button), password (masked by default, with reveal toggle and copy button), and domain. For card-type credentials, a visual card display with gradient background shows the card brand (Visa, Mastercard, Amex, Discover), number, and holder name.
- **Add Credential Form:** A form with fields for service name, username/email, password (with a built-in password generator), and credential type. All data is encrypted client-side before storage.
- **Delete Confirmation:** A confirmation dialog before removing a credential.

The user navigates to the Vault, enters their master password to unlock it, and views their saved credentials. They can add new credentials (encrypted with AES-256-GCM), copy usernames and passwords to the clipboard, reveal masked passwords, and delete entries. Each save action awards +10 XP.

## 5.3 Algorithm Design

This section covers the pseudocode for the core algorithms we implemented: password encryption/decryption, URL scanning with polling, and XP calculation with level progression.

### 5.3.1 Password Encryption and Decryption Algorithm

The encryption algorithm uses AES-256-GCM with Argon2id key derivation, implemented in the Rust `crypto.rs` module. We use the same algorithm for both the Encryption Lab feature and the Credential Vault.

**Algorithm 5.1: Encrypt Text with AES-256-GCM**

```
FUNCTION encrypt_text(plaintext, password, algorithm):
    // Step 1: Generate random salt (128 bits)
    salt ← generate_random_bytes(16)

    // Step 2: Derive encryption key using Argon2id
    IF algorithm = "AES-256-GCM" OR algorithm = "ChaCha20-Poly1305" THEN
        key_length ← 32
    ELSE IF algorithm = "AES-128-CBC" THEN
        key_length ← 16
    END IF
    key ← argon2id_derive(password, salt, key_length)

    // Step 3: Generate random nonce/IV
    IF algorithm = "AES-256-GCM" OR algorithm = "ChaCha20-Poly1305" THEN
        nonce ← generate_random_bytes(12)
    ELSE IF algorithm = "AES-128-CBC" THEN
        iv ← generate_random_bytes(16)
    END IF

    // Step 4: Encrypt plaintext
    IF algorithm = "AES-256-GCM" THEN
        ciphertext ← AES_256_GCM_encrypt(key, nonce, plaintext)
        // ciphertext includes 16-byte authentication tag
    ELSE IF algorithm = "ChaCha20-Poly1305" THEN
        ciphertext ← ChaCha20_Poly1305_encrypt(key, nonce, plaintext)
        // ciphertext includes 16-byte authentication tag
    ELSE IF algorithm = "AES-128-CBC" THEN
        padded_plaintext ← PKCS7_pad(plaintext, 16)
        ciphertext ← AES_128_CBC_encrypt(key, iv, padded_plaintext)
    END IF

    // Step 5: Build and serialise payload
    payload ← {
        alg: algorithm,
        salt: base64_encode(salt),
        iv: base64_encode(nonce OR iv),
        ct: base64_encode(ciphertext)
    }
    json_string ← serialise_to_json(payload)
    result ← base64_encode(json_string)

    RETURN result
END FUNCTION
```

**Algorithm 5.2: Decrypt Text**

```
FUNCTION decrypt_text(encoded_string, password):
    // Step 1: Decode outer Base64 layer
    json_bytes ← base64_decode(encoded_string)
    json_string ← utf8_decode(json_bytes)
    payload ← deserialise_from_json(json_string)

    // Step 2: Decode payload fields
    salt ← base64_decode(payload.salt)
    iv ← base64_decode(payload.iv)
    ciphertext ← base64_decode(payload.ct)

    // Step 3: Derive key using same parameters
    IF payload.alg = "AES-256-GCM" OR payload.alg = "ChaCha20-Poly1305" THEN
        key ← argon2id_derive(password, salt, 32)
    ELSE IF payload.alg = "AES-128-CBC" THEN
        key ← argon2id_derive(password, salt, 16)
    END IF

    // Step 4: Decrypt and verify
    IF payload.alg = "AES-256-GCM" THEN
        plaintext ← AES_256_GCM_decrypt(key, iv, ciphertext)
        // Authenticated decryption: fails if tampered
    ELSE IF payload.alg = "ChaCha20-Poly1305" THEN
        plaintext ← ChaCha20_Poly1305_decrypt(key, iv, ciphertext)
    ELSE IF payload.alg = "AES-128-CBC" THEN
        decrypted ← AES_128_CBC_decrypt(key, iv, ciphertext)
        plaintext ← PKCS7_unpad(decrypted)
    END IF

    // Step 5: Handle errors
    IF decryption_failed THEN
        RETURN error("Wrong password or corrupted data")
    END IF

    RETURN utf8_decode(plaintext)
END FUNCTION
```

One thing worth noting: every encryption operation generates a unique random salt and nonce. This means encrypting the same text with the same password produces different ciphertext each time. That's important because it prevents precomputation and rainbow table attacks. The AEAD modes (AES-256-GCM, ChaCha20-Poly1305) also provide authenticated encryption, so any tampering with the ciphertext is caught during decryption.

### 5.3.2 URL Scanning with VirusTotal Polling Algorithm

VirusTotal doesn't return scan results instantly — it gives you an analysis ID and you have to poll for the result. We implemented this polling mechanism in the Rust `virustotal.rs` module.

**Algorithm 5.3: Scan URL with Polling**

```
FUNCTION scan_url(target_url):
    // Step 1: Submit URL to VirusTotal
    client ← create_http_client(timeout = 120 seconds)
    encoded_body ← url_encode("url=" + target_url)

    response ← client.POST(
        url: "https://www.virustotal.com/api/v3/urls",
        headers: { "x-apikey": API_KEY, "content-type": "application/x-www-form-urlencoded" },
        body: encoded_body
    )

    IF response.status ≠ 200 THEN
        RETURN error("API error: " + response.body)
    END IF

    // Step 2: Extract analysis ID
    json ← parse_json(response.body)
    analysis_id ← json.data.id

    // Step 3: Poll for completion
    attempts ← 0
    max_attempts ← 30

    WHILE attempts < max_attempts DO
        sleep(4 seconds)
        attempts ← attempts + 1

        poll_response ← client.GET(
            url: "https://www.virustotal.com/api/v3/analyses/" + analysis_id,
            headers: { "x-apikey": API_KEY }
        )

        IF poll_response.status ≠ 200 THEN
            CONTINUE  // Retry on transient errors
        END IF

        poll_json ← parse_json(poll_response.body)
        status ← poll_json.data.attributes.status

        IF status = "completed" THEN
            // Step 4: Parse results
            stats ← poll_json.data.attributes.stats
            detections ← extract_detections(poll_json.data.attributes.results)

            scan_result ← {
                target: target_url,
                status: determine_status(stats.malicious, stats.suspicious),
                reputation: poll_json.data.attributes.reputation,
                detections: detections,
                stats: {
                    malicious: stats.malicious,
                    suspicious: stats.suspicious,
                    harmless: stats.harmless,
                    undetected: stats.undetected
                }
            }
            RETURN scan_result
        END IF
    END WHILE

    RETURN error("Scan timeout. Please try again later.")
END FUNCTION

FUNCTION determine_status(malicious_count, suspicious_count):
    IF malicious_count > 0 THEN RETURN "malicious"
    IF suspicious_count > 0 THEN RETURN "suspicious"
    RETURN "clean"
END FUNCTION
```

We poll at 4-second intervals with a maximum of 30 attempts, giving roughly 2 minutes total. In practice, most scans finish in 3-4 polls (12-16 seconds). We went with 4 seconds because VirusTotal's documentation recommends not polling too aggressively, and it felt like a good balance between responsiveness and not hammering their API. File scanning follows the same pattern but adds a preliminary SHA-256 hash check to skip the upload for files that have already been scanned.

### 5.3.3 XP Calculation and Level Progression Algorithm

The gamification system calculates XP awards and handles level progression. We implemented this in the TypeScript `userProgressService.ts` module.

**Algorithm 5.4: Calculate Phishing Dojo XP**

```
FUNCTION calculate_phishing_xp(correct_calls, streak, total_emails):
    // Base XP: 3 points per correct identification
    base_xp ← correct_calls × 3

    // Streak bonus: 1 point per consecutive correct answer beyond the first
    IF streak > 1 THEN
        streak_bonus ← (streak - 1) × 1
    ELSE
        streak_bonus ← 0
    END IF

    // Completion bonus: reward for identifying all or most emails correctly
    IF correct_calls = total_emails THEN
        completion_bonus ← 10  // Perfect score
    ELSE IF correct_calls ≥ 3 THEN
        completion_bonus ← 5   // Good performance
    ELSE
        completion_bonus ← 0
    END IF

    total_xp ← base_xp + streak_bonus + completion_bonus
    RETURN { base_xp, streak_bonus, completion_bonus, total_xp }
END FUNCTION
```

**Algorithm 5.5: Level Progression**

```
// Level thresholds (10 tiers)
LEVEL_THRESHOLDS ← [
    { level: 1, xp: 0, title: "Novice" },
    { level: 2, xp: 100, title: "Apprentice" },
    { level: 3, xp: 300, title: "Guardian" },
    { level: 4, xp: 600, title: "Defender" },
    { level: 5, xp: 1000, title: "Sentinel" },
    { level: 6, xp: 1500, title: "Champion" },
    { level: 7, xp: 2200, title: "Hero" },
    { level: 8, xp: 3000, title: "Legend" },
    { level: 9, xp: 4000, title: "Mythic" },
    { level: 10, xp: 5500, title: "Omniscient" }
]

FUNCTION get_level_info(total_xp):
    current_level ← LEVEL_THRESHOLDS[0]
    next_level ← LEVEL_THRESHOLDS[1]

    // Find highest threshold that XP meets or exceeds
    FOR i FROM LENGTH(LEVEL_THRESHOLDS) - 1 DOWNTO 0 DO
        IF total_xp ≥ LEVEL_THRESHOLDS[i].xp THEN
            current_level ← LEVEL_THRESHOLDS[i]
            IF i + 1 < LENGTH(LEVEL_THRESHOLDS) THEN
                next_level ← LEVEL_THRESHOLDS[i + 1]
            ELSE
                next_level ← LEVEL_THRESHOLDS[i]  // Max level
            END IF
            BREAK
        END IF
    END FOR

    xp_in_level ← total_xp - current_level.xp
    xp_needed ← next_level.xp - current_level.xp
    progress ← (xp_in_level / xp_needed) × 100

    RETURN { level, title, xp_for_next, xp_in_level, progress }
END FUNCTION

FUNCTION add_xp(user_id, points):
    progress ← fetch_user_progress(user_id)
    today ← current_date_iso_string()
    yesterday ← previous_day_iso_string()

    new_xp ← progress.xp + points
    level_info ← get_level_info(new_xp)

    // Streak logic
    IF progress.last_active_date ≠ today AND progress.last_active_date ≠ yesterday THEN
        new_streak ← 1  // Streak broken
    ELSE IF progress.last_active_date ≠ today THEN
        new_streak ← progress.streak_days + 1  // Streak continues
    ELSE
        new_streak ← progress.streak_days  // Already active today
    END IF

    updated_progress ← {
        xp: new_xp,
        level: level_info.level,
        totalScore: progress.totalScore + points,
        streakDays: new_streak,
        lastActiveDate: today
    }

    save_user_progress(user_id, updated_progress)
    RETURN updated_progress
END FUNCTION
```

The level thresholds increase exponentially — it takes more XP to advance at higher levels. We based this on gamification research (Pramod, 2025; Khairallah and Abu-Naseer, 2024) which shows that early levels should feel rewarding while higher levels need more effort to keep long-term engagement. The streak mechanism tracks consecutive active days and resets when a day is missed, which encourages students to open the app daily.

---

# Chapter 6: System Implementation and Testing

## 6.1 Development Environment

We built CHEA using a combination of TypeScript for the frontend and Rust for the native backend. Table 6.1 lists all the tools and frameworks we used.

**Table 6.1: Development Environment**

| Category | Tool/Framework | Version | Purpose |
|----------|---------------|---------|---------|
| Operating System | Windows 11 Pro | 23H2 | Development and testing platform |
| IDE | Visual Studio Code | Latest | Source code editing, debugging, Git integration |
| Frontend Language | TypeScript | 5.5.3 | Type-safe frontend development |
| UI Library | React | 18.3.1 | Component-based user interface rendering |
| Build Tool | Vite | 5.4.1 | Frontend bundling, HMR, production builds |
| CSS Framework | Tailwind CSS | 3.4.10 | Utility-first styling |
| State Management | Zustand | 4.5.0 | Global application state |
| Animation | Framer Motion | 11.3.0 | UI animations and page transitions |
| Backend Language | Rust | Edition 2021 | Native backend, cryptographic operations |
| Desktop Framework | Tauri | 2.10.1 | Desktop application runtime, IPC |
| Backend HTTP | reqwest | 0.13.2 | HTTP client for API calls |
| Crypto (AES-GCM) | aes-gcm | 0.10 | AES-256-GCM authenticated encryption |
| Crypto (ChaCha20) | chacha20poly1305 | 0.10 | ChaCha20-Poly1305 AEAD cipher |
| Crypto (AES-CBC) | aes + cbc | 0.8 / 0.1 | AES-128-CBC block cipher |
| Key Derivation | argon2 | 0.5 | Argon2id password-based key derivation |
| Hashing | sha2 | 0.10.9 | SHA-256 file hashing |
| Image Processing | image + kamadak-exif + img-parts | 0.24 / 0.6.1 / 0.4.0 | Image decoding, EXIF parsing, metadata stripping |
| Package Manager (JS) | Bun | Latest | JavaScript dependency management, script runner |
| Package Manager (Rust) | Cargo | Latest | Rust dependency management, compilation |
| Database | Firebase Firestore | 12.10.0 | Cloud NoSQL database |
| Authentication | Firebase Auth | 12.10.0 | User authentication |
| Routing | React Router DOM | 6.26.0 | Client-side routing |
| Icons | Lucide React | 0.577.0 | UI icon library |
| Terminal Emulation | xterm.js | 6.0.0 | In-app terminal |
| PTY | portable-pty | 0.8 | Pseudo-terminal for backend shell |
| Version Control | Git | Latest | Source code management |

## 6.2 Implementation Details

### 6.2.1 Rust Backend Modules

We implemented the backend as six Tauri command modules in Rust, registered in `lib.rs` and exposed to the frontend through Tauri's IPC `invoke` mechanism.

**Cryptography Module (`crypto.rs`):** This implements three encryption algorithms (AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC) with Argon2id key derivation. Every encryption operation generates a random 16-byte salt and an algorithm-appropriate nonce using the OS cryptographic RNG (`OsRng`). The output is serialised as a JSON `EncryptedPayload` and Base64-encoded. Decryption reverses the process and validates authentication tags (for AEAD modes) or PKCS#7 padding (for CBC mode). We used the `aes-gcm`, `chacha20poly1305`, `aes`, `cbc`, `argon2`, `base64`, and `rand` crates.

**VirusTotal Module (`virustotal.rs`):** This handles URL and file scanning through the VirusTotal v3 REST API. For URL scanning, it submits the target to `/urls`, gets back an analysis ID, and polls `/analyses/{id}` every 4 seconds (up to 30 attempts). For file scanning, it first computes a local SHA-256 hash (reading in 8 KB chunks), checks the hash against `/files/{hash}` for cached results, and only uploads files that aren't already in VirusTotal's database. The HTTP client has a 120-second timeout.

**AI Agent Module (`ai_agent.rs`):** This implements streaming chat through the OpenRouter API using Tauri's `Channel<String>` IPC mechanism. A system prompt restricts the AI to cybersecurity topics only. Responses stream in via Server-Sent Events (SSE), with each content chunk forwarded to the frontend in real time. We also added a model fallback chain so if the primary model is down, the chatbot still works. The OpenRouter API key is loaded from environment variables via `dotenvy`.

**Image Privacy Module (`image_privacy.rs`):** This scans EXIF metadata using the `kamadak-exif` crate and strips metadata using the `img-parts` crate. Scanning extracts camera data, GPS coordinates (with DMS-to-decimal conversion and Google Maps URL generation), timestamps, and camera settings. Stripping removes all EXIF segments from JPEG and PNG files while keeping the pixel data intact.

**Terminal Module (`terminal.rs`):** This creates a pseudo-terminal (PTY) using the `portable-pty` crate, spawning PowerShell on Windows or Bash on Unix. PTY output is read in 4 KB chunks on a background thread and emitted as Tauri events for the frontend xterm.js renderer.

### 6.2.2 React Frontend Components

The frontend is a single-page application with 13 feature pages, 8 reusable UI components, and 9 service modules. Key details:

- **Routing:** React Router DOM v6 with nested routes, `ProtectedRoute` and `PublicRoute` guards, and `DashboardLayout` as the parent layout for all authenticated pages.
- **State Management:** Four Zustand stores (`useAuthStore`, `useActivityStore`, `useUserProgressStore`, `useDailyTasksStore`) manage authentication, activity logging, gamification progress, and daily tasks respectively.
- **Activity Tracking:** The `useTrackActivity` custom hook centralises gamification by logging activities, awarding XP, and incrementing daily task counters in a single call.
- **Firebase Integration:** Firebase Auth SDK for authentication; Firestore SDK with `experimentalForceLongPolling: true` for real-time operations; custom REST API helper (`firestore-rest.ts`) for standard CRUD operations to work around the WebView2 gRPC-web incompatibility.
- **Theme System:** `ThemeProvider` context supporting dark, light, and system modes, persisted in `localStorage`.

### 6.2.3 Firebase Integration

We set up Firebase with Authentication (email/password provider) and Cloud Firestore. The Firestore REST API workaround was something we had to build out of necessity — WebView2 doesn't support Firestore's gRPC-web transport, so the standard Firestore SDK wouldn't work for writes. Our custom helper provides `firestoreGetDoc` and `firestoreSetDoc` functions using standard `fetch()` calls with Firebase ID token auth, and handles bidirectional field type conversion between JavaScript objects and Firestore's typed REST format.

## 6.3 Security Testing

We ran security tests to verify that our crypto implementation actually works, that data is properly protected, and that the app resists common attacks. All tests were done manually on the running application.

**Table 6.2: Security Test Results**

| Test ID | Test Category | Test Description | Method | Expected Result | Actual Result | Status |
|---------|--------------|-----------------|--------|-----------------|---------------|--------|
| SEC-01 | Input Validation | URL scanner rejects malformed input | Enter `<script>alert('xss')</script>` as URL | Input treated as literal text, no script execution | String passed to VirusTotal as literal URL, no execution | Pass |
| SEC-02 | Input Validation | Chat input resists XSS | Send `<img onerror="alert('xss')" src=x>` to AI chat | HTML rendered as text or sanitised | Content displayed as plain text in markdown renderer | Pass |
| SEC-03 | Encryption Verification | AES-256-GCM uniqueness | Encrypt "test" with same password twice | Different ciphertext outputs each time | Each encryption produced unique Base64 output | Pass |
| SEC-04 | Encryption Verification | Tamper detection (AEAD) | Modify 1 byte in ciphertext, attempt decryption | Decryption fails with authentication error | "Decryption failed — wrong password or corrupted data" | Pass |
| SEC-05 | Encryption Verification | Wrong password rejection | Encrypt with password A, decrypt with password B | Decryption fails | Decryption fails with error message | Pass |
| SEC-06 | API Security | VirusTotal API key not in frontend | Search compiled JS bundle for API key | API key not found in frontend code | API key only present in Rust binary | Pass |
| SEC-07 | API Security | OpenRouter API key not exposed | Inspect frontend source for hardcoded key | No hardcoded API key in frontend | Key loaded via `dotenvy` in Rust backend only | Pass |
| SEC-08 | Authentication | Unauthenticated access prevention | Navigate to `/dashboard` without logging in | Redirected to `/login` | `ProtectedRoute` guard redirects to login page | Pass |
| SEC-09 | Session Management | Session persistence after restart | Close and reopen application while logged in | User remains authenticated | Session persisted via Firebase `browserLocalPersistence` | Pass |
| SEC-10 | Data Protection | No plaintext passwords in Firestore | Inspect Firestore vault documents | All password fields contain ciphertext only | Only `encryptedData` with Base64 strings found | Pass |
| SEC-11 | Data Protection | Master password not stored | Search all Firestore collections for master password | Master password not found in any document | Only encrypted verification hash found | Pass |
| SEC-12 | Data Protection | Vault unlock with wrong password | Enter incorrect master password | Access denied, vault remains locked | "Wrong password" error shown | Pass |

The security tests gave us confidence in a few key areas. The AES-256-GCM and ChaCha20-Poly1305 authentication tags correctly catch any ciphertext modification (SEC-04). API keys stay isolated in the Rust binary and never reach the frontend (SEC-06, SEC-07). Since CHEA is a desktop app using WebView2, it's inherently resistant to traditional web-based XSS and SQL injection — we don't use SQL, and React's default JSX escaping prevents script injection in rendered content.

## 6.4 Performance Testing

We tested performance on a Windows 11 Pro machine with an Intel Core i7-12700H processor (14 cores, 20 threads), 16 GB DDR5 RAM, and NVMe SSD, connected via 100 Mbps fibre. We timed each operation using browser developer tools and took the average of 5 consecutive runs.

**Table 6.3: Performance Test Results**

| Operation | Input Parameters | Expected Time | Actual Time (Avg) | Analysis |
|-----------|-----------------|---------------|-------------------|----------|
| Password generation | 20 chars, all types | < 10 ms | < 5 ms | Cryptographically secure random generation is near-instantaneous |
| AES-256-GCM encryption | 1 KB plaintext | < 100 ms | < 50 ms | Includes Argon2id key derivation; well within threshold |
| AES-256-GCM decryption | 1 KB ciphertext | < 100 ms | < 50 ms | Performance comparable to encryption |
| ChaCha20-Poly1305 encryption | 1 KB plaintext | < 100 ms | < 50 ms | Comparable to AES-256-GCM without AES-NI |
| AES-128-CBC encryption | 1 KB plaintext | < 100 ms | < 45 ms | Slightly faster due to smaller key size |
| AES-256-GCM encryption | 100 KB plaintext | < 200 ms | < 80 ms | Negligible increase for larger inputs |
| SHA-256 file hashing | 1.2 MB PDF | < 200 ms | 80 ms | 8 KB chunk reading prevents memory issues |
| Photo EXIF scan | 4 MB JPEG with GPS | < 500 ms | 350 ms | Includes image decoding and EXIF parsing |
| Photo EXIF strip | 4 MB JPEG | < 500 ms | 420 ms | Read, parse, strip, and write pipeline |
| URL scan (clean) | `https://www.google.com` | < 30 s | 12.4 s | Includes 3-4 polling rounds at 4-second intervals |
| URL scan (malicious) | Known phishing URL | < 30 s | 14.8 s | Slightly longer due to larger result set |
| File scan (cached) | 1.2 MB PDF | < 5 s | 1.2 s | Hash matched, cached report returned |
| File scan (new upload) | 15 MB ZIP | < 60 s | 22.3 s | Hash + upload + polling time |
| AI chatbot first token | "What is phishing?" | < 5 s | 2.1 s | Time to first streamed token from OpenRouter |
| AI chatbot full response | ~200 words | < 15 s | 8.5 s | Total streaming time |
| App cold start | Launch from desktop | < 5 s | 3.2 s | WebView2 initialisation included |
| App warm start | Reopen after close | < 3 s | 1.8 s | WebView2 runtime cached |
| Page navigation | Click sidebar item | < 300 ms | < 200 ms | React Router with Framer Motion transitions |

The local operations — encryption, hashing, EXIF processing, password generation — all come in well under the 500 ms target. This is where using Rust really pays off: compute-heavy tasks run fast without blocking the UI. The main bottleneck is external API latency. VirusTotal scans take 12-22 seconds because of the polling mechanism, and AI chatbot responses depend on OpenRouter's inference time (2-9 seconds). These are inherent to the external services and not something we can optimise on our end. We mitigated the wait with loading indicators and async operations so the app stays responsive.

## 6.5 Usability Testing

### 6.5.1 Testing Approach

We tested the app with 12 participants from our target demographic (students aged 9-15) along with a few adult evaluators. We gave them six specific security tasks to complete and observed how they interacted with the app — no prior training, just natural exploration. An observer recorded completion times, errors, and qualitative feedback.

### 6.5.2 Task Scenarios

Participants completed the following tasks:

1. **Scan a Link:** Navigate to the Link Scanner and check a provided URL for safety.
2. **Generate a Strong Password:** Create a 16-character password for an email account.
3. **Encrypt a Message:** Encrypt a given message with a provided password using AES-256-GCM.
4. **Identify Phishing Emails:** Complete a round in the Phishing Dojo at the Cadet difficulty.
5. **Check Photo Metadata:** Scan a provided JPEG image for hidden location data.
6. **Save a Credential:** Add a login credential to the vault.

### 6.5.3 Results

**Table 6.4: Usability Testing Results**

| Evaluation Criterion | Average Rating (n=12) | Interpretation |
|---------------------|----------------------|----------------|
| Ease of use | 4.5 / 5 | Participants found the interface intuitive |
| Visual appeal | 4.7 / 5 | The cyberpunk theme was well-received |
| Task completion rate | 4.3 / 5 | Most tasks completed on first attempt |
| Error recovery | 3.8 / 5 | Vault setup required guidance for younger users |
| Learning value | 4.6 / 5 | Participants reported learning new concepts |
| Willingness to use again | 4.4 / 5 | Strong interest in continued use |

### 6.5.4 Key Observations

Older participants (13-15) completed all tasks on their own, while younger ones (9-11) needed a bit of help with the vault setup — the concept of a master password wasn't immediately obvious to them. The dark/cyberpunk theme was the clear favourite, preferred by 9 out of 12 participants who described it as "cool" and engaging. The gamification system (XP, levels, streaks) got the most praise — participants were genuinely motivated to earn XP and level up. The AI chatbot was the biggest time sink in a good way: participants kept asking follow-up cybersecurity questions well beyond the assigned tasks.

---

# Chapter 7: Conclusion and Future Work

## 7.1 Summary of Work

CHEA — the Cyber Hygiene Educator & Assistant — is a desktop cybersecurity application we built for students aged 9-15. We set out to create an integrated platform that combines practical security tools with gamified education, and we addressed the five research gaps we identified in our literature review: tool integration, age-appropriateness, education-protection, engagement, and accessibility (Ibrahim et al., 2024; Zhang-Kennedy and Chiasson, 2021; Sağlam and Miller, 2023).

We built it with React 18 + TypeScript on the frontend, Rust + Tauri v2 on the backend, and Firebase Firestore for cloud storage. In total, we implemented 11 security features: password generation and strength analysis, a credential vault with AES-256-GCM encryption, URL and file scanning via VirusTotal, text encryption with three algorithms (AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC), image metadata scanning and stripping, an AI-powered cybersecurity chatbot with streaming responses, a phishing email identification game with three difficulty tiers, and a cybersecurity knowledge quiz.

The gamification framework includes a 10-tier level progression system (Novice through Omniscient), XP awarded for all security activities, daily streak tracking, and seven daily task objectives. All of this is wired together through a central `useTrackActivity` hook that handles activity logging, XP awarding, and task updates every time a user completes a security action.

## 7.2 Key Findings and Results

All 28 functional test cases passed — authentication, scanning, password generation, encryption round-trips for all three algorithms, vault management, AI chat, image metadata, quiz, phishing identification, gamification, and terminal emulation all work as intended.

On the security side, AES-256-GCM and ChaCha20-Poly1305 correctly detect ciphertext tampering through their authentication tags. Each encryption produces unique ciphertext thanks to per-operation random salts and nonces. API keys stay locked in the Rust backend, and we found no plaintext sensitive data in Firestore.

Performance-wise, all local operations finish in under 500 milliseconds, with encryption even handling 100 KB inputs in under 80 milliseconds. The external API calls are slower — VirusTotal takes 12-22 seconds and the AI chatbot takes 2-9 seconds for the first response — but async operations and loading indicators keep the app responsive.

Usability testing with 12 participants averaged 4.4/5 across all criteria. Visual appeal scored highest at 4.7/5, followed by learning value at 4.6/5. The cyberpunk aesthetic and gamification were the biggest engagement drivers. The one area that needs work is the vault master password concept — younger users (9-11) needed extra guidance to understand it.

## 7.3 Project Limitations

We ran into several limitations during development and testing:

1. **No Automated Test Suite:** We don't have unit, integration, or end-to-end tests. All testing was manual, which is time-consuming and may miss edge cases. This is something we'd want to add before any real deployment.

2. **Firestore Security Rules:** Our current Firestore rules use time-based access control rather than proper auth-scoped rules. For production, we'd need to add `request.auth.uid == userId` constraints so users can only access their own data.

3. **VirusTotal API Rate Limiting:** The free VirusTotal tier allows 500 requests per day and 4 per minute. In a classroom with multiple students, this limit would get hit fast and limit the educational value of the scanning features.

4. **Static Educational Content:** The Quiz Arena and Phishing Dojo have fixed question and email sets. Once users go through everything, they'll start seeing repeats, which reduces long-term educational value.

5. **No Offline Mode:** The app requires an internet connection for everything — authentication, database, scanning, AI chat. Without connectivity, none of the features work.

6. **No Vault Password Recovery:** If a user forgets their vault master password, there's no recovery mechanism. The encrypted data is permanently inaccessible without the correct password. This is a deliberate security trade-off, but it can be frustrating for users.

7. **Single-Platform Testing:** While Tauri supports cross-platform compilation, we only developed and tested on Windows. macOS and Linux compatibility hasn't been verified.

## 7.4 Future Work

Based on what we learned and the feedback we got, here's what we'd improve or add next:

1. **Automated Testing Framework:** Add unit tests for the Rust crypto modules using Rust's built-in test framework, integration tests for Tauri IPC commands, and end-to-end tests for critical user flows using something like Playwright.

2. **Dynamic Educational Content:** Build a content management system or connect to an external data source for quiz questions and phishing emails. This way we could update content regularly without redeploying the app. Crowd-sourced content from educators would be ideal.

3. **Classroom Mode and Teacher Dashboard:** A teacher-facing dashboard where educators can create classes, assign tasks, track student progress, and view aggregate analytics on cybersecurity knowledge improvement across the class.

4. **Offline Capabilities:** Use Tauri's file system API to cache data locally, so the password generator, encryption tools, and phishing quiz work without internet. Sync with Firestore when connectivity comes back.

5. **Enhanced Gamification:** Add achievement badges for specific accomplishments (e.g., "First Scan," "Encryption Master," "Phishing Expert"), a leaderboard for classroom competition, and unlockable cosmetic rewards like custom themes and avatar customisations.

6. **Multi-Language Support:** Go beyond Arabic RTL support to full internationalisation (i18n) with localised interfaces for multiple languages, making CHEA accessible to a broader student population.

7. **Advanced Encryption Features:** Add file encryption/decryption, secure file sharing via encrypted links, and a password sharing mechanism for families or classroom groups.

8. **Mobile Companion Application:** Build a mobile version using React Native or Tauri Mobile so students can practice security habits on their phones and tablets, not just at a desktop.

---

# References

Al-Janabi, M. et al. 2021, 'Cybersecurity Awareness in Higher Education: A Study of Students Behavior', *Journal of Information Security*, vol. 12, no. 1, pp. 15-32.

Alharbi, T. & Tassaddiq, A. 2021, 'Assessment of cybersecurity awareness among students of Majmaah University', *Big Data and Cognitive Computing*, vol. 5, no. 2, p. 23.

Alqahtani, M.A. 2022, 'Factors affecting cybersecurity awareness among university students', *Applied Sciences*, vol. 12, no. 5, p. 2589.

Arishi, A.A. et al. 2024, 'Cybersecurity awareness in schools: A systematic review of practices, challenges, and target audiences', *Journal of Cybersecurity Education*.

Ayeyemi, M. 2023, *A Systematic Review of Cybersecurity Education in K-12 Context*, University of Eastern Finland.

Bitwarden Inc. 2023, *Bitwarden Password Manager*, available at: https://bitwarden.com/ [Accessed 18 February 2026].

Bottyán, L. 2023, 'Cybersecurity awareness among university students', *Journal of Applied Technical and Educational Sciences*.

Check Point Research 2022, *Cyber Attacks on Education Sector See Massive Surge*, Check Point Software Technologies.

Chen, W. et al. 2021, 'Exploring cybersecurity education at the K-12 level', *SITE Interactive Conference*.

Cowling, M. et al. 2025, 'Untangling digital safety, literacy, and wellbeing in school activities for 10 to 13 year old students', *Education and Information Technologies*.

Erendor, M.E. & Yildirim, M. 2022, 'Cybersecurity awareness in online education: A case study analysis', *IEEE Access*.

Fakhrudin, A. 2023, 'Digital literacy analysis of primary school students', *KnE Social Sciences*.

Google 2023, *VirusTotal: Threat Intelligence Services*, available at: https://www.virustotal.com/ [Accessed 18 February 2026].

Ibrahim, A., McKee, M., Sikos, L.F. & Johnson, N.F. 2024, 'A Systematic Review of K-12 Cybersecurity Education Around the World', *IEEE Access*, vol. 12, pp. 59726-59738.

Khairallah, O. & Abu-Naseer, M. 2024, 'The effectiveness of gamification teaching method in raising awareness on Email Phishing: Controlled Experiment'.

Kaspersky Lab 2023, *Kaspersky Total Security Solutions*, available at: https://www.kaspersky.com/ [Accessed 18 February 2026].

Liu, N. et al. 2025, 'Systematic Review of Elementary Cybersecurity Education: Curriculum, Pedagogy, and Barriers', *Journal of Cybersecurity Education*.

Mrđa, B. et al. 2025, 'Cybersecurity education for children: Development of an online application as an internet safety tool', *International Review*.

Nagaraj, D.H. et al. 2025, 'Cybersecurity awareness: Gamified learning through phishing analysis', *AIP Conference Proceedings*.

Pramod, D. 2025, 'Gamification in cybersecurity education; a state of the art review and research agenda', *Journal of Applied Research in Higher Education*, vol. 17, no. 4, p. 1162.

Purnama, S. et al. 2021, 'Does digital literacy influence students online risk? Evidence from Covid-19', *Heliyon*.

Sağlam, R.B. & Miller, V. 2023, 'A systematic literature review on cyber security education for children', *IEEE Transactions on Education*.

Sylejmani, K. 2020, 'Usability Issues in Password Management Tools for University Students', *International Journal of Human-Computer Interaction*, vol. 36, no. 4, pp. 312-325.

Verizon 2021, *2021 Data Breach Investigations Report (DBIR)*, Verizon Enterprise Solutions.

Wijanarko, A. & Erlansari, A. 2025, 'Gamification on Cybersecurity Awareness Training for Adolescents: A Systematic Literature Review', *Indonesian Journal of Computer Science Education*.

Zhang-Kennedy, L. & Chiasson, S. 2021, 'A systematic review of multimedia tools for cybersecurity awareness and education', *ACM Computing Surveys (CSUR)*.

Facebook Inc. 2024, *React: A JavaScript Library for Building User Interfaces*, available at: https://react.dev/ [Accessed 1 April 2026].

Google LLC. 2024, *Firebase: App Development Platform*, available at: https://firebase.google.com/ [Accessed 1 April 2026].

Tauri Contributors. 2024, *Tauri: Build Smaller, Faster, and More Secure Desktop and Mobile Applications*, available at: https://tauri.app/ [Accessed 1 April 2026].

The Rust Foundation. 2024, *The Rust Programming Language*, available at: https://www.rust-lang.org/ [Accessed 1 April 2026].

Vercel Inc. 2024, *Vite: Next Generation Frontend Tooling*, available at: https://vitejs.dev/ [Accessed 1 April 2026].

Pmndrs. 2024, *Zustand: Bear Necessities for State Management in React*, available at: https://zustand-demo.pmnd.rs/ [Accessed 1 April 2026].

OpenRouter. 2024, *OpenRouter: API for AI Models*, available at: https://openrouter.ai/ [Accessed 1 April 2026].

Birtne, A. 2023, 'Argon2: The Memory-Hard Function for Password Hashing', *International Journal of Information Security*, vol. 22, no. 3, pp. 517-533.

Bernstein, D.J. 2008, 'ChaCha, a Variant of Salsa20', in *Workshop Record of SASC 2008: The State of the Art of Stream Ciphers*, pp. 3-5.

NIST. 2001, 'FIPS 197: Advanced Encryption Standard (AES)', National Institute of Standards and Technology, U.S. Department of Commerce.
