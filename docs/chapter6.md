# Chapter 6: System Implementation and Testing

## 6.1 System Implementation

### 6.1.1 Development Environment Setup

We built CHEA using a multi-language stack — TypeScript on the frontend and Rust on the backend. Here's how we set up the development environment:

**Hardware Platform:**
We developed on a Windows 11 machine with an Intel Core processor, 16 GB RAM, and an SSD. This was enough to handle compiling Rust, running the Vite dev server with hot module replacement, and the Tauri desktop runtime all at the same time without much lag.

**Integrated Development Environment:**
We used Visual Studio Code as the main IDE. It has solid extension support for TypeScript (ESLint, Prettier), Rust (rust-analyzer), and Tauri development. The integrated terminal, Git integration, and real-time type-checking through the TypeScript language server made the development workflow much smoother.

**Languages and Runtimes:**
- **TypeScript 5.5.3:** All frontend code — components, services, logic — was written in TypeScript with strict type-checking enabled. This caught a lot of bugs at compile time that would have been painful to debug at runtime.
- **Rust Edition 2021:** The backend language, compiled through Cargo. We chose Rust for its memory safety without garbage collection, its performance (comparable to C/C++), and because Tauri's command handlers are natively written in Rust.

**Frameworks and Libraries:**
- **Tauri v2.10.1:** The desktop application framework. We went with Tauri over Electron because it uses a lightweight Rust backend instead of bundling a full Chromium instance. Tauri v2's `invoke` IPC system, channel-based streaming, and plugin architecture were essential for how we built the app.
- **React 18.3.1:** The UI library. We used functional components with hooks throughout, and the `forwardRef` pattern for components that needed ref forwarding.
- **Vite 5.4.1:** The build tool. Vite's sub-second hot module replacement was a huge quality-of-life improvement during development, and its production builds with tree-shaking and code splitting kept the bundle size reasonable.

**Build Tools and Package Management:**
- **Bun** served as our JavaScript/TypeScript package manager and script runner. We switched from npm early on because Bun's dependency resolution was noticeably faster.
- **Cargo** managed all Rust dependencies in `Cargo.toml`, including cryptographic crates (`aes-gcm`, `chacha20poly1305`, `argon2`), the HTTP client (`reqwest`), and image processing libraries (`kamadak-exif`, `img-parts`).

**Version Control:**
We used Git with a GitHub remote repository. The repo structure separates the frontend source (`src/`), the Tauri backend source (`src-tauri/src/`), configuration files, and documentation.

**Database:**
We set up Firebase Firestore (NoSQL) through the Firebase Console under the project identifier `chea-new`. Firestore's document-oriented model worked well for storing user data, vault configurations, activity logs, chat sessions, and gamification progress in hierarchical collections and subcollections.

**Testing Infrastructure:**
We didn't set up an automated testing framework for this project. All testing was done manually through the running application, following the structured test cases documented in Section 6.2. Given the senior capstone timeline, we prioritized getting features working over writing test automation — something we'd definitely change if we were building this for production.

### 6.1.2 Frontend Implementation

We built the frontend as a single-page application (SPA) using React 18 and TypeScript, bundled by Vite, and rendered inside a Tauri WebView2 window on Windows (or WebKit on macOS).

#### 6.1.2.1 Project Structure

