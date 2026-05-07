# Senior Project Examination Questions & Answers - CHEA

## Cyber Hygiene Educator & Assistant (CHEA)

---

### 1. Project Overview & Motivation

**Q1: What is CHEA and what problem does it solve?**

A: CHEA (Cyber Hygiene Educator & Assistant) is a Windows desktop application designed to teach cybersecurity awareness to students aged 9-15. It solves the problem that existing security tools are either too complex for children or focus only on education without practical protection. CHEA combines five security tools (Password Vault, Malware Scanner, Encryption Tools) with gamified education and AI-powered features to create a unified platform that protects while it educates.

**Q2: Why did you target students aged 9-15 specifically?**

A: This age group is highly vulnerable because they lack the security instincts that adults develop through years of digital engagement. Research shows a 300% increase in cyberattacks targeting educational institutions since 2020, with students as primary victims. Children aged 9-15 are also at an age where they begin using social media, school portals, and sharing information online, but they lack the knowledge to protect themselves from threats like phishing, weak passwords, and malware.

**Q3: What was the motivation behind creating this application?**

A: The motivation came from three key findings: (1) 81% of data breaches stem from weak credentials (Verizon DBIR 2021), (2) existing security tools are designed for adults and are too complex for children, and (3) there is a disconnect between what threatens students (passwords, phishing) and what educational tools teach. We wanted to create a solution that is both educational AND protective, not just one or the other.

---

### 2. Problem Statement & Objectives

**Q4: What are the three sub-problems you identified?**

A: The three sub-problems are:
1. **Increase in Targeted Attacks**: Educational institutions saw a 300% increase in cyberattacks since 2020, with students as primary targets.
2. **The Cyber Hygiene Gap**: Many students lack fundamental skills like strong password management and phishing detection - 81% of breaches are due to weak credentials.
3. **Fragmented and Complex Tools**: Existing security solutions are designed for adult professionals, making them too technical or fragmented for younger users.

**Q5: What are the six main objectives of CHEA?**

A: The six objectives are:
1. **Educational Platform Development**: Teaching concepts like strong passwords, phishing awareness, URL safety
2. **AI-Based Assistant Integration**: Implementing chatbot, Security Buddy, Scenario Simulator
3. **Gamification Implementation**: XP system, levels, achievements, quizzes
4. **User-Friendly Interface Design**: Age-appropriate, cyberpunk aesthetic, bilingual support
5. **Behavioral Change Promotion**: Daily challenges, streaks, security posture assessment
6. **System Evaluation**: Testing with target demographic, surveys, analysis

**Q6: How does CHEA address the identified research gaps?**

A: CHEA addresses each gap:
- **Tool Integration Gap**: Consolidates password management, URL scanning, encryption into one interface
- **Age-Appropriateness Gap**: Designed specifically for ages 9-15 with visual feedback and non-technical language
- **Education-Protection Gap**: Each tool serves dual purposes - teaches while protecting
- **Engagement Gap**: Gamification (XP, levels, streaks, quizzes) based on research by Pramod (2025)
- **Accessibility Gap**: Completely free with no subscription tiers

---

### 3. Literature Review

**Q7: What existing tools did you analyze and why did they fail for your target audience?**

A: We analyzed:
- **Bitwarden**: Too complex for children, functions as utility without education
- **VirusTotal**: Friction-heavy, technical results without explanations
- **KnowBe4**: Targets ages 16+, no practical protection tools
- **Hack The Box**: For professionals, requires technical knowledge
- **Google Interland**: Right age group but no practical security tools

These fail because they either focus on education OR protection, not both, and they assume adult cognitive processing.

**Q8: What are the five research gaps you identified?**

A: The five gaps are:
1. **Tool Integration Gap**: Students face fragmented ecosystem causing "security fatigue"
2. **Age-Appropriateness Gap**: Existing tools assume adult cognitive processing
3. **Education-Protection Gap**: Tools either teach concepts or protect, rarely both
4. **Engagement Gap**: Traditional training fails to retain attention
5. **Accessibility Gap**: Subscription costs make security a privilege

**Q9: What academic sources informed your design decisions?**

