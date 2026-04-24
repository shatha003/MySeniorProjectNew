# Chapter 5: System Design

## 5.1 Introduction

This chapter presents the detailed system design of the Cyber Hygiene Educator & Assistant (CHEA). The design translates the functional and non-functional requirements defined in Chapter 4 into concrete specifications for the database schema, user interfaces, and core algorithms. The design decisions are guided by the research gaps identified in the literature review (Chapter 2), particularly the need for tool integration (Ibrahim et al., 2024), age-appropriate interfaces (Saؤںlam and Miller, 2023), and the combination of education with practical protection (Zhang-Kennedy and Chiasson, 2021).

The chapter is organised into five main sections. Section 5.2 presents the Firebase Firestore database schema, detailing all collections, document structures, field types, and constraints, including a critical workaround for Tauri's WebView2 environment. Section 5.3 describes the user interface designs, covering all key interfaces - authentication flows, the dashboard, security tools, educational games, the AI chatbot, settings, and supplementary features - with their layout, components, navigation flow, and user interaction patterns. Section 5.4 documents the application architecture including the routing system, state management, and the reusable UI component library. Section 5.5 provides the algorithm designs, expressed in pseudocode, for all core system functions. Section 5.6 concludes with a summary.

---

## 5.2 Database Schema Design

We chose Firebase Firestore as our database because it offers real-time synchronisation, automatic horizontal scaling, and native integration with Firebase Authentication - all essential for a desktop application that needs to persist user data across sessions. Firestore is a NoSQL document database, so instead of relational tables with fixed schemas, we use collections and documents organised in a hierarchical structure.

All data in CHEA is scoped under the `users/{userId}` path, where `userId` is the Firebase Authentication UID. This design ensures complete data isolation between users and allows Firestore security rules to restrict access to each user's own data only. The schema was designed around CHEA's five core functional areas: credential storage, gamification progress tracking, activity logging, daily task management, and AI chat session persistence.

The complete Firestore schema is presented in Table 5.1.

**Table 5.1: Complete Firestore Database Schema**