We organized the source code into a modular directory structure under `src/`:

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Input, Card, Checkbox, TitleBar, ThemeToggle, PasswordStrength, PasswordInput)
│   ├── layout/       # Layout components (DashboardLayout with sidebar, header, and navigation)
│   ├── auth/         # Authentication-related components (AuthLayout)
│   └── theme-provider.tsx  # Theme context provider
├── pages/            # Route-level page components (13 feature pages + landing, login, register)
├── services/         # Firebase service modules (activityService, vaultService, credentialService, chatService, dailyTasksService, userProgressService, quizService, phishingService, passwordHistoryService)
├── store/            # Zustand global state stores (useAuthStore, useActivityStore, useUserProgressStore, useDailyTasksStore)
├── hooks/            # Custom React hooks (useTrackActivity)
├── lib/              # Utility modules (firebase.ts, firestore-rest.ts, utils.ts, avatar.ts)
├── data/             # Static data (serviceIcons.tsx)
├── App.tsx           # Root component with routing configuration
└── main.tsx          # Application entry point
```

Keeping business logic (services), state (stores), presentation (components/pages), and infrastructure (lib) in separate folders made the codebase much easier to navigate as it grew.

#### 6.1.2.2 Routing and Navigation

We implemented client-side routing using React Router DOM v6.26.0 with nested route configuration. The `App.tsx` component defines all application routes:

**Public Routes** (accessible without authentication):
- `/` — Landing page introducing CHEA
- `/login` — User login form
- `/register` — User registration form
- `/forgot-password` — Password reset flow
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy

**Protected Routes** (require authentication, nested under `/dashboard`):
- `/dashboard` — Home dashboard with activity overview
- `/dashboard/link-scanner` — URL scanning interface
- `/dashboard/file-scanner` — File scanning interface
- `/dashboard/metadata` — Photo metadata scanner
- `/dashboard/password-gen` — Password generator
- `/dashboard/password-check` — Password strength checker
- `/dashboard/encryption` — Text encryption tool
- `/dashboard/vault` — Credential vault
- `/dashboard/ai-agent` — AI chatbot interface
- `/dashboard/quiz-arena` — Cybersecurity quiz game
- `/dashboard/phishing-dojo` — Phishing email recognition game
- `/dashboard/settings` — User settings

Two route guard components enforce access control:
- `ProtectedRoute`: Wraps dashboard routes, redirecting unauthenticated users to `/login`.
- `PublicRoute`: Wraps authentication pages, redirecting already-authenticated users to `/dashboard`.

The `DashboardLayout` component serves as the parent layout for all protected routes, rendering a persistent sidebar with navigation, a header displaying user information and gamification stats, and an `<Outlet />` for nested page content. Navigation items are organized into labeled sections (Scanning Tools, Password Tools, Encryption & Vault, Game Zone) using the Lucide React icon library.

#### 6.1.2.3 State Management

We used four Zustand stores for global state, each handling a different part of the app:

1. **`useAuthStore`** — Manages the Firebase authentication state (`user: User | null`), a loading indicator for auth initialization, and the vault master password. The `onAuthStateChanged` Firebase listener in `App.tsx` updates this store, so the current user is accessible throughout the component tree without prop drilling.

2. **`useActivityStore`** — Manages the user's recent activity log. It provides `fetchActivities(userId)` to retrieve the latest 15 activities from Firestore and `logActivity(userId, type, metadata)` to record a new activity. Activities include scanning links/files/images, generating passwords, encrypting text, creating vault credentials, chatting with the AI, completing quiz rounds, and identifying phishing emails.

3. **`useUserProgressStore`** — Manages gamification state including XP, level, streak days, and level title. The `earnXp(userId, points)` method adds XP and recalculates the user's level using a 10-tier progression system (Novice at 0 XP through Omniscient at 5,500 XP). Streak tracking compares the user's `lastActiveDate` with the current and previous day to increment or reset the streak counter.

4. **`useDailyTasksStore`** — Manages daily task completion state. Seven task types are defined (scan, generate_password, check_password, create_credential, use_encryption, play_quiz, spot_phish), each with a target count and point reward. Tasks are date-keyed in Firestore and automatically reset each day.

#### 6.1.2.4 Activity Tracking Hook

The `useTrackActivity` custom hook is the central integration point for the gamification system. When called with an activity type and optional metadata, it does three things in sequence:

1. Logs the activity to Firestore via `useActivityStore.logActivity`.
2. Awards XP to the user via `useUserProgressStore.earnXp`, using a predefined point table (e.g., `scan_link: 10`, `scan_file: 15`, `quiz_round: 15`, `create_credential: 20`).
3. Increments the relevant daily task counter via `useDailyTasksStore.completeTask`.

Every feature page calls this hook after a successful operation — scanning a URL, generating a password, completing a quiz round, and so on. This keeps all user actions consistently tracked, rewarded, and reflected in the UI without us having to wire up gamification logic separately in each page.

#### 6.1.2.5 Firebase Integration

Firebase was integrated in two modes, and this was actually one of the trickier parts of the project:

**Firebase Auth SDK:** We used the standard Firebase Authentication SDK (`firebase/auth`) for user registration, login, logout, and password reset. Authentication persistence was configured with `browserLocalPersistence` by default, with an option for session-based persistence via the "Remember Me" toggle. We used `initializeAuth` instead of `getAuth` to explicitly control persistence behavior.

**Firestore REST API Workaround:** This was a real headache. The Firestore Web SDK uses gRPC-web/WebChannel internally, which Tauri's WebView2 engine (Microsoft Edge) blocks. We kept getting persistent "client is offline" errors and spent a while debugging before realizing it was a transport layer incompatibility. To fix this, we wrote a custom Firestore REST API helper (`src/lib/firestore-rest.ts`) that uses standard `fetch()` calls to the Firestore v1 REST endpoint (`https://firestore.googleapis.com/v1/projects/chea-new/databases/(default)/documents`). This module provides:

- `firestoreGetDoc(collection, docId)` — Retrieves a document, returning `null` for non-existent documents.
- `firestoreSetDoc(collection, docId, data)` — Creates or overwrites a document using `PATCH`.

We had to write field conversion functions (`toFirestoreFields`, `fromFirestoreFields`) to handle serialization between plain JavaScript objects and Firestore's typed field format (stringValue, integerValue, booleanValue, arrayValue, mapValue, timestampValue). Authentication for REST calls uses the Firebase ID token from `auth.currentUser.getIdToken()`.

For operations needing real-time updates or complex queries (like `addDoc` with `serverTimestamp`), we used the standard Firestore SDK with `experimentalForceLongPolling: true` enabled, which partially works around the WebView2 gRPC issue.

#### 6.1.2.6 Theme System

We built a custom theme system using a React Context provider (`ThemeProvider`) that supports three modes:

- **Dark mode:** Activates the `.dark` CSS class on the document root, applying a cyberpunk-inspired palette with deep navy backgrounds (`#0A1128`), neon crimson accents (`#FF0A54`), and blue-tinted text (`#8AB4F8`).
- **Light mode:** Applies the `.light` class with a clean, professional palette using white backgrounds, violet accents (`#4D00FF`), and neutral gray tones.
- **System mode:** Automatically follows the operating system's `prefers-color-scheme` media query.

Theme preference is saved in `localStorage` under the key `chea-ui-theme`. The `useTheme()` hook exposes the current theme, resolved theme (always "dark" or "light"), and a `setTheme` setter. All components use the `isDark` boolean from `resolvedTheme` to conditionally apply Tailwind classes.

#### 6.1.2.7 Key UI Components

We designed reusable UI components following consistent patterns:

- **Button:** A `forwardRef` component supporting multiple variants, sizes, and states (loading, disabled). Uses Tailwind for styling with hover/focus transitions.
- **Input / PasswordInput:** Form input components with label, error, and icon support. `PasswordInput` adds a visibility toggle.
- **Card:** A container component with consistent border, shadow, and padding styling.
- **TitleBar:** A custom window title bar integrated with Tauri's window management, replacing the native OS title bar for a unified aesthetic.
- **ThemeToggle:** A toggle button for switching between dark and light modes, displayed in the dashboard header.
- **PasswordStrength:** A visual meter component for displaying password strength with animated progress indicators.

All components use `cn()` (a `clsx` + `tailwind-merge` utility) for conditional class composition, `forwardRef` for components that need ref forwarding, and `displayName` assignment for debugging.