A: Key sources include:
- Zhang-Kennedy & Chiasson (2021): Interactive multimedia learning
- Pramod (2025): Gamification improves engagement
- Khairallah & Abu-Naseer (2024): Gamified methods outperform traditional training
- Almomani et al. (2021): K-12 cybersecurity maturity gaps
- Sağlam & Miller (2023): Age-appropriate interface design
- Verizon DBIR (2021): 81% breaches from weak passwords

---

### 4. System Architecture

**Q10: Why did you choose a layered architecture?**

A: A layered architecture keeps concerns separated: the UI doesn't need to know about crypto, the crypto code doesn't need to know about databases, etc. This makes the code more maintainable, testable, and allows different teams to work on different layers independently.

**Q11: Explain the five layers of your architecture.**

A:
1. **Presentation Layer**: React 18 + TypeScript frontend in Tauri WebView2, includes all UI components, Tailwind CSS styling, i18next for bilingual support
2. **Business Logic Layer**: Zustand stores for state management (auth, activities, progress, daily tasks), Firebase services, and the useTrackActivity hook
3. **Backend Processing Layer**: Rust Tauri commands for crypto, VirusTotal, AI agent, image privacy, and terminal modules
4. **Data Layer**: Firebase Firestore with custom REST API workaround for WebView2 compatibility
5. **External Services Layer**: VirusTotal API, OpenRouter AI API, Firebase Auth

**Q12: How do frontend and backend communicate?**

A: Through Tauri IPC (Inter-Process Communication). The frontend calls `invoke('command_name', { parameters })` which serializes arguments as JSON, sends them to the Rust process via platform-specific IPC, executes the command, and returns the result. For streaming AI responses, we use Tauri's Channel mechanism.

**Q13: Why Tauri over Electron?**

A: Tauri uses a lightweight Rust backend instead of bundling a full Chromium instance, resulting in smaller app size (under 10MB), faster startup, and better memory usage. Tauri v2's invoke IPC system, channel-based streaming, and plugin architecture were essential for our implementation.

---

### 5. Database Design

**Q14: Why did you choose Firebase Firestore (NoSQL) over SQL?**

A: We chose Firestore for:
1. **Real-time Synchronization**: Automatic updates keep user data synchronized
2. **Native Firebase Auth Integration**: Seamless authentication
3. **Document-Oriented Model**: Perfect for hierarchical data (users → vault, activities, chat sessions, gamification)
4. **Security Rules**: Fine-grained access control ensuring users only access their own data
5. **Cost-effective**: Free tier suitable for academic projects
6. **Offline Support**: Functions with intermittent connectivity

**Q15: Explain your Firestore schema and collection hierarchy.**

A: All data lives under `users/{userId}/`:
- `vault/`: Credential entries (name, username, domain, encryptedData, type)
- `progress/data`: XP, level, streakDays, lastActiveDate
- `dailyTasks/{date}`: Daily task progress
- `activities/`: Activity log with type, description, points
- `chatSessions/{sessionId}/messages/`: Chat history
- `vaultConfig/main`: Encrypted verification hash

**Q16: What is the Firestore REST API workaround and why was it needed?**

A: Tauri's WebView2 (Microsoft Edge) doesn't support Firestore's gRPC-web transport. We implemented a custom REST API helper (`firestore-rest.ts`) that uses standard fetch() calls to Firestore's REST endpoint. We also used `experimentalForceLongPolling: true` with the SDK as a partial workaround.

---

### 6. Tools & Technologies

**Q17: Why did you choose these development tools?**

A:
- **Visual Studio Code**: Solid extension support for TypeScript, Rust, and Tauri
- **React 18 + TypeScript**: Functional components with hooks, strict type-checking catches bugs at compile time
- **Vite**: Sub-second hot module replacement, production builds with tree-shaking
- **Tauri v2**: Lightweight, secure, native IPC
- **Rust**: Memory safety without garbage collection, performance comparable to C/C++
- **Zustand**: Simple state management for global state
- **Tailwind CSS + Framer Motion**: Styling and animations
- **i18next**: Internationalization for English/Arabic
- **Bun**: Faster dependency resolution than npm

**Q18: What AI tools did you use and why?**

A:
- **OpenCode & KiloCode**: AI coding assistants for code generation, debugging, and development guidance
- **OpenRouter API**: Centralized AI gateway providing access to multiple models
  - **x-ai/grok-4-fast**: Primary model for all AI features - chosen for strong reasoning, streaming support, multilingual performance
  - **MiniMax, GLM, ZAI, Kimi2**: Additional models available for redundancy