| Collection Path | Document ID | Field Name | Data Type | Constraints | Description |
|-----------------|-------------|------------|-----------|-------------|-------------|
| `users/{userId}/vault` | Auto-generated | `name` | String | Required | Display name for the credential (e.g., "GitHub", "School Email") |
| | | `username` | String | Required | Username or email associated with the account |
| | | `domain` | String | Optional | Website domain or service name |
| | | `type` | String | Required: "login" \| "card" | Credential type - login credentials or payment card details |
| | | `encryptedData` | String | Required | Base64-encoded AES-256-GCM ciphertext produced by the Rust backend |
| | | `serviceId` | String | Optional | Service icon reference for branded display |
| | | `createdAt` | Timestamp | Auto (server) | Document creation timestamp |
| `users/{userId}/vaultConfig` | `main` | `encryptedVerifyHash` | String | Required | AES-256-GCM encrypted verification string used to validate the master password without storing it in plaintext |
| `users/{userId}/progress` | `data` | `xp` | Number | Default: 0 | Total experience points accumulated across all activities |
| | | `level` | Number | Range: 1-10 | Current user level, computed from XP thresholds |
| | | `totalScore` | Number | Default: 0 | Cumulative score across all activities |
| | | `streakDays` | Number | Default: 0 | Number of consecutive days with at least one activity |
| | | `lastActiveDate` | String | ISO 8601 date (YYYY-MM-DD) | Date of the user's last activity, used for streak calculation |
| | | `createdAt` | Timestamp | Auto (server) | Document initialisation timestamp |
| `users/{userId}/dailyTasks` | ISO date string (e.g., "2025-04-10") | `tasks` | Array of Objects | Required | Daily task list - each object contains `id`, `type`, `description`, `target`, `current`, `points`, and `completed` |
| | | `date` | String | Required | ISO date string matching the document ID |
| | | `totalScore` | Number | Default: 0 | Sum of completed task points for the day |
| | | `createdAt` | Timestamp | Auto (server) | Document creation timestamp |
| `users/{userId}/activities` | Auto-generated | `type` | String | Required | Activity type identifier (e.g., `scan_link`, `generate_password`, `quiz_round`) |
| | | `description` | String | Required | Human-readable description of the activity |
| | | `points` | Number | Default: 0 | XP earned from this activity |
| | | `metadata` | Map (String <-' String) | Optional | Additional context about the activity (e.g., URL scanned, algorithm used) |
| | | `createdAt` | Timestamp | Auto (server) | Activity timestamp |
| `users/{userId}/chatSessions` | Auto-generated | `title` | String | Required | Session title, auto-generated from the first user message |
| | | `createdAt` | Timestamp | Auto (server) | Session creation time |
| | | `updatedAt` | Timestamp | Auto (server) | Timestamp of the last message in the session |
| `users/{userId}/chatSessions/{sessionId}/messages` | Auto-generated | `role` | String | Required: "user" \| "assistant" | Message sender role |
| | | `content` | String | Required | Full text content of the message |
| | | `createdAt` | Timestamp | Auto (server) | Message timestamp |
| `users/{userId}/passwordHistory` | Auto-generated | `encryptedPassword` | String | Required | Base64-encoded encrypted password payload from the Rust crypto module |
| | | `pinned` | Boolean | Default: false | Whether the user has pinned this password for quick access |
| | | `entropy` | Number | Default: 0 | Calculated entropy in bits for the generated password |
| | | `createdAt` | Timestamp | Auto (server) | Generation timestamp |

### 5.2.1 Encryption in the Schema

A critical design decision is that no sensitive data is stored in plaintext. The `encryptedData` field in the `vault` collection and the `encryptedPassword` field in the `passwordHistory` collection both contain Base64-encoded ciphertext produced by the Rust `crypto.rs` module using AES-256-GCM with Argon2id key derivation. The master password itself is never transmitted to any server - only an encrypted verification hash is stored in `vaultConfig/main`, allowing the system to verify the password locally by attempting decryption and comparing the result against a known constant string.

This means that even if the Firestore database were compromised, all stored credentials would remain encrypted and unusable without the user's master password, which exists only in the client's memory during the active session.

### 5.2.2 Gamification Data Model

The gamification data is split across three collections that work together:

- **`progress/data`** stores the current state: total XP, level, streak count, and last active date. The level is derived from XP using a 10-tier threshold table (see Section 5.4.5), and the streak is calculated by comparing `lastActiveDate` with the current and previous calendar dates.

- **`dailyTasks/{date}`** stores seven daily objectives that reset each day. Each task has a type (scan, generate_password, check_password, create_credential, use_encryption, play_quiz, spot_phish), a target count, a current progress count, a point value, and a completion flag. The maximum daily score is 125 points.

- **`activities`** is an append-only log of every security action the user performs, storing the activity type, a description, XP earned, and optional metadata. The Dashboard retrieves the most recent 15 entries for the activity feed.

### 5.2.3 Firestore REST API Workaround

A significant technical constraint shaped the data access layer. Tauri's WebView2 runtime (based on Microsoft Edge) does not support the gRPC-web transport protocol used by the Firestore Web SDK. This means the standard Firestore `setDoc`, `getDoc`, and `updateDoc` functions fail silently or throw network errors when called from within the Tauri application.

To solve this, we implemented a custom REST API helper (`firestore-rest.ts`) that bypasses the Firestore SDK entirely and communicates with Firestore through standard HTTPS `fetch()` calls. The module provides two functions:

- **`firestoreGetDoc(collection, docId)`** - Sends a GET request to `https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/{collection}/{docId}`, authenticated with the user's Firebase ID token. Parses the Firestore REST field format (which wraps values in type objects like `{ stringValue: "..." }`, `{ integerValue: "42" }`) back into plain JavaScript objects.
- **`firestoreSetDoc(collection, docId, data)`** - Sends a PATCH request to the same endpoint, converting plain JavaScript objects into the Firestore REST field format before transmission.

This workaround is used for all write operations that require guaranteed delivery (user registration, vault setup) and as a fallback for any SDK operation that fails due to the WebView2 gRPC limitation. For read operations, we use the Firestore SDK with `experimentalForceLongPolling: true`, which forces the SDK to use HTTP long-polling instead of gRPC, and this works reliably in WebView2.

### 5.2.4 Root User Document

In addition to the subcollections listed in Table 5.1, the registration process creates a root document at `users/{userId}` with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | Firebase Authentication UID (matches document ID) |
| `email` | String | User's registered email address |
| `displayName` | String | User's chosen display name |
| `createdAt` | Timestamp | Account creation timestamp |
| `role` | String | User role, defaulting to "student" |

This root document serves as a lightweight user profile and enables future features such as a teacher dashboard or role-based access control.

---

## 5.3 User Interface Design

We adopted a cyberpunk/neon aesthetic because our target users are students aged 9-15, and we wanted the application to feel more like a game than a traditional security tool. The dark theme uses deep navy backgrounds (`cyber-void`) with neon crimson (`neon-crimson`) and violet (`neon-violet`) accents, glowing border effects, and animated transitions. A light theme is also available, automatically detected from the operating system preference. Navigation runs through a persistent sidebar with icon-labelled sections, and the entire application is rendered inside a frameless Tauri window with a custom title bar.

All core features are accessible within three clicks from the Dashboard. We describe the five key interfaces below.

### 5.3.1 Login Interface

The Login page is the entry point for returning users. It is wrapped in a `PublicRoute` guard that redirects already-authenticated users to the Dashboard.

The interface includes:

- **Email Input Field:** A text input with an envelope icon and placeholder text "Enter your email."
- **Password Input Field:** A masked password input with a lock icon and a visibility toggle button (eye icon) that reveals or hides the password.
- **Remember Me Checkbox:** A checkbox that enables Firebase's `browserLocalPersistence`, keeping the user logged in across application restarts.
- **Login Button:** A primary action button that triggers Firebase Authentication's `signInWithEmailAndPassword`. During authentication, the button displays a loading spinner and is disabled to prevent double submission.
- **Forgot Password Link:** A text link below the form that navigates the user to `/forgot-password`, where they can enter their email to receive a Firebase password reset link.
- **Register Link:** A text link at the bottom that navigates to `/register` for new users.

If authentication fails, the interface displays a red error banner below the form with a descriptive message (e.g., "Invalid email or password"). On success, the user is redirected to `/dashboard`.

### 5.3.2 Registration Interface

The Registration page allows new users to create an account. It is wrapped in a `PublicRoute` guard and a shared `AuthLayout` component that provides the centred card layout used across all authentication pages. The interface includes:

- **Email Input:** A text input with an envelope icon and validation for proper email format.
- **Display Name Input:** A text input with a user icon for the student's chosen display name.
- **Password Input:** A masked password input with a visibility toggle. As the student types, an inline `PasswordStrength` meter appears below, showing the strength level and encouraging the use of strong passwords from the moment of account creation. A minimum length of 12 characters is enforced.
- **Confirm Password Input:** A second masked input for password confirmation. A real-time match indicator appears below - a red "Passwords do not match" message when they differ, and a green "Passwords match" message when they are identical.
- **Terms Agreement Checkbox:** A checkbox requiring the user to agree to the Terms of Service and Privacy Policy, with clickable links to the `/terms` and `/privacy` pages. The submit button remains disabled until this checkbox is checked.
- **Submit Button:** A full-width gradient button labelled "Join Now" that triggers the registration flow: (1) `createUserWithEmailAndPassword` via Firebase Auth, (2) `updateProfile` to set the display name, and (3) `firestoreSetDoc` via the REST API to create the root user document in Firestore. During processing, the button displays a spinner and is disabled.
- **Sign-In Link:** A text link at the bottom that navigates to `/login` for existing users.

If registration fails (e.g., email already in use, weak password), a red error banner with a descriptive message appears above the submit button.

### 5.3.3 Forgot Password Interface

The Forgot Password page provides a two-state flow for password recovery, wrapped in `AuthLayout` and `PublicRoute`:

**Form State:**
- **Email Input:** A single text input with an envelope icon for entering the registered email address.
- **Error Banner:** A red error card that appears if the reset email fails to send (e.g., "user-not-found" or "invalid-email").
- **Send Reset Link Button:** A full-width gradient button labelled "Send Reset Link" that calls Firebase Auth's `sendPasswordResetEmail`. During processing, a spinner is shown.
- **Sign-In Link:** A text link navigating back to `/login`.

**Success State:**
After the reset email is sent successfully, the form transitions to a success screen with a spring animation: a large green checkmark icon inside a rounded badge, a "Check Your Inbox" heading, a confirmation message showing the submitted email address, and a "Back to Login" link. This clear two-state design ensures the user knows whether the action succeeded or failed.

### 5.3.4 Dashboard Interface

The Dashboard is the central hub - it is the first thing users see after logging in, and it provides an at-a-glance overview of the user's security progress and gamification statistics. The interface displays:

- **User Profile Section:** Shows the user's avatar (generated from initials using a deterministic colour algorithm), display name, and current level title with a colour-coded badge - Bronze for levels 1-3, Silver for levels 4-6, Gold for levels 7-9, and Platinum for level 10.
- **XP Progress Bar:** An animated progress bar showing the user's current XP relative to the next level threshold, with the numerical XP value displayed (e.g., "450 / 600 XP"). The bar fills smoothly when XP is earned.
- **Streak Counter:** Displays the number of consecutive active days with a flame icon and numerical count, encouraging daily engagement.
- **Security Score:** A composite score from 0-100 calculated from the user's XP, streak days, number of vault items, total activities, and completed daily tasks.
- **Daily Tasks Panel:** A list of seven daily objectives with progress indicators and completion checkmarks: scan a link (25 pts), generate a password (15 pts), check password strength (10 pts), save a credential (30 pts), use encryption (15 pts), play the quiz (15 pts), and spot phishing (15 pts). The panel shows completed/total tasks and a percentage.
- **Recent Activity Feed:** Displays the last 15 activities with type-specific icons, descriptions, and relative timestamps (e.g., "Scanned link: example.com - 2 minutes ago").
- **Quick Access Grid:** A grid of cards providing one-click navigation to all security tools, organised by category - Scanning Tools (Link Scanner, File Scanner, Photo Secrets), Password Tools (Password Maker, Test Password), Encryption & Vault (Secret Messages, My Vault), and Game Zone (Quiz Arena, Phishing Dojo, AI Agent).

The navigation flow is straightforward: the user logs in, lands on the Dashboard, and can reach any feature from the Quick Access Grid or the persistent sidebar. Every security action the user completes automatically updates the XP bar, streak counter, and activity feed in real time through the `useTrackActivity` hook.

*Figure 5.1: Dashboard Interface (Light Mode)*

### 5.3.5 Password Generator Interface

The Password Generator is a focused tool for creating cryptographically secure passwords. It is designed to be immediately intuitive - the user adjusts settings and the password regenerates automatically. The interface includes:

- **Configuration Panel:** A set of controls including:
  - A length slider ranging from 6 to 64 characters, with the current value displayed.
  - Toggle switches for four character types: uppercase letters, lowercase letters, numbers, and symbols.
  - An "exclude confusing characters" checkbox that removes easily confused characters (`i`, `l`, `L`, `I`, `|`, `` ` ``, `o`, `O`, `0`, `1`) from the character pool.
  - Preset buttons - Easy (8 characters), Good (12), Strong (16), Super (24) - that set the length and character type toggles to recommended configurations.
- **Generated Password Display:** A large monospace text field showing the generated password, with a copy-to-clipboard button (copies and shows a "Copied!" tooltip) and a regenerate button (dice icon).
- **Strength Indicator:** An animated colour-coded meter below the password with six levels - Too Weak (red), Weak (orange), Fair (yellow), Strong (green), Very Strong (emerald), Super Strong (cyan). The meter also displays the calculated entropy in bits and the size of the character pool used.
- **Educational Tips:** Contextual tips displayed below the generator that explain why password length and character variety matter, updating based on the current configuration.

The user adjusts the settings and the password generates automatically using `window.crypto.getRandomValues()` for cryptographic randomness. Copying the password triggers the activity tracking system: it awards +5 XP, logs a `generate_password` activity, and increments the daily task counter.

*Figure 5.2: Password Generator Interface (Light Mode)*

### 5.3.6 Link Scanner Interface

The Link Scanner checks URLs against VirusTotal's database of 70+ security engines. It provides both immediate threat assessment and a scan history for reference. The interface includes:

- **URL Input Field:** A text input with a link icon, placeholder text "Enter a URL to check...", and a prominent "Scan" button with a search icon.
- **Loading State:** During scanning, a pulsing animation plays with the text "Analysing URL... This may take a moment," indicating that the Rust backend is submitting the URL to VirusTotal and polling for results.
- **Scan History:** A collapsible panel showing the last 10 scanned URLs, each with a status badge - green checkmark for clean, red warning for malicious, yellow alert for suspicious - along with the detection count and scan time.
- **Results Panel:** Upon scan completion, the results panel animates in with:
  - **Status Badge:** A large colour-coded badge displaying "Clean" (green), "Suspicious" (yellow), or "Malicious" (red).
  - **Statistics Summary:** Four stat cards showing the count of security engines that flagged the URL as malicious, suspicious, harmless, or undetected.
  - **Reputation Score:** A numerical community reputation indicator from VirusTotal's community voting system.
  - **Engine Results Table:** A detailed table listing each security engine (e.g., Google Safebrowsing, Kaspersky, McAfee, Sophos) with its individual detection result and category.

The user enters a URL and clicks "Scan." The frontend validates the URL format, calls the Tauri IPC `scan_url` command, and displays the loading state. The Rust backend submits the URL to VirusTotal and polls for results at 4-second intervals (typically completing in 12-18 seconds). Once done, the results panel renders. The user earns +10 XP, the scan is logged as a `scan_link` activity, and the daily scan task is incremented.

*Figure 5.3: Link Scanner Interface (Light Mode)*

### 5.3.7 Encryption Lab Interface

The Encryption Lab allows students to encrypt and decrypt text messages using three different algorithms, serving both as a practical tool and as an educational introduction to cryptography. The interface includes:

- **Mode Toggle:** A segmented control at the top to switch between "Encrypt" and "Decrypt" modes.
- **Algorithm Selector:** Three radio-style buttons for choosing the encryption algorithm - AES-256-GCM (default, recommended), ChaCha20-Poly1305, and AES-128-CBC - each with a brief description of its characteristics.
- **Input Area:** A multi-line text area for entering the plaintext (in encrypt mode) or the encrypted Base64 string (in decrypt mode).
- **Password Input:** A masked password field with visibility toggle, used as the encryption key seed. In encrypt mode, a confirmation field appears to prevent typos.
- **Output Area:** A read-only text area displaying the result - the Base64-encoded encrypted string (in encrypt mode) or the decrypted plaintext (in decrypt mode). A copy-to-clipboard button is provided.
- **Process Explanation:** An expandable section below the output that explains the steps performed (key derivation, encryption, encoding), helping students understand what happens behind the scenes.

The user enters text, sets a password, selects an algorithm, and clicks "Encrypt." The frontend calls the Tauri IPC `encrypt_text` command, which runs the encryption entirely on the local device in Rust. The encrypted output is a double-encoded Base64 string (JSON payload containing algorithm, salt, IV, and ciphertext - all individually Base64-encoded). The user can share this string and the password with a friend, who can paste it into decrypt mode to recover the original message. This round-trip flow teaches the concept of symmetric encryption in a tangible way. Each encryption or decryption action awards +5 XP and logs a `generate_encryption` activity.

*Figure 5.4: Encryption Lab Interface (Light Mode)*

### 5.3.8 Phishing Dojo Interface

The Phishing Dojo is a gamified training exercise where students practise identifying phishing emails. It presents realistic email scenarios and provides detailed feedback on each classification. The interface includes:

- **Difficulty Selection:** Three tier buttons - Cadet (levels 1-3, basic phishing indicators), Analyst (levels 4-6, more sophisticated scams), and Operator (levels 7+, advanced social engineering) - each with a distinct colour and description. The system highlights the tier matching the user's current level.
- **Email Display:** A simulated email client view showing the sender name, sender email address, subject line, and body text of the current email, rendered in a realistic email layout with proper formatting. Emails are drawn from a pool of 23 scenarios across the three tiers, each carefully crafted to include realistic phishing indicators or to be genuinely legitimate.
- **Classification Buttons:** Two large action buttons - "Phishing!" (red, with a warning icon) and "Legitimate" (green, with a shield icon) - for the user to classify the email.
- **Feedback Panel:** After classification, a detailed feedback section slides in showing:
  - **Correct/Incorrect Indicator:** Visual confirmation with a checkmark or X icon.
  - **Red Flags List:** For phishing emails, a numbered list of identified red flags with explanations (e.g., "Suspicious Sender: The email claims to be from PayPal but the domain is `paypa1-security.com` - note the number 1 replacing the letter l", "Urgency Tactics: The email pressures you to act immediately or your account will be closed").
  - **Explanation:** A paragraph explaining why the email is or is not phishing, written in student-friendly language.
- **Progress Tracker:** Shows the current round number (e.g., "Email 3 of 5"), correct count, current streak, and accumulated XP for the session.
- **Summary Screen:** After all 5 emails, a results summary displays the total correct count, XP earned (broken down into base XP, streak bonus, and completion bonus), and a "Play Again" button.

The user selects a difficulty tier, reads each of the 5 presented emails, classifies them, and receives immediate educational feedback. This design directly addresses the education-protection gap identified by Zhang-Kennedy and Chiasson (2021) by combining practical skill development with conceptual understanding.

*Figure 5.5: Phishing Dojo Interface (Light Mode)*

### 5.3.9 Credential Vault Interface

The Credential Vault stores login credentials and payment card details securely behind a master password. It is the most security-critical interface in CHEA and required careful design to be both safe and usable for young students. The interface includes:

- **Vault Lock Screen:** Before accessing the vault, the user must enter their master password. The input field has a lock icon and a visibility toggle. If the user has not set up the vault before, a "Set Up Vault" flow is shown instead, with fields for creating and confirming a master password, along with guidance text explaining the importance of choosing a strong, memorable password.
- **Credential List:** After unlocking, a searchable list of stored credentials is displayed. Each entry is shown as a card with the service icon (22 branded icons including Google, GitHub, Netflix, etc.), service name, partially masked username, and a type badge (login or card).
- **Credential Detail View:** Clicking a credential expands it to reveal the full username (with a copy button), the password (masked by default with dots, with a reveal/hide toggle and a copy button), and the associated domain. For card-type credentials, a visual credit card display with a gradient background shows the card brand logo (Visa, Mastercard, Amex, or Discover), the masked card number, and the cardholder name.
- **Add Credential Form:** A modal form with fields for service name (with a dropdown of 22 pre-configured services for auto-completing the icon), username or email, password (with an integrated "Generate" button that opens the password generator inline), and credential type (login or card). For card type, additional fields appear for card number, cardholder name, expiry date, and CVV. All sensitive data is encrypted client-side using AES-256-GCM via the Rust backend before being sent to Firestore.
- **Delete Confirmation:** A confirmation dialog with a warning message appears before removing a credential, requiring the user to click "Delete" to confirm.

The user navigates to the Vault, enters their master password to unlock it, and views their saved credentials. They can search by service name, add new credentials (encrypted with their master password), copy usernames and passwords to the clipboard, reveal masked passwords, and delete entries. Each credential save action awards +20 XP (the highest reward in the system, incentivising vault usage) and logs a `create_credential` activity.

*Figure 5.6: Credential Vault Interface (Light Mode)*

### 5.3.10 AI Agent Interface

The AI Agent is a full-page cybersecurity chatbot powered by a large language model accessed through the OpenRouter API. It is one of CHEA's distinguishing features - as shown in the comparative analysis (Table 2.1), CHEA is the only platform that combines practical security tools, gamified education, and an AI-powered assistant in a single application. The interface is designed to feel like a modern messaging application, making it approachable for students aged 9-15. The interface includes:

- **Session Sidebar:** A collapsible panel on the left showing the user's chat session history. Each session displays an auto-generated title (derived from the first user message), the creation date, and a delete button. Clicking a session loads its full message history. A "New Chat" button at the top creates a fresh session.
- **Chat Message Area:** The central area displays the conversation as a scrollable list of message bubbles. User messages appear on the right with a crimson accent background, while AI responses appear on the left with a dark surface background. The area auto-scrolls to the latest message.
- **Streaming Response Display:** When the AI is generating a response, text appears character-by-character in real time, simulating a typing effect. A blinking cursor at the end of the streaming text indicates that the response is still being generated. This streaming behaviour is achieved through Server-Sent Events (SSE) parsed in the Rust backend and forwarded to the frontend via Tauri's `Channel<String>` IPC mechanism.
- **Markdown and Mermaid Rendering:** AI responses are rendered as formatted markdown, supporting headings, bold/italic text, bullet lists, numbered lists, code blocks with syntax highlighting, and inline code. When the AI generates a Mermaid diagram (e.g., a flowchart explaining how phishing works), it is rendered as a visual diagram directly in the chat using the Mermaid.js library, with an option to save the diagram as an SVG file.
- **Input Area:** A text input field at the bottom of the chat with a send button (arrow icon). The input supports multi-line text (expanding textarea) and submits on Enter (or Shift+Enter for a new line). A placeholder text reads "Ask me anything about cybersecurity..."
- **Topic Restriction Indicator:** A small badge above the chat area reads "Cybersecurity & AI topics only," informing the user that the chatbot is restricted to answering security-related questions. If the user asks an off-topic question (e.g., "What's the weather?"), the AI politely redirects them to cybersecurity topics.
- **NovaChat Widget (Companion):** On all other dashboard pages, a floating chat bubble in the bottom-right corner provides quick access to a mini version of the AI assistant. Clicking the bubble opens a compact overlay chat panel, allowing students to ask questions without leaving their current tool. The full AI Agent page is excluded from showing this widget to avoid nested chat interfaces.

The user navigates to the AI Agent from the sidebar or dashboard. They can create a new session or continue an existing one. As they type and send messages, the Rust backend prepends a cybersecurity-focused system prompt, forwards the request to OpenRouter, and streams the response back in real time. Each chat interaction awards +5 XP and logs a `chat_ai` activity, incentivising students to explore and ask questions.

*Figure 5.7: AI Agent Interface (Light Mode)*

### 5.3.11 Navigation and Layout

All authenticated pages share a common `DashboardLayout` that provides:

- **Persistent Sidebar:** A collapsible sidebar (256px wide on desktop, slide-in overlay on mobile) with navigation items organised into four labelled sections - Scanning Tools (Link Checker, File Checker, Photo Secrets), Password Tools (Make Password, Test Password), Encryption & Vault (Secret Codes, Treasure Box), and Game Zone (Quiz Arena, Phishing Dojo). Two standalone items sit above the sections: Home (Dashboard) and Ask Nova (AI Agent). Each item has a Lucide icon and text label. The current page is highlighted with a neon accent colour and a small dot indicator on the right. Icons scale up on hover, turning crimson in dark mode and violet in light mode. A footer area at the bottom provides access to Settings and a Logout button, with a small padlock icon and "AES-256 Encrypted" label for reassurance.
- **Header Bar:** An 80px-tall bar displaying, on the left, a mobile menu hamburger button and a greeting message ("Hey, [Name]!" with a waving hand emoji). On the right: a streak pill (flame icon + day count), an XP pill (zap icon + XP value), a theme toggle (sun/moon icon), a language switcher (EN/AR), and the user's avatar inside an animated rotating gradient ring with a level badge overlay. The avatar can be a custom photo uploaded by the user or gradient-initials generated from their display name (managed via `avatar.ts`, which persists the choice in `localStorage` and broadcasts changes via a custom DOM event).
- **NovaChat Widget:** A floating AI chat bubble (small icon in the bottom-right corner) that provides quick access to the AI assistant from any page except the full AI Agent page. Clicking it opens a mini chat panel overlay.
- **MusicPlayer Widget:** An optional floating music player in the bottom-right corner (positioned above NovaChat when both are visible). In its collapsed state, it shows a pulsing music note icon, the current song title and artist, and a play/pause toggle. Expanding it reveals playback controls (previous, play/pause, next), a track progress bar, and a volume slider. The widget is draggable via a grip handle, and its position is persisted in `localStorage`. A playlist of seven ambient songs plays in the background. The entire widget can be toggled on or off from the Settings page.
- **Custom Title Bar:** Since the Tauri window is frameless, a custom title bar with drag-to-move, minimise, and close buttons is rendered at the very top.

The layout uses React Router's `<Outlet />` component to render the current page's content in the main area between the sidebar and header. Framer Motion provides page transition animations - pages slide in from the right when navigating forward and fade out when navigating back.

### 5.3.12 Internationalisation and Accessibility

CHEA was designed to be accessible to a broad student population, including Arabic-speaking users. The application implements full bilingual support, right-to-left layout adaptation, and theme accessibility features.

**Bilingual Support (English and Arabic):**

The application uses the i18next internationalisation framework with 20 translation namespaces covering every page and component. Complete locale files exist for both English (`en`) and Arabic (`ar`), translating all UI text including navigation labels, button text, form placeholders, error messages, tooltips, educational tips, quiz questions, phishing email scenarios, and system prompts. A `LanguageSwitcher` component in the header bar allows users to toggle between English and Arabic at any time without reloading the application. The selected language is persisted in `localStorage` and restored on subsequent sessions. On first launch, the language is auto-detected from the browser's `navigator.language` setting.

**Right-to-Left (RTL) Layout:**

When Arabic is selected as the active language, a custom `useRTL` hook detects the change and applies the `dir="rtl"` attribute to the document root. This causes the entire layout to mirror: the sidebar moves from the left to the right side, text alignment shifts from left-aligned to right-aligned, the reading direction of lists and cards reverses, and form input fields adapt their text direction. Icon positions within buttons and badges are also adjusted to maintain visual consistency in the mirrored layout. This ensures that Arabic-speaking students experience a natural, native-feeling interface rather than a forced left-to-right layout with translated text.

**Theme and Visual Accessibility:**

The application supports both dark and light themes, with automatic detection of the operating system's colour scheme preference via the `prefers-color-scheme` CSS media query. A `ThemeProvider` context manages the theme state, persisted in `localStorage`, and applies the `.dark` CSS class to the document root for dark mode. All colour combinations are designed to maintain a minimum contrast ratio compliant with WCAG 2.1 AA guidelines, ensuring readability for users with visual impairments. All interactive elements (buttons, links, form inputs, sidebar items) are reachable via keyboard navigation using the Tab key, with visible focus indicators.

These accessibility features directly address NFR-06 (Accessibility) from Chapter 4 and the age-appropriateness gap identified by Saؤںlam and Miller (2023), ensuring that CHEA is usable by students regardless of their language preference or visual capabilities.

### 5.3.13 File Scanner Interface

The File Scanner allows students to check files for malware by computing a local SHA-256 hash and checking it against VirusTotal's database of known threats. It follows the same visual pattern as the Link Scanner but adds file-specific elements. The interface includes:

- **Upload Card (idle state):** A centred card with a large UploadCloud icon (64px) that rotates and scales on hover, a "Ready to Scan" heading, descriptive text about the scanning process, and a prominent gradient "Pick a File" button that opens a native file picker dialog via Tauri's `open` command. A small disclaimer notes the maximum supported file size.
- **Scanning State:** Replaces the upload card with a spinning ring animation, a pulsing Shield icon, an "Analysing File" heading, and a shimmer-animated progress bar that increments to 95% while waiting for results.
- **Results Panel (post-scan):** Upon scan completion, displays:
  - **Status Hero Card:** Colour-coded by result (red for malicious, orange for suspicious, green for clean), showing a large rotated shield icon, a status heading (e.g., "Danger Found!"), the filename badge, and a 3-column statistics grid (Dangers, Warnings, Safe counts).
  - **Info Grid:** Three cards in a row - File Info (size and status badge), Detection Meter (progress bar showing flagged engines vs. total), and File Fingerprint (SHA-256 hash in monospace font).
  - **Danger Warning Banner (malicious only):** A red-tinted card with action buttons: "Quarantine" (orange) and "Delete Forever" (red).
  - **Expert Analysis Table:** A detailed table listing each security engine's name with a pass/fail icon, its detection result, and a colour-coded verdict badge.
- **Scan History (idle state):** A 2-column grid showing the last 10 scanned files, each with a gradient icon, filename, date, and status badge.

The user selects a file, the Rust backend computes its SHA-256 hash locally, checks VirusTotal for cached results, and only uploads the file if no cached report exists. Each scan awards +15 XP.

*Figure 5.8: File Scanner Interface (Light Mode)*

### 5.3.14 Password Checker Interface

The Password Checker (Test Password) analyses the strength of an existing password in real time, providing entropy calculation, crack-time estimation, and actionable improvement suggestions. It is the educational companion to the Password Generator - while the Generator creates strong passwords, the Checker explains why a given password is weak or strong. The interface includes:

- **Password Input:** A full-width input field with a lock icon prefix, monospace bold font for the entered password, and an eye toggle to reveal or hide the text.
- **Strength Label:** Appears below the input as the user types, showing the current strength classification (Weak, Fair, Good, Excellent).
- **Status Hero Card (after input):** Colour-coded by strength level (red for weak, amber for fair, emerald for strong, indigo for excellent), displaying a large rotated shield icon, the strength verdict, the password in a monospace badge, and a 3-column statistics row: Score (out of 8), Entropy (in bits), and Crack Time.
- **Time to Crack Card:** Shows the estimated brute-force time in large text (e.g., "Instantly", "3 hours", "2 years", "Centuries"), with an entropy quality message. The icon and colour change by severity - a lightning bolt for instant, a calendar for centuries, an infinity symbol for "forever."
- **Security Checks Card:** Five rows with checkmark or cross icons: length â‰¥ 12 characters, contains uppercase, contains lowercase, contains numbers, contains special characters. Each row is tinted green or red.
- **Recommendations Panel:** Appears when the score is below 7, listing specific improvement tips in an amber-tinted card. For excellent passwords (score â‰¥ 7), a green congratulations card is shown instead.

The analysis is computed entirely on the frontend using entropy-based calculations (see Algorithm 5.4). Each check awards +3 XP and logs a `check_password` activity.

*Figure 5.9: Password Checker Interface (Light Mode)*

### 5.3.15 Quiz Arena Interface

The Quiz Arena is a gamified cybersecurity knowledge quiz with multiple-choice questions across three difficulty tiers. It uses the same tier system as the Phishing Dojo - Cadet (levels 1-3), Analyst (levels 4-6), and Operator (levels 7+) - with questions drawn from a pool of 45 questions (15 per tier). The interface has three states:

**Welcome Screen:** A centred card with an animated brain emoji (scaling and rotating), the "Quiz Arena" title, a tier badge showing the user's current difficulty level and an emoji, a rules summary card (5 questions per round, streak tracking, explanations for each answer), and a gradient "Start Quiz" button.

**Playing Screen:** Displays one question at a time:
- **Progress Header:** A home button on the left, a streak counter pill (flame icon, visible when streak > 0), and a question counter (e.g., "2/5") on the right, with a thin gradient progress bar below.
- **Question Card:** A tier label at the top, the question text in large bold font, and four answer option buttons (A, B, C, D). After answering, the letter badge transforms into a checkmark (correct, highlighted green) or a cross (incorrect, highlighted red), while the correct answer is always highlighted green.
- **Explanation Card:** Slides in after each answer with a random encouragement phrase for correct answers (e.g., "Cyber Ninja!") or a supportive message for wrong ones, followed by a detailed explanation of the correct answer.

**Results Screen:** After all 5 questions, a centred card displays a grade emoji (trophy, star, etc.), a grade label, and a 3-column statistics row (Correct count, Best Streak, XP Earned). An animated score bar fills proportionally with colour-coded gradients. "Play Again" and "Back to Dashboard" buttons are provided.

XP is calculated using the same formula as the Phishing Dojo (see Algorithm 5.10): base XP per correct answer, streak bonus, and completion bonus for perfect or strong performance.

*Figure 5.10: Quiz Arena Interface (Light Mode)*

### 5.3.16 Image Privacy (Photo Secrets) Interface

The Image Privacy scanner helps students understand what hidden information is embedded in their photos - particularly GPS coordinates, camera details, and timestamps - and provides a one-click metadata stripping function. The interface includes:

- **Upload Card (idle state):** A centred card with a large Search icon, a "Ready to Scan" heading, a description of what EXIF data can reveal, a "Pick Photo" gradient button, and a note about supported formats (JPEG and PNG).
- **Processing State:** A spinning ring animation with a pulsing image icon, an "Analysing Photo" heading, and a shimmer progress bar.
- **Results Panel (post-scan):** Upon scan completion, displays:
  - **Status Hero Card:** Colour-coded by EXIF status (amber if metadata is found, green if clean or after cleaning). Shows a privacy report label, the filename, and a 3-column statistics row (Secrets found, Risks identified, Clean status). Two action buttons: "Clean Photo" (gradient CTA, enabled only when EXIF is present) and a reset button.
  - **File Information Grid:** Three cards - File Info (type, format, file size), Photo Shape (width, height, megapixels), and System Times (created and modified timestamps).
  - **EXIF Detail Cards (shown when EXIF is found):** Four cards in a 2-column grid:
    - GPS Location (marked "HIGH RISK"): Red-tinted card showing latitude/longitude coordinates and a location name. A "View on Map" button opens the GPS coordinates in Google Maps. A privacy tip box explains the risk. After cleaning, this card fades to 50% opacity.
    - Device/Camera Identity ("MEDIUM RISK"): Amber-tinted card showing brand, model, and software used. Includes a "Did You Know" tip.
    - EXIF Timestamps: Shows original and digitised dates with a "Time Travel" tip.
    - Camera Settings: Shows aperture, ISO, focal length, and exposure time with a "Tech Talk" tip.
  - **Advanced Toggle:** A "Show More / Show Less" button that expands additional EXIF fields (flash, white balance, orientation, resolution).
- **Success Message:** A green card with a checkmark icon appears after successful metadata stripping.
- **Scan History (idle state):** A 2-column grid of previous scans with status badges.

The user selects a photo, the Rust backend extracts all EXIF metadata (see Algorithm 5.7), and the results are displayed with risk-appropriate colouring. The "Clean Photo" button triggers the stripping algorithm (see Algorithm 5.8), which removes all EXIF segments while preserving the image pixels. Each scan awards +10 XP.

*Figure 5.11: Image Privacy Interface (Light Mode)*

### 5.3.17 Settings Interface

The Settings page provides account management, security configuration, and user preferences in a tabbed layout. It is the only page where users can set up their vault master password, choose an avatar, and configure the music player. The interface includes:

- **Tab Navigation:** A rounded card with three tab buttons - Profile (with an emoji icon), Security, and Preferences. The active tab has a crimson-to-violet gradient background; inactive tabs are muted.

**Profile Tab:**
- **Profile Card:** A card with a gradient top banner, showing the user's avatar (96px, rounded), a camera edit button that appears on hover, the display name, email, and a green "Account Active" status label.
- **Avatar Picker:** An expandable section with two options - upload a custom photo (dashed border upload area with an image icon) or choose from a grid of 17 preset avatar thumbnails that scale and lift on hover. Avatar selection is persisted in `localStorage` and broadcast to other components via a custom DOM event.
- **Form Fields:** A display name input (editable) and a read-only email input (greyed out with a "can't change" note).

**Security Tab:**
- **Vault Password Card:** A card with a green top bar and lock icon header. Depending on whether the vault has been set up, it shows either a "Set Up Vault Password" flow (new password + confirm) or a "Change Vault Password" flow (current password + new password + confirm). Success and error messages appear in a coloured banner.
- **Auto-Lock Timer Card:** A card with a blue top bar and clock icon header. An animated toggle switch enables or disables the auto-lock feature. When enabled, a 2أ-4 grid of time options appears (5 minutes, 15 minutes, 30 minutes, 1 hour) with emoji icons, allowing the user to choose how long the vault stays unlocked before requiring re-authentication.

**Preferences Tab:**
- **Music Player Card:** A card with a purple top bar and music icon header, containing a toggle switch to show or hide the floating MusicPlayer widget across the application.
- **Notifications Card:** A card with an amber top bar and bell icon header, with two toggle rows for email alerts and push notifications.

- **Save Button:** A fixed gradient button in the bottom-right corner that changes to a green "Saved!" confirmation briefly on click.

*Figure 5.12: Settings Interface (Light Mode)*

### 5.3.18 Calculator Interface

A simple but fully functional calculator accessible from the dashboard routes at `/dashboard/calculator`. It provides basic arithmetic operations and is included as a supplementary utility for students. The interface includes:

- **Display Area:** A dark-background, right-aligned area with a small history line showing the previous operation and a large monospace display (4-5xl font) showing the current number or result.
- **Keypad:** A 4-column grid of themed buttons - function buttons (AC, CE, backspace) with a secondary background, operator buttons (أ·, أ-, âˆ', +) with a primary-tinted background, number buttons (0-9) with a muted background, a percentage button, and a gradient equals button. Row 5 contains percent, zero, decimal point, and equals.
- **Footer:** A keyboard shortcuts hint.

The calculator is a lightweight utility that does not track XP or log activities.

### 5.3.19 Terminal Interface

An embedded terminal emulator accessible from the dashboard routes at `/dashboard/terminal`. It provides a PowerShell environment (on Windows) or Bash (on Unix) running inside the application, useful for students learning command-line cybersecurity tools. The interface includes:

- **Header Bar:** A thin bar with a "Terminal" heading and a "PowerShell" label.
- **Terminal Area:** An xterm.js-based terminal rendering in a dark (#1e1e1e) background container (minimum height 400px), using a VS Code dark colour theme with custom ANSI colours. Supports Ctrl+V for paste and Ctrl+C for copy. The terminal connects to a Tauri pseudo-terminal (PTY) backend via IPC - user keystrokes are sent through the `write_to_pty` command, and PTY output is received via the `pty-output` event listener. The terminal auto-resizes when the window is resized.

The terminal is an advanced utility included for students who want to explore command-line interfaces. It does not track XP or log activities.

---

## 5.4 Application Architecture

This section describes the architectural patterns that underpin CHEA's frontend: the routing system with authentication guards, the global state management layer using Zustand, and the reusable UI component library.

### 5.4.1 Routing and Navigation Architecture

CHEA uses React Router DOM v6 with a nested route configuration defined in `App.tsx`. The routing architecture enforces two access control patterns:

**PublicRoute Guard:** Wraps authentication pages (`/login`, `/register`, `/forgot-password`). If the user is already authenticated (checked via `useAuthStore`), the guard redirects to `/dashboard`, preventing logged-in users from accessing the login or registration pages.

**ProtectedRoute Guard:** Wraps all dashboard routes. If no authenticated user exists in the store, the guard redirects to `/login`, preventing unauthenticated access to security tools and personal data.

The route tree is structured as follows:

| Route | Guard | Page Component |
|-------|-------|----------------|
| `/` | None | Redirects to `/login` |
| `/login` | PublicRoute | Login |
| `/register` | PublicRoute | Register |
| `/forgot-password` | PublicRoute | ForgotPassword |
| `/terms` | None (public) | TermsOfService |
| `/privacy` | None (public) | PrivacyPolicy |
| `/dashboard` | ProtectedRoute <-' DashboardLayout | Nested child routes |
| `/dashboard` (index) | Protected | Dashboard |
| `/dashboard/link-scanner` | Protected | LinkScanner |
| `/dashboard/file-scanner` | Protected | FileScanner |
| `/dashboard/metadata` | Protected | ImagePrivacy |
| `/dashboard/password-gen` | Protected | PasswordGenerator |
| `/dashboard/password-check` | Protected | PasswordChecker |
| `/dashboard/encryption` | Protected | Encryption |
| `/dashboard/vault` | Protected | CredentialVault |
| `/dashboard/ai-agent` | Protected | AIAgent |
| `/dashboard/quiz-arena` | Protected | QuizArena |
| `/dashboard/phishing-dojo` | Protected | PhishingDojo |
| `/dashboard/calculator` | Protected | Calculator |
| `/dashboard/settings` | Protected | Settings |
| `/dashboard/*` | Protected | 404 Page Not Found |

The `DashboardLayout` component renders a persistent sidebar, header, and floating widgets (NovaChat, MusicPlayer) around an `<Outlet />` that displays the current child route's page content.

### 5.4.2 State Management Architecture

Global state is managed through four Zustand stores, each responsible for a distinct domain. Zustand was chosen over Redux or Context API for its minimal boilerplate, automatic re-render optimisation, and ability to access state outside React components (useful for route guards).

**`useAuthStore`** - Manages Firebase authentication state and vault session:
- `user: User | null` - The current Firebase user object, updated by the `onAuthStateChanged` listener.
- `loading: boolean` - True during auth initialisation (app shows a full-screen spinner).
- `masterPassword: string | null` - Held in memory only during the active vault session; never persisted. Cleared on logout or vault lock.

**`useActivityStore`** - Manages the user's recent activity log:
- `activities: Activity[]` - Array of the 15 most recent activity entries.
- `fetchActivities(userId)` - Retrieves from Firestore's `activities` subcollection, sorted by `createdAt` descending.
- `logActivity(userId, type, metadata)` - Appends a new activity entry.

**`useUserProgressStore`** - Manages gamification state:
- `progress: UserProgress | null` - The user's XP, level, streak, and score data.
- `levelInfo` - Computed from XP using the 10-tier threshold table.
- `fetchProgress(userId)` - Reads from `progress/data`.
- `earnXp(userId, points)` - Adds XP, recalculates level, updates streak (see Algorithm 5.12).

**`useDailyTasksStore`** - Manages daily task completion:
- `tasks: DailyTasksData | null` - Today's task list and completion status.
- `summary` - Computed: completed count, total count, percentage.
- `fetchTasks(userId)` - Reads from `dailyTasks/{today}`.
- `completeTask(userId, taskType)` - Increments the matching task's counter.

These four stores are integrated through the `useTrackActivity` custom hook, which centralises the gamification pipeline: when a user completes any security action, a single call to `useTrackActivity(userId, type, metadata)` logs the activity, awards XP, and increments the relevant daily task - all in sequence.

### 5.4.3 Reusable UI Component Library

CHEA includes a library of 11 reusable UI components in `src/components/ui/`, used across all pages for visual consistency:

| Component | Purpose |
|-----------|---------|
| `Button` | Primary, secondary, ghost, and danger variants with gradient backgrounds, hover/tap animations, loading spinner, and `forwardRef` support |
| `Input` | Text input with icon prefix support, label, error state, and consistent styling |
| `Card` | Container with rounded-3xl borders, optional gradient header strip, and consistent padding |
| `Checkbox` | Styled checkbox with label, used for terms agreement and feature toggles |
| `PasswordInput` | Input with built-in visibility toggle (eye/eye-off icon) for masked password fields |
| `PasswordStrength` | Animated colour-coded strength meter (6 levels) with entropy display, used on the Register page and Password Generator |
| `TitleBar` | Custom frameless window title bar with drag-to-move area, minimise and close buttons |
| `ThemeToggle` | Sun/moon icon button that switches between dark and light mode via `ThemeProvider` |
| `LanguageSwitcher` | EN/AR toggle button that changes the i18next language and triggers RTL layout adaptation |
| `NovaChat` | Floating AI chat bubble widget with expandable mini chat panel, rendered on all pages except AI Agent |
| `MusicPlayer` | Floating draggable music player widget with play/pause, skip, volume, and playlist controls |

All components follow the same design patterns: functional components with TypeScript interfaces, Tailwind CSS utility classes with `cn()` for conditional styling, Framer Motion for animations, and consistent use of the cyberpunk colour system.

---

## 5.5 Algorithm Design

This section presents the pseudocode for all core algorithms implemented in CHEA. These algorithms are divided into two categories: security algorithms (encryption, decryption, password generation, password strength analysis, URL scanning, file scanning, and image metadata processing) implemented in the Rust backend, the AI chatbot with streaming responses, and gamification algorithms (XP calculation and level progression) implemented in the TypeScript frontend services.

### 5.5.1 Encryption Algorithm

The encryption algorithm supports three ciphers - AES-256-GCM, ChaCha20-Poly1305, and AES-128-CBC - all using Argon2id for key derivation. It is implemented in the Rust `crypto.rs` module and is used for both the Encryption Lab feature and the Credential Vault. Every encryption operation generates a unique random salt and nonce, ensuring that encrypting the same plaintext with the same password always produces different ciphertext.

**Algorithm 5.1: Encrypt Text**

```
FUNCTION encrypt_text(plaintext, password, algorithm):
    // Step 1: Generate random salt (128 bits) using OS cryptographic RNG
    salt <-گ generate_random_bytes(16)

    // Step 2: Derive encryption key using Argon2id
    IF algorithm = "AES-256-GCM" OR algorithm = "ChaCha20-Poly1305" THEN
        key_length <-گ 32  // 256-bit key
    ELSE IF algorithm = "AES-128-CBC" THEN
        key_length <-گ 16  // 128-bit key
    END IF
    key <-گ argon2id_derive(password, salt, key_length)

    // Step 3: Generate random nonce or IV
    IF algorithm = "AES-256-GCM" OR algorithm = "ChaCha20-Poly1305" THEN
        nonce <-گ generate_random_bytes(12)  // 96-bit nonce
    ELSE IF algorithm = "AES-128-CBC" THEN
        iv <-گ generate_random_bytes(16)     // 128-bit IV
    END IF

    // Step 4: Encrypt plaintext with selected algorithm
    IF algorithm = "AES-256-GCM" THEN
        ciphertext <-گ AES_256_GCM_encrypt(key, nonce, plaintext)
        // Output includes 16-byte authentication tag appended to ciphertext
    ELSE IF algorithm = "ChaCha20-Poly1305" THEN
        ciphertext <-گ ChaCha20_Poly1305_encrypt(key, nonce, plaintext)
        // Output includes 16-byte Poly1305 authentication tag
    ELSE IF algorithm = "AES-128-CBC" THEN
        padded_plaintext <-گ PKCS7_pad(plaintext, block_size=16)
        ciphertext <-گ AES_128_CBC_encrypt(key, iv, padded_plaintext)
    END IF

    // Step 5: Build serialisable payload
    payload <-گ {
        alg: algorithm,
        salt: base64_encode(salt),
        iv: base64_encode(nonce OR iv),
        ct: base64_encode(ciphertext)
    }
    json_string <-گ serialise_to_json(payload)
    result <-گ base64_encode(json_string)

    RETURN result
END FUNCTION
```

### 5.5.2 Decryption Algorithm

The decryption algorithm reverses the encryption process. It auto-detects the algorithm from the payload and derives the key using the same Argon2id parameters. For AEAD modes (AES-256-GCM and ChaCha20-Poly1305), the authentication tag is verified during decryption - any tampering with the ciphertext is detected and the operation fails.

**Algorithm 5.2: Decrypt Text**

```
FUNCTION decrypt_text(encoded_string, password):
    // Step 1: Decode outer Base64 layer
    json_bytes <-گ base64_decode(encoded_string)
    json_string <-گ utf8_decode(json_bytes)
    payload <-گ deserialise_from_json(json_string)

    // Step 2: Decode individual payload fields
    salt <-گ base64_decode(payload.salt)
    iv <-گ base64_decode(payload.iv)
    ciphertext <-گ base64_decode(payload.ct)

    // Step 3: Derive key using the same Argon2id parameters
    IF payload.alg = "AES-256-GCM" OR payload.alg = "ChaCha20-Poly1305" THEN
        key <-گ argon2id_derive(password, salt, 32)
    ELSE IF payload.alg = "AES-128-CBC" THEN
        key <-گ argon2id_derive(password, salt, 16)
    END IF

    // Step 4: Decrypt and verify integrity
    IF payload.alg = "AES-256-GCM" THEN
        plaintext <-گ AES_256_GCM_decrypt(key, iv, ciphertext)
        // Authenticated decryption: automatically verifies the 16-byte tag
        // Fails if ciphertext has been modified
    ELSE IF payload.alg = "ChaCha20-Poly1305" THEN
        plaintext <-گ ChaCha20_Poly1305_decrypt(key, iv, ciphertext)
        // Verifies the Poly1305 MAC before returning plaintext
    ELSE IF payload.alg = "AES-128-CBC" THEN
        decrypted <-گ AES_128_CBC_decrypt(key, iv, ciphertext)
        plaintext <-گ PKCS7_unpad(decrypted, block_size=16)
        // Validates padding format - fails if padding is invalid
    END IF

    // Step 5: Handle errors
    IF decryption_failed THEN
        RETURN error("Decryption failed - wrong password or corrupted data")
    END IF

    RETURN utf8_decode(plaintext)
END FUNCTION
```

The security properties of this design are worth noting. Because each encryption uses a fresh random salt, the same password produces different derived keys each time, preventing precomputation attacks. Because each encryption uses a fresh random nonce, the same plaintext encrypted with the same key produces different ciphertext, preventing pattern analysis. The AEAD modes (AES-256-GCM and ChaCha20-Poly1305) provide both confidentiality and integrity - any modification to the ciphertext, IV, or salt is detected during decryption.

### 5.5.3 Password Generation Algorithm

The password generator uses the Web Crypto API's `crypto.getRandomValues()` to produce cryptographically secure random passwords. This ensures uniform distribution across the character pool, making every character equally likely and eliminating the biases present in `Math.random()`. The algorithm is implemented in the TypeScript `PasswordGenerator.tsx` page component.

**Algorithm 5.3: Generate Secure Password**

```
FUNCTION generate_password(length, use_uppercase, use_lowercase, use_numbers, use_symbols, exclude_confusing):
    // Step 1: Define character sets
    UPPERCASE <-گ "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    LOWERCASE <-گ "abcdefghijklmnopqrstuvwxyz"
    NUMBERS <-گ "0123456789"
    SYMBOLS <-گ "!@#$%^&*()_+~`|}{[]:;?><,./-="
    CONFUSING <-گ regex pattern /[ilLI|`oO01]/g

    // Step 2: Build character pool from selected types
    charset <-گ ""
    IF use_uppercase THEN charset <-گ charset + UPPERCASE
    IF use_lowercase THEN charset <-گ charset + LOWERCASE
    IF use_numbers THEN charset <-گ charset + NUMBERS
    IF use_symbols THEN charset <-گ charset + SYMBOLS

    // Step 3: Optionally remove confusing characters
    IF exclude_confusing THEN
        charset <-گ remove_characters_matching(charset, CONFUSING)
    END IF

    // Step 4: Generate password using cryptographic RNG
    password <-گ ""
    random_values <-گ crypto_get_random_values(Uint32Array of size length)
    FOR i FROM 0 TO length - 1 DO
        index <-گ random_values[i] MODULO length_of(charset)
        password <-گ password + charset[index]
    END FOR

    RETURN password
END FUNCTION
```

The algorithm uses a `Uint32Array` of the requested password length, fills it with cryptographically random 32-bit integers, and maps each integer to a character in the pool using modular arithmetic. The entropy of the resulting password is `length أ- logâ‚‚(pool_size)` bits. For example, a 16-character password using all four character types (pool size 94) has approximately 104.7 bits of entropy.

### 5.5.4 Password Strength Analysis Algorithm

The password strength analyser evaluates an existing password by calculating its entropy, estimating the time required to crack it through brute force, identifying common weaknesses, and providing actionable improvement suggestions. It is implemented in the TypeScript `PasswordChecker.tsx` page component.

**Algorithm 5.4: Analyse Password Strength**

```
FUNCTION analyse_password_strength(password):
    // Step 1: Detect character classes present
    has_uppercase <-گ contains_match(password, /[A-Z]/)
    has_lowercase <-گ contains_match(password, /[a-z]/)
    has_numbers <-گ contains_match(password, /[0-9]/)
    has_special <-گ contains_match(password, /[^A-Za-z0-9]/)

    // Step 2: Calculate pool size based on character variety
    pool_size <-گ 0
    IF has_uppercase THEN pool_size <-گ pool_size + 26
    IF has_lowercase THEN pool_size <-گ pool_size + 26
    IF has_numbers THEN pool_size <-گ pool_size + 10
    IF has_special THEN pool_size <-گ pool_size + 33

    // Step 3: Calculate entropy
    IF pool_size > 0 THEN
        entropy <-گ password.length أ- log_base_2(pool_size)
    ELSE
        entropy <-گ 0
    END IF

    // Step 4: Estimate time to crack (brute force at 10 billion guesses/second)
    guesses_per_second <-گ 10,000,000,000  // Modern GPU cluster
    total_combinations <-گ 2 ^ entropy
    seconds_to_crack <-گ total_combinations / guesses_per_second
    time_description <-گ human_readable_time(seconds_to_crack)
    // Examples: "Instantly", "3 hours", "2 years", "Centuries"

    // Step 5: Compute strength score (0-8 scale)
    score <-گ 0
    IF password.length â‰¥ 8 THEN score <-گ score + 1
    IF password.length â‰¥ 12 THEN score <-گ score + 1
    IF password.length â‰¥ 16 THEN score <-گ score + 1
    IF password.length â‰¥ 24 THEN score <-گ score + 1
    IF has_uppercase THEN score <-گ score + 1
    IF has_lowercase THEN score <-گ score + 1
    IF has_numbers THEN score <-گ score + 1
    IF has_special THEN score <-گ score + 1

    // Step 6: Determine strength label and colour
    IF score â‰¤ 1 THEN label <-گ "Too Weak", colour <-گ red
    ELSE IF score â‰¤ 2 THEN label <-گ "Weak", colour <-گ orange
    ELSE IF score â‰¤ 3 THEN label <-گ "Fair", colour <-گ yellow
    ELSE IF score â‰¤ 5 THEN label <-گ "Strong", colour <-گ green
    ELSE IF score â‰¤ 6 THEN label <-گ "Very Strong", colour <-گ emerald
    ELSE label <-گ "Super Strong", colour <-گ cyan

    // Step 7: Generate improvement suggestions
    suggestions <-گ []
    IF password.length < 12 THEN
        suggestions.append("Use at least 12 characters for better security")
    END IF
    IF NOT has_uppercase THEN suggestions.append("Add uppercase letters")
    IF NOT has_lowercase THEN suggestions.append("Add lowercase letters")
    IF NOT has_numbers THEN suggestions.append("Add numbers")
    IF NOT has_special THEN suggestions.append("Add special characters (!@#$...)")

    RETURN { entropy, score, label, colour, time_description, suggestions,
             pool_size, has_uppercase, has_lowercase, has_numbers, has_special }
END FUNCTION
```

The entropy-based approach provides an objective measure of password strength that accounts for both length and character variety. The brute-force time estimation uses a conservative assumption of 10 billion guesses per second, which reflects the capability of modern GPU-accelerated cracking tools. This gives students a tangible understanding of why a 6-character password (entropy â‰ˆ 38 bits) can be cracked "Instantly" while a 16-character password with all character types (entropy â‰ˆ 105 bits) would take "Centuries."

### 5.5.5 URL Scanning with VirusTotal Polling Algorithm

VirusTotal does not return scan results instantly. Instead, it accepts the URL for analysis and returns an analysis ID. The client must then poll for completion. We implemented this polling mechanism in the Rust `virustotal.rs` module, with a 4-second polling interval and a maximum of 30 attempts (approximately 2 minutes total timeout).

**Algorithm 5.5: Scan URL with VirusTotal Polling**

```
FUNCTION scan_url(target_url):
    // Step 1: Submit URL to VirusTotal for analysis
    client <-گ create_http_client(timeout = 120 seconds)
    encoded_body <-گ url_encode("url=" + target_url)

    response <-گ client.POST(
        url: "https://www.virustotal.com/api/v3/urls",
        headers: {
            "x-apikey": VIRUSTOTAL_API_KEY,
            "content-type": "application/x-www-form-urlencoded"
        },
        body: encoded_body
    )

    IF response.status â‰  200 THEN
        RETURN error("API error: " + response.status)
    END IF

    // Step 2: Extract analysis ID from response
    json <-گ parse_json(response.body)
    analysis_id <-گ json.data.id

    // Step 3: Poll for analysis completion
    attempts <-گ 0
    max_attempts <-گ 30

    WHILE attempts < max_attempts DO
        sleep(4 seconds)
        attempts <-گ attempts + 1

        poll_response <-گ client.GET(
            url: "https://www.virustotal.com/api/v3/analyses/" + analysis_id,
            headers: { "x-apikey": VIRUSTOTAL_API_KEY }
        )

        IF poll_response.status â‰  200 THEN
            CONTINUE  // Retry on transient network errors
        END IF

        poll_json <-گ parse_json(poll_response.body)
        status <-گ poll_json.data.attributes.status

        IF status = "completed" THEN
            // Step 4: Parse and structure the results
            stats <-گ poll_json.data.attributes.stats
            // stats contains: malicious, suspicious, harmless, undetected counts

            detections <-گ []
            FOR EACH (engine_name, engine_result) IN poll_json.data.attributes.results DO
                IF engine_result.category â‰  "undetected" THEN
                    detections.append({
                        engine: engine_name,
                        result: engine_result.result,
                        category: engine_result.category
                    })
                END IF
            END FOR

            scan_result <-گ {
                target: target_url,
                status: determine_overall_status(stats.malicious, stats.suspicious),
                reputation: poll_json.data.attributes.reputation,
                detections: detections,
                stats: stats
            }
            RETURN scan_result
        END IF
    END WHILE

    RETURN error("Scan timeout. VirusTotal did not complete the analysis in time.")
END FUNCTION

FUNCTION determine_overall_status(malicious_count, suspicious_count):
    IF malicious_count > 0 THEN RETURN "malicious"
    IF suspicious_count > 0 THEN RETURN "suspicious"
    RETURN "clean"
END FUNCTION
```

The 4-second polling interval was chosen based on VirusTotal's recommendation to avoid aggressive polling, and in practice most scans complete within 3-4 polls (12-16 seconds). The API key is stored exclusively in the Rust backend binary and is never exposed to the frontend JavaScript context.

### 5.5.6 File Scanning with Hash-First Check Algorithm

File scanning extends the URL scanning approach with an optimisation: before uploading the file, we compute its SHA-256 hash locally and check if VirusTotal already has results for that hash. If a cached report exists, we skip the upload entirely, saving bandwidth and time. This is implemented in the Rust `virustotal.rs` module.

**Algorithm 5.6: Scan File with Hash-First Check**

```
FUNCTION scan_file(file_path):
    // Step 1: Compute local SHA-256 hash of the file
    hasher <-گ create_sha256_hasher()
    file <-گ open_file(file_path)
    file_size <-گ 0

    buffer <-گ allocate_buffer(8192)  // 8 KB chunks
    WHILE (bytes_read <-گ file.read(buffer)) > 0 DO
        hasher.update(buffer[0..bytes_read])
        file_size <-گ file_size + bytes_read
    END WHILE
    file_hash <-گ hasher.finalise_as_hex_string()
    file.close()

    // Step 2: Check if hash already exists in VirusTotal's database
    client <-گ create_http_client(timeout = 120 seconds)
    hash_response <-گ client.GET(
        url: "https://www.virustotal.com/api/v3/files/" + file_hash,
        headers: { "x-apikey": VIRUSTOTAL_API_KEY }
    )

    IF hash_response.status = 200 THEN
        // Cached result found - return existing report immediately
        cached_report <-گ parse_file_report(hash_response.body)
        RETURN format_scan_result(cached_report)
    END IF

    // Step 3: File not in database - upload for analysis
    IF file_size > 32,000,000 THEN  // > 32 MB
        // Request special upload URL for large files
        upload_url_response <-گ client.GET(
            url: "https://www.virustotal.com/api/v3/files/upload_url",
            headers: { "x-apikey": VIRUSTOTAL_API_KEY }
        )
        upload_url <-گ parse_json(upload_url_response.body).data
    ELSE
        upload_url <-گ "https://www.virustotal.com/api/v3/files"
    END IF

    // Step 4: Upload file via multipart form data
    upload_response <-گ client.POST_multipart(
        url: upload_url,
        headers: { "x-apikey": VIRUSTOTAL_API_KEY },
        file: file_path,
        file_name: extract_filename(file_path)
    )

    IF upload_response.status â‰  200 THEN
        RETURN error("Upload failed: " + upload_response.status)
    END IF

    // Step 5: Extract analysis ID and poll for completion
    upload_json <-گ parse_json(upload_response.body)
    analysis_id <-گ upload_json.data.id

    // Poll using same loop as Algorithm 5.5
    scan_result <-گ poll_for_analysis(analysis_id, client)
    RETURN scan_result
END FUNCTION
```

The hash-first approach provides a significant performance benefit for commonly scanned files. In testing, cached file scans completed in approximately 1.2 seconds compared to 22.3 seconds for new file uploads. The SHA-256 hash is computed using streaming 8 KB reads to avoid loading the entire file into memory, which is important for large files.

### 5.5.7 Image EXIF Metadata Scanning Algorithm

The image privacy scanner reads EXIF metadata embedded in JPEG and PNG images and presents it to the user in a structured format. This helps students understand that photos they share online may contain hidden information such as GPS coordinates, camera details, and timestamps. The algorithm is implemented in the Rust `image_privacy.rs` module.

**Algorithm 5.7: Scan Image EXIF Metadata**

```
FUNCTION scan_image_metadata(file_path):
    results <-گ { basic_info: {}, camera_info: {}, gps_info: {}, exif_info: {} }

    // Step 1: Read filesystem metadata
    file_metadata <-گ read_file_metadata(file_path)
    results.basic_info.file_name <-گ file_metadata.file_name
    results.basic_info.file_size <-گ file_metadata.size_bytes
    results.basic_info.file_size_formatted <-گ format_bytes(file_metadata.size_bytes)
    results.basic_info.modified_date <-گ format_timestamp(file_metadata.modified)

    // Step 2: Decode image to extract dimensions and colour info
    image <-گ decode_image(file_path)  // Using the `image` crate
    results.basic_info.dimensions <-گ image.width + " أ- " + image.height
    results.basic_info.color_type <-گ image.color_type  // e.g., "RGB", "RGBA", "Grayscale"
    results.basic_info.bit_depth <-گ image.bit_depth

    // Step 3: Read EXIF data from file bytes
    file_bytes <-گ read_file_bytes(file_path)
    exif_reader <-گ create_exif_reader()
    exif_data <-گ exif_reader.read_from_container(file_bytes)

    IF exif_data IS NOT NULL THEN
        // Step 4: Extract camera information
        FOR EACH field IN exif_data.fields DO
            IF field.tag = "Make" THEN
                results.camera_info.make <-گ field.value
            ELSE IF field.tag = "Model" THEN
                results.camera_info.model <-گ field.value
            ELSE IF field.tag = "Software" THEN
                results.camera_info.software <-گ field.value
            ELSE IF field.tag = "DateTime" THEN
                results.camera_info.date_time <-گ field.value
            END IF
        END FOR

        // Step 5: Extract GPS coordinates and convert to decimal
        gps_latitude <-گ get_exif_field(exif_data, "GPSLatitude")
        gps_latitude_ref <-گ get_exif_field(exif_data, "GPSLatitudeRef")
        gps_longitude <-گ get_exif_field(exif_data, "GPSLongitude")
        gps_longitude_ref <-گ get_exif_field(exif_data, "GPSLongitudeRef")

        IF gps_latitude IS NOT NULL AND gps_longitude IS NOT NULL THEN
            // Convert DMS (degrees, minutes, seconds) to decimal
            lat_decimal <-گ convert_dms_to_decimal(gps_latitude)
            IF gps_latitude_ref = "S" THEN lat_decimal <-گ -lat_decimal

            lon_decimal <-گ convert_dms_to_decimal(gps_longitude)
            IF gps_longitude_ref = "W" THEN lon_decimal <-گ -lon_decimal

            results.gps_info.latitude <-گ lat_decimal
            results.gps_info.longitude <-گ lon_decimal
            results.gps_info.maps_url <-گ "https://www.google.com/maps?q="
                                        + lat_decimal + "," + lon_decimal
        END IF

        // Step 6: Extract camera settings
        results.exif_info.aperture <-گ get_exif_field(exif_data, "FNumber")
        results.exif_info.iso <-گ get_exif_field(exif_data, "ISOSpeedRatings")
        results.exif_info.focal_length <-گ get_exif_field(exif_data, "FocalLength")
        results.exif_info.exposure_time <-گ get_exif_field(exif_data, "ExposureTime")
    END IF

    RETURN results
END FUNCTION

FUNCTION convert_dms_to_decimal(dms_array):
    // dms_array contains [degrees, minutes, seconds] as rational numbers
    degrees <-گ dms_array[0].to_float()
    minutes <-گ dms_array[1].to_float()
    seconds <-گ dms_array[2].to_float()
    RETURN degrees + (minutes / 60) + (seconds / 3600)
END FUNCTION
```

The algorithm converts GPS coordinates from the EXIF DMS (degrees, minutes, seconds) format to decimal degrees and generates a clickable Google Maps URL. This makes the privacy implications tangible - when a student sees their photo's exact location plotted on a map, the importance of metadata stripping becomes immediately clear.

**Algorithm 5.8: Strip Image EXIF Metadata**

```
FUNCTION strip_image_metadata(input_path, output_path):
    // Step 1: Read original file bytes
    file_bytes <-گ read_file_bytes(input_path)

    // Step 2: Detect image format and strip EXIF accordingly
    IF file_extension(input_path) = ".jpg" OR file_extension(input_path) = ".jpeg" THEN
        jpeg <-گ Jpeg::from_bytes(file_bytes)  // Using img_parts crate
        jpeg.exif_data <-گ NULL                  // Remove all EXIF segments
        clean_bytes <-گ jpeg.encode()
    ELSE IF file_extension(input_path) = ".png" THEN
        png <-گ Png::from_bytes(file_bytes)     // Using img_parts crate
        png.exif_data <-گ NULL                   // Remove all EXIF chunks
        clean_bytes <-گ png.encode()
    ELSE
        RETURN error("Unsupported image format. Use JPEG or PNG.")
    END IF

    // Step 3: Write clean image to output path
    write_file_bytes(output_path, clean_bytes)

    RETURN { success: true, output_path: output_path }
END FUNCTION
```

The stripping algorithm uses the `img_parts` crate to parse the image at the binary level, remove the EXIF segments (APP1 marker in JPEG, or eXIf chunk in PNG), and re-encode the image. The pixel data is preserved exactly - only the metadata is removed. This is safer than re-encoding the image, which could introduce quality loss.

### 5.5.8 AI Chatbot with Streaming Response Algorithm

The AI chatbot uses a streaming architecture to deliver responses in real time, character by character, rather than making the user wait for the full response to be generated. This is implemented across three layers: the TypeScript frontend sends the request via Tauri IPC, the Rust `ai_agent.rs` module manages the streaming connection to OpenRouter, and responses flow back through a Tauri `Channel<String>` to the frontend for progressive rendering. The chatbot is restricted to cybersecurity and AI topics only through a system prompt.

**Algorithm 5.9: AI Chat with Streaming Response**

```
FUNCTION chat_with_ai(user_message, conversation_history, stream_channel):
    // Step 1: Prepend cybersecurity-only system prompt
    system_prompt <-گ "You are CHEA, a cybersecurity education assistant for " +
                     "students aged 9-15. Answer only cybersecurity and AI " +
                     "related questions. Use simple, student-friendly language. " +
                     "If the question is off-topic, politely redirect to " +
                     "cybersecurity topics."

    messages <-گ [{ role: "system", content: system_prompt }]

    // Step 2: Append conversation history for context continuity
    FOR EACH msg IN conversation_history DO
        messages.append({ role: msg.role, content: msg.content })
    END FOR

    // Step 3: Append the current user message
    messages.append({ role: "user", content: user_message })

    // Step 4: Build OpenRouter API request
    request_body <-گ {
        model: "x-ai/grok-4-fast",
        messages: messages,
        stream: true  // Enable Server-Sent Events streaming
    }

    // Step 5: Send streaming POST request to OpenRouter
    client <-گ create_http_client(timeout = 120 seconds)
    response <-گ client.POST_streaming(
        url: "https://openrouter.ai/api/v1/chat/completions",
        headers: {
            "Authorization": "Bearer " + OPENROUTER_API_KEY,
            "Content-Type": "application/json"
        },
        body: serialise_to_json(request_body)
    )

    IF response.status â‰  200 THEN
        stream_channel.send({ type: "error", message: "AI service unavailable" })
        RETURN
    END IF

    // Step 6: Read Server-Sent Events (SSE) stream line by line
    full_response <-گ ""
    FOR EACH line IN response.stream DO
        IF line.starts_with("data: ") THEN
            data <-گ line.substring(6)  // Strip "data: " prefix

            IF data = "[DONE]" THEN
                // Step 7: Stream complete - send end signal
                stream_channel.send({ type: "done", content: full_response })
                BREAK
            END IF

            json <-گ parse_json(data)
            content_chunk <-گ json.choices[0].delta.content

            IF content_chunk IS NOT NULL THEN
                full_response <-گ full_response + content_chunk

                // Step 8: Forward chunk to frontend immediately
                stream_channel.send({ type: "chunk", content: content_chunk })
            END IF
        END IF
    END FOR

    // Step 9: Persist the complete response to Firestore
    save_message_to_session(user_id, session_id, "user", user_message)
    save_message_to_session(user_id, session_id, "assistant", full_response)
END FUNCTION
```

The streaming architecture provides two key benefits. First, the user sees the response building in real time, which reduces perceived latency - the first token typically appears within 2 seconds, even though the full response may take 8-10 seconds to complete. Second, the system can handle very long responses (e.g., detailed explanations of encryption algorithms) without blocking the UI, since each chunk is rendered independently as it arrives.

The system prompt restriction is a critical safety feature for the target age group. By instructing the model to only answer cybersecurity and AI-related questions and to redirect off-topic queries, we ensure that the chatbot remains focused on its educational purpose. The conversation history is included in each request so the model can maintain context across multi-turn conversations - for example, a student can ask "Can you explain that again more simply?" and the AI understands what "that" refers to.

The OpenRouter API key is loaded from environment variables via the `dotenvy` crate in the Rust backend and is never exposed to the frontend JavaScript context, consistent with the security requirement NFR-01.

### 5.5.9 XP Calculation and Level Progression Algorithm

The gamification system calculates XP awards for each activity type and manages level progression through a 10-tier threshold table. The XP thresholds increase exponentially to ensure early levels feel rewarding while higher levels require sustained engagement. This design is informed by gamification research (Pramod, 2025; Khairallah and Abu-Naseer, 2024) showing that visible early progression improves motivation and long-term retention.

**Table 5.2: Activity XP Rewards**

| Activity Type | XP Award | Daily Task Mapping |
|---------------|----------|--------------------|
| `scan_link` | 10 | scan (target: 1) |
| `scan_file` | 15 | scan (target: 1) |
| `scan_image` | 10 | scan (target: 1) |
| `generate_password` | 5 | generate_password (target: 1) |
| `check_password` | 3 | check_password (target: 1) |
| `generate_encryption` | 5 | use_encryption (target: 1) |
| `create_credential` | 20 | create_credential (target: 1) |
| `chat_ai` | 5 | - (no daily task) |
| `quiz_round` | 15 | play_quiz (target: 1) |
| `phishing_round` | 15 | spot_phish (target: 1) |

**Algorithm 5.10: Calculate Phishing Dojo XP**

The Phishing Dojo and Quiz Arena use a bonus-based XP calculation that rewards accuracy, consistency, and perfection.

```
FUNCTION calculate_phishing_xp(correct_calls, max_streak, total_emails):
    // Base XP: 3 points per correct identification
    base_xp <-گ correct_calls أ- 3

    // Streak bonus: 1 point per consecutive correct beyond the first
    IF max_streak > 1 THEN
        streak_bonus <-گ (max_streak - 1) أ- 1
    ELSE
        streak_bonus <-گ 0
    END IF

    // Completion bonus: reward for high performance
    IF correct_calls = total_emails THEN
        completion_bonus <-گ 10  // Perfect score
    ELSE IF correct_calls â‰¥ 3 THEN
        completion_bonus <-گ 5   // Good performance (60%+ correct)
    ELSE
        completion_bonus <-گ 0
    END IF

    total_xp <-گ base_xp + streak_bonus + completion_bonus
    RETURN { base_xp, streak_bonus, completion_bonus, total_xp }
END FUNCTION
```

The same formula applies to Quiz Arena XP. The streak bonus incentivises consistent correct answers rather than lucky guesses, while the completion bonus rewards perfect or near-perfect rounds.

**Algorithm 5.11: Level Progression**

```
// Level threshold table (10 tiers with exponentially increasing XP requirements)
LEVEL_THRESHOLDS <-گ [
    { level: 1,  xp: 0,    title: "Novice" },
    { level: 2,  xp: 100,  title: "Apprentice" },
    { level: 3,  xp: 300,  title: "Guardian" },
    { level: 4,  xp: 600,  title: "Defender" },
    { level: 5,  xp: 1000, title: "Sentinel" },
    { level: 6,  xp: 1500, title: "Champion" },
    { level: 7,  xp: 2200, title: "Hero" },
    { level: 8,  xp: 3000, title: "Legend" },
    { level: 9,  xp: 4000, title: "Mythic" },
    { level: 10, xp: 5500, title: "Omniscient" }
]

FUNCTION get_level_info(total_xp):
    // Find the highest threshold that the user's XP meets or exceeds
    current_level <-گ LEVEL_THRESHOLDS[0]
    next_level <-گ LEVEL_THRESHOLDS[1]

    FOR i FROM LENGTH(LEVEL_THRESHOLDS) - 1 DOWNTO 0 DO
        IF total_xp â‰¥ LEVEL_THRESHOLDS[i].xp THEN
            current_level <-گ LEVEL_THRESHOLDS[i]
            IF i + 1 < LENGTH(LEVEL_THRESHOLDS) THEN
                next_level <-گ LEVEL_THRESHOLDS[i + 1]
            ELSE
                next_level <-گ LEVEL_THRESHOLDS[i]  // Already at max level
            END IF
            BREAK
        END IF
    END FOR

    xp_in_level <-گ total_xp - current_level.xp
    xp_needed <-گ next_level.xp - current_level.xp
    progress_percentage <-گ (xp_in_level / xp_needed) أ- 100

    RETURN {
        level: current_level.level,
        title: current_level.title,
        current_xp: total_xp,
        xp_for_next_level: next_level.xp,
        xp_in_level: xp_in_level,
        xp_needed: xp_needed,
        progress: progress_percentage
    }
END FUNCTION
```

**Algorithm 5.12: Award XP and Update Streak**

```
FUNCTION add_xp(user_id, points):
    // Step 1: Fetch current progress from Firestore
    progress <-گ fetch_user_progress(user_id)
    today <-گ current_date_as_iso_string()       // e.g., "2025-04-23"
    yesterday <-گ previous_day_as_iso_string()    // e.g., "2025-04-22"

    // Step 2: Calculate new XP and level
    new_xp <-گ progress.xp + points
    level_info <-گ get_level_info(new_xp)

    // Step 3: Update streak counter
    IF progress.last_active_date = today THEN
        // Already active today - streak unchanged
        new_streak <-گ progress.streak_days
    ELSE IF progress.last_active_date = yesterday THEN
        // First activity today and was active yesterday - streak continues
        new_streak <-گ progress.streak_days + 1
    ELSE
        // Gap of more than one day - streak resets to 1
        new_streak <-گ 1
    END IF

    // Step 4: Build updated progress document
    updated_progress <-گ {
        xp: new_xp,
        level: level_info.level,
        totalScore: progress.totalScore + points,
        streakDays: new_streak,
        lastActiveDate: today
    }

    // Step 5: Persist to Firestore
    save_user_progress(user_id, updated_progress)
    RETURN updated_progress
END FUNCTION
```

The streak mechanism is a key engagement driver. It tracks consecutive calendar days of activity by comparing `lastActiveDate` with today's and yesterday's dates. If a day is missed, the streak resets to 1. This encourages students to open the application daily, reinforcing the habit-forming objective central to the project's "Cyber Hygiene" mission. The level thresholds are designed so that the first few levels are achievable within a single session (e.g., Level 2 at 100 XP can be reached by scanning a few links and generating a password), providing immediate positive reinforcement.

---

## 5.6 Summary

This chapter presented the complete system design of CHEA across five dimensions. The database schema (Section 5.2) defines a Firestore-based NoSQL structure with eight collections and subcollections, all scoped under individual user paths for data isolation, with client-side encryption ensuring that no sensitive data is stored in plaintext, and a custom REST API workaround for Tauri's WebView2 environment. The user interface design (Section 5.3) describes nineteen interfaces covering the full user journey from authentication flows (Login, Registration, Forgot Password), through the central Dashboard, to security tools (Password Generator, Password Checker, Link Scanner, File Scanner, Encryption Lab, Credential Vault, Image Privacy), educational games (Phishing Dojo, Quiz Arena), the AI Agent chatbot with streaming responses, Settings with avatar selection and vault configuration, supplementary utilities (Calculator, Terminal), and the navigation layout with floating widgets (NovaChat, MusicPlayer), all following a cyberpunk aesthetic designed for the 9-15 age group with full bilingual support (English and Arabic with RTL layout). The application architecture (Section 5.4) documents the routing system with authentication guards, the Zustand state management layer, and the reusable UI component library. The algorithm designs (Section 5.5) provide pseudocode for twelve core algorithms spanning encryption and decryption, password generation and strength analysis, URL and file scanning via VirusTotal with polling, image EXIF metadata scanning and stripping, AI-powered cybersecurity chat with Server-Sent Events streaming, and the gamification engine with XP calculation and level progression.

These design specifications directly address the functional requirements defined in Chapter 4 and the research gaps identified in Chapter 2. The following chapter describes the implementation of these designs and presents the testing results.