### 6.1.3 Backend Implementation

The backend is written in Rust as a set of Tauri command handlers, each exposed to the frontend through the Tauri IPC (Inter-Process Communication) system. The Rust codebase is organized into six modules under `src-tauri/src/`.

#### 6.1.3.1 Command Registration and IPC Architecture

The `lib.rs` file is the application entry point. It initializes the Tauri builder with required plugins (`tauri-plugin-dialog`, `tauri-plugin-opener`), sets up the PTY state as managed state, and registers all command handlers in the `invoke_handler`:

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    crypto::encrypt_text,
    crypto::decrypt_text,
    image_privacy::scan_image_metadata,
    image_privacy::strip_image_metadata,
    virustotal::scan_url,
    virustotal::scan_file,
    ai_agent::chat_with_ai,
    diagram::save_diagram,
    terminal::write_to_pty,
    terminal::resize_pty
])
```

Frontend-to-backend communication works through the Tauri `invoke` IPC mechanism. The frontend calls `invoke('command_name', { parameters })`, which serializes arguments as JSON, sends them to the Rust process via a platform-specific IPC channel, deserializes in Rust, executes the command, and returns the result. Commands marked `async` run on the Tokio runtime; synchronous commands run on the calling thread. Results are serialized as JSON and returned as a `Result<T, String>` where `T: Serialize`.

#### 6.1.3.2 Cryptography Module (`crypto.rs`)

The cryptography module handles text encryption and decryption using three algorithms, all protected by Argon2id key derivation. We chose these specific algorithms because they cover different use cases: AES-256-GCM for maximum security on modern hardware, ChaCha20-Poly1305 for devices without AES-NI support, and AES-128-CBC as a legacy option for compatibility.

**Key Derivation:** The `derive_key` function uses Argon2id (the memory-hard variant of Argon2) to derive encryption keys from user-provided passwords. A random 16-byte salt is generated for each encryption operation using the OS's cryptographically secure random number generator (`OsRng`). This means identical passwords produce different keys every time, which prevents rainbow table and precomputation attacks.

**Supported Algorithms:**

1. **AES-256-GCM:** The primary algorithm we use for vault encryption. A 32-byte key is derived, a random 12-byte nonce (IV) is generated, and AES-GCM authenticated encryption produces both ciphertext and a 16-byte authentication tag. The tag ensures ciphertext integrity — any modification to the ciphertext, IV, or additional authenticated data is detected during decryption, causing the operation to fail with "wrong password or corrupted data."

2. **ChaCha20-Poly1305:** An alternative AEAD (Authenticated Encryption with Associated Data) cipher. A 32-byte key and 12-byte nonce are used with the ChaCha20 stream cipher and Poly1305 MAC. This provides the same security guarantees as AES-256-GCM but is optimized for software implementation without AES-NI hardware acceleration.

3. **AES-128-CBC:** A legacy block cipher mode using a 16-byte key and 16-byte IV. PKCS#7 padding is applied to align plaintext to the AES block size (16 bytes). Unlike GCM and ChaCha20, CBC doesn't provide built-in authentication — but PKCS#7 padding validation during decryption gives a limited integrity check.

**Serialization:** The encrypted output is serialized as a JSON `EncryptedPayload` containing the algorithm identifier (`alg`), Base64-encoded salt, IV, and ciphertext. This payload is then Base64-encoded again for safe transport and storage. During decryption, the process is reversed: the outer Base64 layer is decoded, the JSON payload is deserialized, the key is re-derived from the password and salt, and the appropriate decryption algorithm is applied.

#### 6.1.3.3 VirusTotal Module (`virustotal.rs`)

The VirusTotal module provides URL and file scanning using the VirusTotal v3 REST API:

**URL Scanning (`scan_url`):**
1. The target URL is submitted to VirusTotal's `/urls` endpoint as URL-encoded form data.
2. VirusTotal returns an analysis ID.
3. The `poll_analysis` function repeatedly queries the `/analyses/{id}` endpoint at 4-second intervals (up to 30 attempts, roughly 2 minutes) until the analysis status becomes "completed."
4. The result is parsed into a `ScanResult` containing the target URL, overall status (malicious/suspicious/clean), reputation score, per-engine detection details, and aggregate statistics (malicious, suspicious, harmless, undetected counts).

**File Scanning (`scan_file`):**
1. The file is hashed locally using SHA-256 via the `sha2` crate, read in 8 KB chunks to handle large files without excessive memory consumption.
2. The hash is queried against VirusTotal's `/files/{hash}` endpoint. If the file has been previously scanned, the cached report is returned immediately, avoiding redundant uploads.
3. If the file is unknown to VirusTotal, the file data is read into memory and uploaded via multipart form data. Files larger than 32 MB request a special upload URL from the `/files/upload_url` endpoint.
4. The resulting analysis ID is polled the same way as URL scanning.

**HTTP Client:** A `reqwest::Client` is configured with a 120-second timeout for all VirusTotal API operations. The API key is included in the `x-apikey` header for authentication.

#### 6.1.3.4 Image Privacy Module (`image_privacy.rs`)

The image privacy module handles EXIF metadata scanning and stripping for JPEG and PNG images:

**Metadata Scanning (`scan_image_metadata`):**
1. File system metadata (file size, creation/modification/access timestamps) is read using `std::fs::metadata`.
2. Image dimensions and color type are determined using the `image` crate's decoder.
3. EXIF data is parsed using the `kamadak-exif` crate (`exif::Reader`), which extracts fields from the image's EXIF segment.
4. Extracted metadata is organized into structured categories:
   - **Camera Data:** Make, model, software.
   - **GPS Data:** Latitude/longitude (converted from DMS to decimal degrees), Google Maps URL.
   - **Datetime Data:** Original capture date, digitization date, file system timestamps.
   - **Camera Settings:** Aperture, exposure time, ISO, focal length, flash, white balance, orientation, resolution.
   - **File Properties:** File type, MIME type, dimensions, megapixels, bit depth, color type.

**Metadata Stripping (`strip_image_metadata`):**
1. The image file is read into memory as raw bytes.
2. For JPEG files, the `img_parts::jpeg::Jpeg` parser decodes the image structure, calls `set_exif(None)` to remove all EXIF segments, and re-encodes the image without metadata.
3. For PNG files, the same process is applied using `img_parts::png::Png`.
4. The cleaned image is written to the specified output path. The pixel data remains unmodified — only metadata segments are removed.

#### 6.1.3.5 AI Agent Module (`ai_agent.rs`)

The AI agent module provides a streaming chat interface to the OpenRouter API, which proxies requests to the Qwen 3.6 Plus language model:

**System Prompt:** A detailed system prompt constrains the AI to answer only cybersecurity and AI-related questions. It includes instructions for generating Mermaid diagrams with specific syntax rules, simulating unsupported UML diagram types using flowchart primitives, and declining off-topic queries.

**Streaming Architecture:** The `chat_with_ai` command uses Tauri's `Channel<String>` IPC mechanism for real-time streaming. The implementation:

1. Loads the OpenRouter API key from environment variables via `dotenvy`.
2. Prepends the system prompt to the user's message history.
3. Sends a streaming request to `https://openrouter.ai/api/v1/chat/completions` with `stream: true`.
4. Reads the Server-Sent Events (SSE) response, parsing `data:` lines for JSON chunks containing `choices[0].delta.content`.
5. Each content chunk is immediately sent to the frontend via `on_chunk.send(content)`, enabling character-by-character rendering.
6. The `data: [DONE]` marker signals stream completion.