OpenRouter was chosen for: free tier, model diversity, streaming support, and multilingual capability (essential for bilingual app).

**Q19: Why Firebase for database and authentication?**

A: Firebase provides a complete solution: Authentication for user management and Firestore for data storage, both with generous free tiers. Native integration between the two simplifies development. Security rules provide data isolation, and offline persistence supports intermittent connectivity.

---

### 7. Security Features

**Q20: How does the credential vault work?**

A: Users set a master password at first use. When saving credentials, the password/card details are encrypted client-side using AES-256-GCM with Argon2id key derivation before being stored in Firestore. The master password never leaves the user's device. To verify the password without storing it, we store an encrypted verification hash that can only be decrypted with the correct password.

**Q21: What encryption algorithms do you use and why?**

A: Three algorithms supported:
1. **AES-256-GCM**: Primary for vault encryption - AEAD (Authenticated Encryption with Associated Data), 32-byte key, 12-byte nonce
2. **ChaCha20-Poly1305**: Alternative for devices without AES-NI hardware, same security guarantees as AES-256-GCM
3. **AES-128-CBC**: Legacy option for compatibility, uses PKCS#7 padding

All use **Argon2id** for key derivation - the memory-hard variant that prevents rainbow table and precomputation attacks.

**Q22: How is the master password handled?**

A: The master password is used to derive an encryption key using Argon2id with a random salt. The derived key encrypts the data. The password itself never leaves the device and is never transmitted to any server. For password verification, we store an encrypted verification string - if the password is wrong, decryption fails.

**Q23: How does client-side encryption protect user data?**

A: Even if Firestore is compromised, all stored credentials remain encrypted and unusable without the user's master password. Each encryption uses a unique random salt, so the same password produces different keys each time. Each encryption also uses a unique nonce, so the same plaintext produces different ciphertext - preventing pattern analysis.

---

### 8. Scanning Features

**Q24: How does VirusTotal integration work?**

A: For URL scanning: (1) Submit URL to VirusTotal /urls endpoint, (2) Get analysis ID, (3) Poll /analyses/{id} at 4-second intervals until completed, (4) Parse and return results. For file scanning: (1) Compute SHA-256 hash locally, (2) Check if VirusTotal has cached results - if yes, return immediately, (3) If not, upload file and poll for results.

**Q25: Explain the hash-first optimization for file scanning.**

A: We compute the file's SHA-256 hash locally before any upload. We query VirusTotal with just the hash - if a report exists, we get results without uploading the file, saving bandwidth and time. Only unknown files require upload.

**Q26: What is AI Scan Analysis and how does it help students?**

A: After a VirusTotal scan completes, the AI (Grok-4-Fast) generates a student-friendly explanation of the results. It provides: risk assessment, threat breakdown, and actionable safety recommendations - all in the user's language (English or Arabic). This bridges the gap between technical scan results and student understanding.

---

### 9. AI Features

**Q27: Explain the six AI-powered features.**

A:
1. **AI Agent (Chatbot)**: Streaming chat interface for cybersecurity questions, uses system prompt to stay on topic
2. **AI Security Buddy**: Daily personalized cybersecurity challenge, cached in localStorage
3. **AI Scenario Simulator**: 5 rounds of security decision scenarios, AI generates situations and evaluates answers
4. **AI Attack Narrative**: Explains how a hacker could crack the user's password (only password traits, never the password itself)
5. **AI Phishing Email Generator**: Generates realistic phishing emails for Phishing Dojo training at three difficulty levels
6. **AI Security Posture Insights**: Analyzes 15-question questionnaire responses to generate personalized security report card

**Q28: How does the AI chatbot work with streaming responses?**

A: The frontend calls the Rust backend with a Tauri Channel. The Rust module sends a streaming request to OpenRouter with `stream: true`. Each content chunk from the SSE response is immediately sent to the frontend via the Channel, enabling character-by-character rendering.

**Q29: How do you handle AI hallucinations?**

A: We implement: (1) strict system prompts constraining the AI to cybersecurity topics, (2) JSON schema validation for structured responses, (3) fallback content for edge cases, and (4) error handling with user-friendly messages.

**Q30: How does the AI generate content in both English and Arabic?**