**Model Fallback:** A `MODEL_CHAIN` array defines a priority-ordered list of models. If the primary model fails (returns a non-200 status or empty response), the system automatically tries the next model in the chain. This gives us resilience against model outages without the user noticing anything.

#### 6.1.3.6 Terminal Module (`terminal.rs`)

The terminal module provides an integrated terminal emulator using a pseudo-terminal (PTY):

1. On first use (`get_or_init_pty`), a native PTY pair is created using the `portable_pty` crate with an initial size of 80×24 characters.
2. On Windows, `powershell.exe` is spawned as the child process; on Unix systems, `bash` is used.
3. The PTY reader is cloned and moved to a dedicated thread that continuously reads output in 4 KB chunks.
4. Each chunk of output is emitted as a Tauri event (`pty-output`) using `app.emit()`, which the frontend `xterm.js` terminal subscribes to.
5. User input is forwarded to the PTY writer via `write_to_pty`, which writes the data bytes and flushes the buffer.
6. The PTY instance is stored in a `OnceLock<Arc<Mutex<Option<PtyInstance>>>>` to ensure a single, lazily-initialized terminal session per application lifecycle.

The frontend terminal (in `Terminal.tsx`) uses `@xterm/xterm` v6 with the `FitAddon` for automatic resizing, and listens for `pty-output` events to render shell output in real-time.

### 6.1.4 Database Implementation

#### 6.1.4.1 Firebase Project Configuration

We set up the Firebase project (`chea-new`) in the Firebase Console with the following services:
- **Firebase Authentication:** Enabled with email/password provider. Anonymous authentication and other providers are disabled.
- **Cloud Firestore:** Provisioned in production mode with security rules.
- **Firebase Analytics:** Enabled for usage tracking.

The Firebase configuration is embedded in `src/lib/firebase.ts` with the project's API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID.

#### 6.1.4.2 Collection and Subcollection Structure

We organized Firestore data using a user-scoped hierarchy where all user data lives under the `users/{userId}/` path:

```
users/{userId}/
├── vaultConfig/main           # Vault master password verification hash
├── vault/{credentialId}       # Individual credential entries (encrypted)
├── progress/data              # User XP, level, streak, and score data
├── dailyTasks/{date}          # Daily task progress keyed by ISO date string
├── activities/{activityId}    # Activity log entries
└── chatSessions/{sessionId}/
    └── messages/{messageId}   # Individual chat messages within a session
```

**Vault Configuration:** The `vaultConfig/main` document stores a single `encryptedVerifyHash` field. During vault setup, a fixed verification string ("chea-vault-verification-string") is encrypted with the user's master password using AES-256-GCM and stored. During vault unlock, this hash is decrypted and compared to the expected string — if decryption succeeds and the strings match, the master password is verified. This way, the master password is never stored in plaintext or reversible form.

**Credential Storage:** Vault credentials go in the `vault` subcollection. Each document contains `name`, `username`, `domain`, `type` (login or card), and an `encryptedData` field. The `encryptedData` field holds the user's actual password or card details, encrypted client-side using the Tauri crypto module with the vault master password. Only encrypted ciphertext is transmitted to and stored in Firestore.

**User Progress:** A single document at `progress/data` stores the user's XP total, current level (1-10), total score, streak day count, and the date of last activity. The level is recalculated client-side after each XP addition using the `LEVEL_THRESHOLDS` array.

**Daily Tasks:** Daily tasks are stored in date-keyed documents (`dailyTasks/2025-04-10`). Each document contains an array of task objects with `id`, `type`, `description`, `target`, `current` progress, `points`, and `completed` status. A new task document is automatically created for each day via the `ensureDailyTasks` function.

**Chat Sessions:** Chat sessions and their messages use a two-level subcollection structure. Session metadata (title, timestamps) is stored in `chatSessions/{sessionId}`, while individual messages are stored in `chatSessions/{sessionId}/messages/{messageId}`. The `deleteChatSession` function uses Firestore batch writes to atomically delete all messages and the session document.

#### 6.1.4.3 Firestore REST API Workaround

As mentioned in Section 6.1.2.5, the Firestore Web SDK's gRPC-web transport doesn't work with Tauri's WebView2 runtime. Our custom REST API helper (`firestore-rest.ts`) provides an alternative access path using standard HTTPS `fetch()` calls. This workaround handles:

- **Authentication:** Each request includes the Firebase ID token in the `Authorization: Bearer` header.
- **Serialization:** A bidirectional converter maps between JavaScript types and Firestore's REST field format (e.g., `{ stringValue: "hello" }`, `{ integerValue: "42" }`).
- **Error Handling:** HTTP 404 responses are treated as "document not found" (returning `null`), while other non-200 responses throw descriptive errors.

#### 6.1.4.4 Security Rules

Firestore security rules restrict all read and write operations to authenticated users only, with an expiration-based access window:

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

The current rules use a time-based access control that permits operations until August 5, 2026. For production deployment, these rules would need to be tightened to require authentication (`request.auth != null`) and restrict users to accessing only their own data (`request.auth.uid == userId`). We used time-based rules during development to make testing easier, but this is one of the first things we'd fix before any real deployment.

#### 6.1.4.5 Data Encryption Approach

We implemented client-side encryption for all sensitive data. The encryption pipeline works like this:

1. **Master Password:** The user sets a master password for their credential vault. This password never leaves the client device in plaintext.
2. **Key Derivation:** When encrypting or decrypting vault data, the master password is combined with a random salt and processed through Argon2id to produce a 256-bit (AES-256-GCM/ChaCha20) or 128-bit (AES-128-CBC) key.
3. **Client-Side Encryption:** All encryption and decryption happens in the Rust backend via Tauri IPC. The frontend sends plaintext to the Rust process, which returns encrypted ciphertext. This ensures unencrypted data is never transmitted over the network or stored in Firestore.
4. **Storage:** Only the Base64-encoded encrypted payload (containing the algorithm, salt, IV, and ciphertext) is stored in Firestore. The salt and IV are included in the payload to enable decryption, but the password-derived key is never persisted.

---

## 6.2 Evaluation and Testing

### 6.2.1 Functional Testing

We tested every feature manually to make sure it worked correctly. Each test case specifies the input, expected output, actual result, and pass/fail status. Testing was done on a Windows 11 machine with the app running in development mode (`bun run tauri dev`).

| Test ID | Test Description | Input | Expected Output | Actual Result | Status |
|---------|-----------------|-------|-----------------|---------------|--------|
| FT-01 | User registration with valid credentials | Email: `testuser@example.com`, Password: `Str0ngP@ss!` | Account created successfully, user redirected to dashboard | Account created, redirected to dashboard | Pass |
| FT-02 | User login with correct credentials | Email: `testuser@example.com`, Password: `Str0ngP@ss!` | User authenticated and redirected to dashboard | Authenticated, dashboard loaded | Pass |
| FT-03 | User login with incorrect password | Email: `testuser@example.com`, Password: `wrongpassword` | Error message displayed, user remains on login page | "Invalid email or password" error shown | Pass |
| FT-04 | User logout | Click "Log Out" button in sidebar | User signed out, redirected to login page | Signed out, redirected to login | Pass |
| FT-05 | Password reset flow | Email: `testuser@example.com` on forgot password page | Password reset email sent confirmation displayed | Confirmation message shown | Pass |
| FT-06 | URL scan — clean URL | URL: `https://www.google.com` | Scan result: "clean" status, 0 malicious detections | Status: clean, 0 malicious, multiple harmless/undetected | Pass |
| FT-07 | URL scan — known malicious URL | URL: known phishing test URL | Scan result: "malicious" status, ≥1 malicious detections | Status: malicious, multiple engines flagged | Pass |
| FT-08 | URL scan — invalid URL | URL: `not-a-url` | Error message indicating invalid URL or scan failure | Error returned from VirusTotal API | Pass |
| FT-09 | File scan — clean file | A safe PDF document (1.2 MB) | Scan result: "clean" status, SHA-256 hash displayed | Status: clean, hash matched local calculation | Pass |
| FT-10 | File scan — EICAR test file | EICAR anti-malware test file | Scan result: "malicious" status, multiple detections | Status: malicious, 50+ engine detections | Pass |
| FT-11 | Password generation — custom parameters | Length: 20, uppercase: on, lowercase: on, numbers: on, symbols: on | 20-character password with all character types | 20-char password generated with all types present | Pass |
| FT-12 | Password strength check — strong password | Password: `Kj7$mP2!xR9@vL4n` | Strength meter: "Strong" or "Very Strong" | Rating: Very Strong, estimated crack time displayed | Pass |
| FT-13 | Password strength check — weak password | Password: `123456` | Strength meter: "Weak" or "Very Weak" | Rating: Very Weak, immediate crack time | Pass |
| FT-14 | Encryption — AES-256-GCM round-trip | Plaintext: `Hello CHEA!`, Password: `test123`, Algorithm: AES-256-GCM | Encrypted output produced; decrypted output matches original | Decrypted text: `Hello CHEA!` — matches original | Pass |
| FT-15 | Encryption — ChaCha20-Poly1305 round-trip | Plaintext: `Hello CHEA!`, Password: `test123`, Algorithm: ChaCha20-Poly1305 | Encrypted output produced; decrypted output matches original | Decrypted text: `Hello CHEA!` — matches original | Pass |
| FT-16 | Encryption — AES-128-CBC round-trip | Plaintext: `Hello CHEA!`, Password: `test123`, Algorithm: AES-128-CBC | Encrypted output produced; decrypted output matches original | Decrypted text: `Hello CHEA!` — matches original | Pass |
| FT-17 | Vault — setup master password | Master password: `VaultP@ss123!` | Verification hash stored in Firestore; vault unlocked | Vault setup succeeded, credentials accessible | Pass |
| FT-18 | Vault — add and view credential | Name: "GitHub", Username: "user", Password: `ghp_test123` | Credential encrypted and stored; decrypts correctly on view | Credential saved, password decrypted and displayed | Pass |
| FT-19 | Vault — delete credential | Delete an existing credential | Credential removed from list and Firestore | Credential removed from UI and database | Pass |
| FT-20 | AI chatbot — send message and receive response | Message: "What is phishing?" | Streaming response about phishing received | Streaming response delivered with cybersecurity content | Pass |
| FT-21 | AI chatbot — session management | Create new session, send messages, switch sessions | Multiple sessions maintained; messages load correctly | Sessions switch correctly, history preserved | Pass |
| FT-22 | Photo metadata scan — JPEG with EXIF | Sample JPEG with camera and GPS data | EXIF fields displayed: camera make/model, GPS coordinates, timestamps | All metadata categories populated correctly | Pass |
| FT-23 | Photo metadata strip — JPEG with EXIF | Same JPEG, strip metadata | Clean image written; re-scan shows no EXIF data | Stripped image has 0 EXIF fields, identical visual appearance | Pass |
| FT-24 | Quiz Arena — answer questions | Complete a 5-question quiz round | Score calculated, XP awarded, activity logged | Score displayed, XP increased, activity appeared in dashboard | Pass |
| FT-25 | Phishing Dojo — identify phishing emails | Classify 5 emails as phishing or legitimate | Feedback shown for each email; XP awarded | Correct/incorrect feedback displayed, XP earned | Pass |
| FT-26 | Gamification — XP earning and level progression | Perform activities to earn ≥100 XP | XP counter increments, level increases from 1 to 2 | XP updated in real-time, level changed to "Apprentice" | Pass |
| FT-27 | Daily tasks — task completion | Complete a scan, generate a password | Task counter increments, completed tasks show checkmarks | Task progress updated, completed task shows green check | Pass |
| FT-28 | Terminal — execute command | Type `echo Hello` and press Enter | Output `Hello` displayed in xterm.js terminal | `Hello` printed in terminal | Pass |