A: Each AI prompt includes an instruction specifying the user's active language (English or Arabic). The response is generated in that language and the UI displays it accordingly.

---

### 10. Gamification

**Q31: Explain the XP system and level progression.**

A: Users earn XP through security activities:
- scan_link: 10 XP
- scan_file: 15 XP
- generate_password: 5 XP
- create_credential: 20 XP
- quiz_round: 15 XP
- phishing_round: 15 XP
- ai_phishing_round: 15 XP
- scenario_simulator: 20 XP
- security_posture: 25 XP

Levels: Novice (0) → Cadet (100) → Scout (250) → Shield (500) → Guardian (800) → Cyber Ninja (1200) → Security Ranger (1700) → Knight (2300) → Cyber Legend (3000) → Cyber Master (4000) → Omniscient (5500)

**Q32: How does streak tracking work?**

A: The system stores `lastActiveDate` and `streakDays`. When a user performs an activity, it compares the current date with lastActiveDate. If yesterday, increment streak. If today, no change. If older than yesterday, reset streak to 1.

**Q33: What daily tasks are implemented?**

A: Seven daily tasks with targets and rewards:
- scan (target: 3, points: 15)
- generate_password (target: 2, points: 10)
- check_password (target: 2, points: 10)
- create_credential (target: 1, points: 10)
- use_encryption (target: 1, points: 10)
- play_quiz (target: 1, points: 10)
- spot_phish (target: 1, points: 10)

Maximum daily score: 125 points

**Q34: How does gamification improve engagement?**

A: Research by Pramod (2025) and Khairallah & Abu-Naseer (2024) shows gamification significantly improves engagement and knowledge retention. Our implementation uses XP rewards, visible progression (levels), achievement badges, and daily streaks - all proven engagement mechanisms.

---

### 11. UI/UX Design

**Q35: Why the cyberpunk/neon aesthetic?**