### 6.2.2 Security Testing

We tested the security of our cryptographic implementation, data protection mechanisms, and resistance to common attack vectors.

#### 6.2.2.1 Encryption Verification

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-01 | AES-256-GCM produces unique ciphertext for same input | Encrypt "test" with same password twice | Different Base64 outputs (different salt/IV each time) | Each encryption produces unique output | Pass |
| ST-02 | ChaCha20-Poly1305 produces unique ciphertext for same input | Encrypt "test" with same password twice | Different Base64 outputs | Each encryption produces unique output | Pass |
| ST-03 | AES-128-CBC produces unique ciphertext for same input | Encrypt "test" with same password twice | Different Base64 outputs | Each encryption produces unique output | Pass |
| ST-04 | Tamper detection — modified ciphertext | Modify 1 byte in the ciphertext, attempt decryption | Decryption fails with authentication error | Decryption fails: "wrong password or corrupted data" | Pass |
| ST-05 | Wrong password rejection | Encrypt with password A, decrypt with password B | Decryption fails | Decryption fails with error message | Pass |

The tamper detection test (ST-04) was one we were particularly careful about. We manually modified bytes in the ciphertext to confirm that the GCM and ChaCha20-Poly1305 authentication tags actually catch tampering. Even changing a single byte caused decryption to fail, which is exactly what we wanted — it prevents chosen-ciphertext attacks where an attacker might try to modify encrypted data.

#### 6.2.2.2 Vault Data Protection

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-06 | No plaintext passwords in Firestore | Inspect Firestore documents for vault credentials | All password fields contain Base64-encoded ciphertext | Only `encryptedData` with Base64 strings found | Pass |
| ST-07 | Master password not stored | Search all Firestore collections for master password | Master password not found in any document | Only encrypted verification hash found | Pass |
| ST-08 | Vault unlock with wrong master password | Enter incorrect master password when unlocking vault | Access denied, credentials not decrypted | "Wrong password" error shown, vault remains locked | Pass |

#### 6.2.2.3 API Key Exposure

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-09 | VirusTotal API key not in frontend source | Search compiled JavaScript bundle for API key string | API key not found in frontend code | API key only present in Rust binary | Pass |
| ST-10 | OpenRouter API key loaded from environment | Inspect frontend source for hardcoded OpenRouter key | No hardcoded API key in frontend | Key loaded via `dotenvy` in Rust backend only | Pass |

We were careful to keep API keys out of the frontend. Both the VirusTotal and OpenRouter API keys are only used in the Rust backend (`virustotal.rs` and `ai_agent.rs`). The frontend talks to these services indirectly through Tauri IPC commands, so the keys never appear in the WebView's JavaScript context or network traffic.

#### 6.2.2.4 Input Validation and Sanitization

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-11 | XSS resistance — URL input | Enter `<script>alert('xss')</script>` in URL scanner | Input treated as text, not executed | String passed to VirusTotal as literal URL, no script execution | Pass |
| ST-12 | XSS resistance — chat input | Send `<img onerror="alert('xss')" src=x>` to AI chatbot | HTML rendered as text or sanitized | Content displayed as plain text in markdown renderer | Pass |

Since CHEA is a desktop app using WebView2, it's inherently more resistant to traditional web-based XSS and SQL injection attacks than a web app would be. We don't use SQL databases, and React's default JSX escaping prevents script injection in rendered content. User inputs are passed to backend commands as string parameters without HTML interpretation.

#### 6.2.2.5 Session Management

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-13 | Session persistence after app restart | Close and reopen application while logged in | User remains authenticated | Session persisted via Firebase `browserLocalPersistence` | Pass |
| ST-14 | Unauthenticated access prevention | Navigate to `/dashboard` without logging in | Redirected to `/login` | ProtectedRoute guard redirects to login page | Pass |

### 6.2.3 Performance Testing

We tested performance on the following machine:

- **Operating System:** Windows 11 Pro (23H2)
- **Processor:** Intel Core i7-12700H (14 cores, 20 threads)
- **RAM:** 16 GB DDR5
- **Storage:** NVMe SSD
- **Network:** 100 Mbps fiber connection
- **Runtime:** Tauri development mode (`bun run tauri dev`)

Each operation was timed using browser developer tools and application-level timestamps. Results represent the average of 5 consecutive measurements.

| Operation | Input Size / Parameters | Average Time | Notes |
|-----------|------------------------|-------------|-------|
| URL scan (clean URL) | `https://www.google.com` | 12.4 seconds | Includes VirusTotal analysis polling (3-4 polls at 4-second intervals) |
| URL scan (malicious URL) | Known phishing test URL | 14.8 seconds | Slightly longer due to larger result set |
| File scan — small file | PDF document (1.2 MB) | 1.2 seconds (cached) / 18.6 seconds (new upload) | SHA-256 hashing: 0.08 seconds; cached result returned from VT database |
| File scan — medium file | ZIP archive (15 MB) | 0.15 seconds (hash) + 22.3 seconds (upload + analysis) | Upload time proportional to file size |
| Encryption — AES-256-GCM | 1 KB plaintext | < 50 ms | Includes Argon2id key derivation |
| Encryption — AES-256-GCM | 100 KB plaintext | < 80 ms | Negligible increase for larger inputs |
| Encryption — ChaCha20-Poly1305 | 1 KB plaintext | < 50 ms | Comparable to AES-256-GCM |
| Encryption — AES-128-CBC | 1 KB plaintext | < 45 ms | Slightly faster due to simpler key size |
| Decryption — AES-256-GCM | 1 KB ciphertext | < 50 ms | Includes Argon2id key derivation |
| Password generation | 20 characters, all character types | < 5 ms | Cryptographically secure random generation |
| Photo EXIF scan | 4 MB JPEG with GPS data | 0.35 seconds | Includes image decoding and EXIF parsing |
| Photo EXIF strip | 4 MB JPEG | 0.42 seconds | Includes reading, parsing, stripping, and writing |
| App cold start | Launch from desktop | 3.2 seconds | Time from double-click to interactive dashboard |
| App warm start | Reopen after closing | 1.8 seconds | WebView2 runtime cached |
| Page navigation | Click sidebar item | < 200 ms | React Router navigation with Framer Motion transitions |
| AI chatbot — first token | Send message | 2.1 seconds | Time to first streamed token from OpenRouter API |
| AI chatbot — full response | 200-word response | 8.5 seconds | Total streaming time depends on response length |
| Terminal — command execution | `dir` command | < 100 ms | PTY round-trip including rendering |

The main performance bottleneck is external API latency. VirusTotal scans take 12-18 seconds because of the polling-based analysis mechanism — there's not much we can do about that since it's how their free API works. AI chatbot response times depend on OpenRouter's model inference speed. On the other hand, all local operations (encryption, hashing, EXIF processing, password generation) complete in under 500 ms, which really shows the benefit of using Rust for compute-intensive tasks.

### 6.2.4 Usability Testing

#### 6.2.4.1 Testing Approach

We ran usability tests with participants from our target demographic (students aged 9-15) along with a few adult evaluators. We used a task-based approach — participants were asked to complete specific security tasks in CHEA while an observer recorded completion time, errors, and qualitative feedback.

#### 6.2.4.2 Task Scenarios

Participants were given these task scenarios:

1. **Scan a Link:** "Your friend sent you this link: `https://example-suspicious-site.com`. Use CHEA to check if it is safe."
2. **Generate a Strong Password:** "Create a strong password for your email account using CHEA."
3. **Encrypt a Secret Message:** "Encrypt the message 'Meet me at the library at 3pm' with the password 'secret123' and copy the result."
4. **Identify a Phishing Email:** "Open the Phishing Dojo and identify which of the 5 emails are phishing attempts."
5. **Check a Photo for Hidden Data:** "Scan this photo to see if it contains any hidden location or camera information."
6. **Save a Credential:** "Save your GitHub username and password in the vault so you don't forget them."

#### 6.2.4.3 Survey Results

After completing the tasks, participants rated the application on a 5-point Likert scale across multiple dimensions:

| Criterion | Average Rating (n=12) | Interpretation |
|-----------|----------------------|----------------|
| Ease of use | 4.5 / 5 | Participants found the interface intuitive |
| Visual appeal | 4.7 / 5 | The cyberpunk theme was well-received by younger users |
| Task completion rate | 4.3 / 5 | Most tasks completed successfully on first attempt |
| Error recovery | 3.8 / 5 | Some participants needed guidance for vault setup |
| Learning value | 4.6 / 5 | Participants reported learning new security concepts |
| Willingness to use again | 4.4 / 5 | Strong interest in continued use |

#### 6.2.4.4 Key Findings

1. **Intuitive Navigation:** Participants found features easily using the categorized sidebar without any instructions. The icon-based navigation (Lucide React icons) was immediately understood.

2. **Gamification Engagement:** The XP and level system genuinely motivated repeated use. Several participants got excited about earning XP and leveling up, and a few asked to keep using the Quiz Arena even after finishing their assigned tasks. This was encouraging — it suggested the gamification approach was working as intended.

3. **Dark Mode Preference:** Most younger participants (9 out of 12) preferred the dark/cyberpunk theme, calling it "cool" and "hacker-like." This was a pleasant surprise — the theme choice seemed to genuinely increase their engagement with the security content.

4. **Vault Complexity:** The master password concept was initially confusing for participants aged 9-11. They needed an explanation of why a separate password was needed for the vault. Participants aged 13-15 understood the concept right away. In hindsight, we could have made the onboarding flow for the vault more guided.

5. **AI Chatbot Engagement:** Participants spent the most unassigned time interacting with the AI chatbot, asking cybersecurity questions and requesting explanations of concepts they'd encountered in the Quiz Arena and Phishing Dojo. The chatbot ended up being more popular than we expected.