A: We wanted the application to feel more like a game than a traditional security tool, making it appealing to our target audience (ages 9-15). The dark theme uses deep navy backgrounds (#0A1128) with neon crimson (#FF0A54) and violet (#4D00FF) accents. A light theme is also available.

**Q36: How do you support both dark and light themes?**

A: We built a custom ThemeProvider using React Context. It supports three modes: Dark (applies .dark class), Light (applies .light class), and System (follows OS preference). Theme preference is saved in localStorage. All components use `isDark` to conditionally apply Tailwind classes.

**Q37: Explain the bilingual support (English/Arabic with RTL).**

A: Using i18next, all user-facing text is translatable. Switching language triggers: (1) i18n language change, (2) RTL layout adaptation for Arabic, (3) AI-generated content regenerates in the new language via prompt instructions. All UI components and AI features support both languages.

**Q38: What is the Quick Guide feature?**

A: A collapsible onboarding banner on tool pages (Link Scanner, File Scanner, Password Checker, Credential Vault) showing 3-4 numbered steps with emoji icons. For example: "Copy a link → Paste it → Click Scan Now → Read the result." This helps first-time users aged 9-15 use each tool independently without adult supervision.

---

### 12. Testing & Evaluation

**Q39: What types of testing did you perform?**

A:
- **Functional Testing**: Testing all features work as specified
- **Security Testing**: Encryption verification, vault data protection, API key exposure, input validation, session management
- **Performance Testing**: Response times for crypto operations, cold start time
- **Usability Testing**: Testing with target demographic (ages 9-15), survey-based assessment

**Q40: How did you test with the target demographic?**

A: We conducted usability testing with students aged 9-15, using task scenarios and surveys to evaluate: ease of use, engagement, comprehension, and satisfaction. The testing approach included structured test cases executed through the running application.

**Q41: What were the key usability testing findings?**

A: Key findings showed that the age-appropriate design with visual feedback indicators (red/green for password strength), non-technical language, and the Quick Guide feature successfully helped younger users navigate the application independently.

**Q42: What security testing did you conduct?**

A: We verified:
- Encryption produces different ciphertext for same input (unique salt/nonce)
- Vault data remains encrypted in database
- API keys are stored only in Rust backend, never exposed to frontend
- Input validation prevents injection attacks
- Session management properly handles auth state

---

### 13. Limitations & Future Work

**Q43: What are the known limitations of CHEA?**

A:
- No automated testing framework (manual testing only)
- Firestore REST API workaround adds complexity
- AI model rate limits may affect response time
- Some features require internet connectivity
- Limited to Windows/macOS desktop (no mobile)

**Q44: What would you add in future iterations?**

A:
- Mobile app versions (iOS/Android)
- More advanced AI models with better reasoning
- Teacher dashboard for monitoring student progress
- Cloud backup for vault data
- More quiz content and difficulty levels
- Integration with school single sign-on systems

**Q45: How could the project be scaled?**

A: The project could scale by: (1) adding multi-language support beyond English/Arabic, (2) implementing teacher dashboards for classroom management, (3) creating school-wide deployment options, (4) adding more gamification elements, and (5) integrating with educational LMS platforms.

---

### 14. Technical Challenges

**Q46: What was the biggest technical challenge?**

A: The Firestore gRPC-web incompatibility with Tauri's WebView2 was a significant challenge. We spent considerable time debugging persistent "client is offline" errors before identifying the transport layer issue and implementing the REST API workaround.

**Q47: How do you handle AI API rate limits?**

A: We implement request batching, caching of AI-generated content locally, and monitoring usage patterns. If limits are exceeded, we activate fallback content, queue requests, and notify users of delayed responses.

**Q48: How do you handle AI hallucinations or incorrect responses?**

A: We implement strict system prompts with clear boundaries, JSON schema validation for structured outputs, fallback messages for edge cases, and error handling that displays user-friendly messages instead of raw AI errors.

---

### 15. Project Management

**Q49: Why did you choose Agile/Scrum?**

A: Agile was chosen because: (1) the project has evolving requirements essential for a user-centered app, (2) incremental delivery allows continuous feedback, (3) modular features (Phishing Dojo, Password Management, AI features) fit well with sprints, (4) flexibility to adjust UI based on testing with children, and (5) reduces risk by early delivery of working modules.

**Q50: How did you manage risks?**

A: We used a risk management plan with probability and impact assessment. Key risks included AI integration complexity, external API dependency, encryption vulnerabilities, and scope creep. Each risk had mitigation strategies and contingency plans.

---

### 16. Comparative Analysis

**Q51: How does CHEA compare to existing tools?**

A: Unlike existing tools, CHEA provides:
- All five security tools (password, URL, encrypt, games, AI) in ONE application
- Target age 9-15 specifically (others target adults)
- Both education AND protection combined
- Free with no subscription
- Bilingual (English/Arabic)

**Q52: What makes CHEA unique?**

A: CHEA is unique because it: (1) combines practical protection with educational content, (2) targets the specific age gap (9-15) that others miss, (3) implements research-backed gamification, (4) provides six AI-powered features, and (5) offers everything free in a unified platform.

---

### 17. Conclusion

**Q53: What is the significance of this project?**

A: The project addresses critical gaps in K-12 cybersecurity education by providing an integrated, gamified, age-appropriate platform that combines protection with education. It proves that security tools can be both educational AND accessible to children, potentially influencing how cybersecurity is taught to younger generations.

**Q54: What did you learn from this project?**

A: Key learnings include: the importance of user-centered design for children, the effectiveness of gamification in education, the challenges of integrating multiple AI services, the complexity of building secure desktop applications, and the value of iterative development with user feedback.

**Q55: What are the key takeaways?**

A: Key takeaways:
- Cybersecurity education for children requires both protection tools AND educational content
- Gamification significantly improves engagement and retention
- Age-appropriate design is critical - can't just retrofit adult tools
- AI can enhance both protection and education
- Free, accessible tools can bridge the digital security divide

---

## Additional Quick Reference Questions

**Q56: What programming languages were used?**
A: TypeScript (frontend), Rust (backend)

**Q57: What frameworks were used?**
A: React 18, Tauri v2, Vite 5

**Q58: What is the database?**
A: Firebase Firestore (NoSQL)

**Q59: What AI model is used?**
A: x-ai/grok-4-fast via OpenRouter API

**Q60: What encryption is used?**
A: AES-256-GCM, ChaCha20-Poly1305 with Argon2id key derivation

---

*Document prepared for Senior Project Examination - ITCY 499*
*Cyber Hygiene Educator & Assistant (CHEA)*
*Academic Year 2025-2026, Semester 2*