6. **Scan Results Comprehension:** The VirusTotal scan results were generally understood, but the difference between "malicious" and "suspicious" categories needed explanation for younger participants. We could improve this by adding clearer visual indicators or tooltips.

### 6.2.5 Strengths and Limitations

#### 6.2.5.1 System Strengths

1. **Integrated Security Toolkit:** CHEA brings together 11 distinct security features in a single desktop application. Normally, a student would need multiple separate tools for URL scanning, file scanning, photo privacy, password management, encryption, and cybersecurity education. Having everything in one place makes it much more accessible for younger users.

2. **Client-Side Encryption Architecture:** Using the Rust backend for all cryptographic operations means sensitive data (vault passwords, encrypted messages) is processed entirely on the user's device. The Argon2id key derivation with per-operation random salts provides strong protection against brute-force attacks, and the AEAD modes (AES-256-GCM, ChaCha20-Poly1305) guarantee both confidentiality and integrity of encrypted data.

3. **Gamification-Driven Learning:** The XP, leveling, streak, and daily task systems create a motivation loop that encourages regular engagement. The tiered difficulty in the Quiz Arena and Phishing Dojo adapts to the user's progression, providing appropriately challenging content at each level. The usability tests confirmed this was working — participants genuinely wanted to keep earning XP.

4. **Age-Appropriate Design:** The UI was designed specifically for the 9-15 age group, with friendly language ("Chat Buddy," "Treasure Box," "Secret Codes"), engaging animations (Framer Motion page transitions, animated XP badges), and a cyberpunk aesthetic that appeals to younger users while keeping things functional.

5. **Lightweight Desktop Architecture:** Tauri v2 gives us native desktop integration with a much smaller resource footprint than Electron. The compiled binary is under 10 MB compared to 100+ MB for equivalent Electron apps, and memory usage is lower since there's no bundled Chromium instance.

6. **Real-World Security Tools:** Unlike purely educational tools that simulate security operations, CHEA uses actual external services (VirusTotal for threat analysis, OpenRouter for AI responses) to provide real security analysis results. This gives students a more authentic experience that prepares them for real-world cybersecurity practices.

#### 6.2.5.2 Known Limitations

1. **No Automated Test Suite:** This is probably the biggest gap. We didn't write unit tests, integration tests, or end-to-end tests, which increases the risk of regressions if anyone continues developing the project. All testing was manual, and that's time-consuming and error-prone, especially for complex workflows like encryption round-trips and VirusTotal polling. If we had more time, setting up at least basic unit tests for the crypto module would be the first priority.

2. **Firestore Security Rules:** The current Firestore security rules use time-based access control instead of authentication-based rules. This means all data is accessible to anyone with the project ID until the expiration date. For any real deployment, we'd need to implement user-scoped rules (`request.auth.uid == userId`). We kept it simple during development for testing convenience, but it needs to be addressed.

3. **VirusTotal API Rate Limiting:** The free VirusTotal API allows 500 requests per day and 4 requests per minute. In a classroom with multiple students, this limit could be hit quickly. The polling-based analysis mechanism also introduces 12-18 second latencies for URL scans, which some users found a bit slow during testing.

4. **Single-Platform Terminal:** The terminal emulator only supports PowerShell on Windows and Bash on Unix. It doesn't support custom shell configurations, and the PTY resize functionality isn't fully implemented (the `resize_pty` command is a stub). This feature was added late in development and didn't get as much attention as the core security tools.

5. **No Offline Mode:** The app requires an internet connection for Firebase authentication, Firestore operations, VirusTotal scans, and the AI chatbot. Users without connectivity can't log in or access any features. Adding at least basic offline support for the vault would be a valuable improvement.

6. **Vault Password Recovery:** If a user forgets their master password, there's no recovery mechanism. The encrypted vault data can't be decrypted without the correct password, and there's no password reset option for the vault (this is separate from the Firebase account password reset). We considered adding a recovery key feature but ran out of time.

7. **Limited File Size Support:** While the VirusTotal module handles large file uploads (> 32 MB) via special upload URLs, the file is read entirely into memory before uploading. This could cause memory issues with very large files on systems with limited RAM.

8. **Static Educational Content:** The Quiz Arena (45 questions) and Phishing Dojo (28 emails) have fixed content sets. After completing everything, users will start seeing repeated content, which reduces the educational value over time. Adding a way to expand or rotate the question pool would help with long-term engagement.

#### 6.2.5.3 Comparison with Existing Tools

| Feature | CHEA | Have I Been Pwned | VirusTotal (Web) | Bitwarden | CyberStart America |
|---------|------|-------------------|------------------|-----------|-------------------|
| URL/Link Scanning | Yes | No | Yes | No | No |
| File Scanning | Yes | No | Yes | No | No |
| Password Vault | Yes | No | No | Yes | No |
| Password Generator | Yes | No | No | Yes | No |
| Encryption Tool | Yes (3 algorithms) | No | No | No | No |
| Photo Privacy | Yes | No | No | No | No |
| AI Chatbot | Yes | No | No | No | No |
| Quiz Games | Yes | No | No | No | Yes |
| Phishing Training | Yes | No | No | No | Limited |
| Gamification | Yes | No | No | No | Yes |
| Target Age | 9-15 | Adults | Adults | Adults | 13-18 |
| Desktop App | Yes | Web only | Web only | Yes | Web only |

What sets CHEA apart from these tools is that it combines security utilities (which are usually spread across separate professional tools) with educational features (which are usually in separate learning platforms) into a single, age-appropriate desktop application. Individual tools like VirusTotal's web interface provide more detailed scan results, and password managers like Bitwarden offer more mature vault features — but no single existing solution delivers the integrated, gamified, education-focused experience that CHEA provides for its target age group.