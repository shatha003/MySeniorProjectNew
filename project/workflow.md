# HyperTool Development Workflow

## Overview

This document defines the step-by-step workflow for building HyperTool. Follow this process sequentially to ensure consistent, high-quality development.

---

## Phase 1: Project Initialization

### Step 1.1: Environment Setup

```bash
# Create project directory
mkdir hypertool && cd hypertool

# Initialize Tauri project with React + TypeScript
bun create tauri-app

# Select options:
# - Framework: React
# - Language: TypeScript
# - Package manager: bun

# Install frontend dependencies
bun add zustand @tanstack/react-query framer-motion

# Navigate to src-tauri and add Rust dependencies
cd src-tauri
cargo add serde serde_json tokio reqwest aes-gcm argon2 rand rusqlite
cargo add kamadak-exif image base64 chrono
```

### Step 1.2: Project Structure

Create the following directory structure:

```
hypertool/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   ├── scanner/              # URL & File scanner components
│   │   ├── vault/                # Credential vault components
│   │   ├── metadata/             # Image metadata components
│   │   ├── password/             # Password generator components
│   │   ├── chat/                 # AI chat components
│   │   └── gamification/         # Progress & achievements
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Zustand stores
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript definitions
│   ├── styles/                   # Global styles
│   └── App.tsx                   # Main application
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── commands/             # Tauri IPC commands
│   │   ├── crypto/               # Encryption modules
│   │   ├── scanner/              # API clients for scanning
│   │   ├── storage/              # Database operations
│   │   ├── metadata/             # EXIF processing
│   │   ├── password/             # Password generation
│   │   ├── ai/                   # AI integration
│   │   ├── gamification/         # Points & achievements
│   │   ├── error.rs              # Error handling
│   │   └── main.rs               # Entry point
│   └── tauri.conf.json           # Tauri configuration
├── package.json
└── README.md
```

### Step 1.3: Configuration Files

**tauri.conf.json** - Configure application settings:
- Set app identifier and version
- Configure window properties
- Enable required permissions
- Set up auto-updater endpoint

**Tailwind Config** - Define design system:
- Color palette (use security-themed colors)
- Typography scale
- Spacing and layout values
- Animation configurations

---

## Phase 2: Core Infrastructure Development

### Step 2.1: Encryption Module (Critical)

**Build Order:**
1. Create `src-tauri/src/crypto/mod.rs`
2. Implement key derivation with Argon2id
3. Implement AES-256-GCM encryption/decryption
4. Add secure random generation for nonces
5. Write unit tests for all crypto functions

**Verification:**
```bash
cd src-tauri
cargo test crypto::
```

### Step 2.2: Database Layer

**Build Order:**
1. Create `src-tauri/src/storage/database.rs`
2. Define schema migrations
3. Implement CRUD operations for each table
4. Add connection pooling
5. Write integration tests

**Verification:**
```bash
cargo test storage::
```

### Step 2.3: IPC Command Layer

**Build Order:**
1. Create typed request/response structs
2. Implement command functions for each feature
3. Register commands in `main.rs`
4. Create TypeScript type definitions
5. Test IPC communication

**Verification:**
```bash
bun run tauri dev
# Test each command from browser console
```

### Step 2.4: Authentication System

**Build Order:**
1. Create authentication UI components:
   - Login page with email/password fields
   - Registration page with email/password/confirmation
   - Master password setup page (first-time)
   - Lock screen for auto-lock
2. Implement session management in Rust backend
3. Add auto-lock functionality with configurable timeout
4. Build login/register UI
5. Integrate Firebase Auth (optional)
6. Create password strength validation component

---

## Phase 3: Feature Development Workflow

### For Each Feature Module, Follow This Process:

#### 3.1 Planning (Before Coding)

1. **Read Documentation** - Review feature specs in documentation plan
2. **Define Interfaces** - Create TypeScript types and Rust structs
3. **List Components** - Identify all UI components needed
4. **Map Data Flow** - Document data flow from UI → IPC → Backend → Storage

#### 3.2 Backend Development (Rust)

```
┌─────────────────────────────────────────┐
│           BACKEND WORKFLOW              │
├─────────────────────────────────────────┤
│  1. Define data structures              │
│  2. Implement core logic                │
│  3. Add error handling                  │
│  4. Write unit tests                    │
│  5. Create IPC command                  │
│  6. Test with cargo test                │
└─────────────────────────────────────────┘
```

#### 3.3 Frontend Development (React)

```
┌─────────────────────────────────────────┐
│          FRONTEND WORKFLOW              │
├─────────────────────────────────────────┤
│  1. Create component structure          │
│  2. Build base UI elements              │
│  3. Connect to IPC commands             │
│  4. Add loading/error states            │
│  5. Implement state management          │
│  6. Test in browser                     │
└─────────────────────────────────────────┘
```

#### 3.4 Integration Testing

1. Test complete user flow
2. Verify data persistence
3. Check error handling
4. Validate gamification points
5. Test edge cases

---

## Phase 4: Feature Build Order

### Week 1-4: Foundation

| Priority | Task | Dependencies |
|----------|------|--------------|
| 1 | Project setup | None |
| 2 | Encryption module | None |
| 3 | Database layer | Encryption |
| 4 | IPC layer | Database |
| 5 | Authentication | All above |

### Week 5-10: Core Features

| Priority | Feature | Dependencies |
|----------|---------|--------------|
| 1 | URL Scanner | IPC, Database |
| 2 | File Scanner | IPC, Database |
| 3 | Image Metadata | IPC, Rust image libs |
| 4 | Gamification base | Database |

### Week 11-14: Password Features

| Priority | Feature | Dependencies |
|----------|---------|--------------|
| 1 | Password Generator | Crypto module |
| 2 | Credential Vault | Encryption, Database |
| 3 | Vault UI | All above |

### Week 15-20: AI Features

| Priority | Feature | Dependencies |
|----------|---------|--------------|
| 1 | AI API client | HTTP client |
| 2 | Security Tips | AI client |
| 3 | AI Chat | AI client |
| 4 | Chat UI | All above |

### Week 21-24: Polish

| Priority | Task | Dependencies |
|----------|------|--------------|
| 1 | Integration testing | All features |
| 2 | Performance optimization | All features |
| 3 | Security audit | All features |
| 4 | Documentation | All features |
| 5 | Build & deployment | All above |

---

## Phase 5: Testing Workflow

### 5.1 Unit Testing

**Rust (Run after each module):**
```bash
cd src-tauri
cargo test                    # All tests
cargo test module_name::      # Specific module
cargo test -- --nocapture     # Show output
```

**Frontend (Run after each component):**
```bash
bun run test                  # All tests
bun run test ComponentName    # Specific test
```

### 5.2 Integration Testing

**Test Checklist per Feature:**

- [ ] IPC command executes successfully
- [ ] Valid data returns correct response
- [ ] Invalid data returns appropriate error
- [ ] Data persists correctly in database
- [ ] UI displays results correctly
- [ ] Loading states work properly
- [ ] Error states display user-friendly messages

### 5.3 Security Testing

**Run before each release:**

```bash
# Dependency audit
bun audit
cargo audit

# Rust linter
cargo clippy -- -D warnings

# TypeScript check
bun run lint
```

---

## Phase 6: Code Review Process

### 6.1 Self-Review Checklist

Before marking any task complete:

**Security:**
- [ ] No hardcoded secrets or API keys
- [ ] All sensitive data encrypted
- [ ] Input validation implemented
- [ ] Error messages don't leak information

**Code Quality:**
- [ ] No compiler warnings
- [ ] No linter errors
- [ ] Functions are focused and small
- [ ] Complex logic is documented

**Functionality:**
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] User experience is smooth

### 6.2 Documentation Update

After completing each feature:

1. Update inline code documentation
2. Update API documentation if interfaces changed
3. Note any deviations from original plan
4. Document any known limitations

---

## Phase 7: Build and Release

### 7.1 Pre-Build Checklist

- [ ] All tests passing
- [ ] No linter warnings
- [ ] Security audit complete
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Documentation current

### 7.2 Build Commands

```bash
# Development build
bun run tauri dev

# Production build (current platform)
bun run tauri build

# Build outputs location:
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/deb/
```

### 7.3 Post-Build Verification

- [ ] Application launches without errors
- [ ] All features functional in build
- [ ] Auto-updater works correctly
- [ ] File associations work (if applicable)
- [ ] Application signs correctly

---

## Error Handling Protocol

### When Errors Occur

```
┌─────────────────────────────────────────┐
│         ERROR RESOLUTION FLOW           │
├─────────────────────────────────────────┤
│  1. Document the error                  │
│  2. Identify root cause                 │
│  3. Propose solution options            │
│  4. Implement fix                       │
│  5. Add test to prevent regression      │
│  6. Update documentation if needed      │
└─────────────────────────────────────────┘
```

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| IPC command not found | Check command registration in main.rs |
| Encryption fails | Verify key derivation and nonce usage |
| Database locked | Check for concurrent connections |
| API timeout | Implement retry with exponential backoff |
| Memory leak | Profile with cargo profiler |

---

## Daily Development Routine

### Start of Session

1. Pull latest changes (if team project)
2. Review current task in roadmap
3. Check for any blockers from previous session
4. Run `bun run tauri dev` to verify environment

### During Development

1. Write code in small, testable increments
2. Run tests frequently
3. Commit after each logical unit of work
4. Document any important decisions

### End of Session

1. Run full test suite
2. Update progress in worklog
3. Document any unfinished work
4. Note any blockers for next session

---

## Communication Templates

### Progress Report

```
## Session Summary - [Date]

### Completed
- [List completed tasks]

### In Progress
- [Current task and status]

### Blockers
- [Any blockers requiring attention]

### Next Steps
- [Planned tasks for next session]
```

### Issue Report

```
## Issue: [Brief Description]

### Context
- Feature: [Affected feature]
- Environment: [Dev/Build/Production]

### Error Details
```
[Error message or stack trace]
```

### Proposed Solution
[Description of proposed fix]

### Impact
[Impact on timeline or other features]
```

---

## Quick Reference

### Essential Commands

```bash
# Development
bun run tauri dev          # Start dev server
bun run lint               # Run linters
cargo clippy               # Rust linter
cargo test                 # Rust tests

# Building
bun run tauri build        # Production build

# Database
cargo install diesel_cli   # If using Diesel ORM
diesel migration run       # Run migrations
```

### File Locations

| Purpose | Location |
|---------|----------|
| Frontend components | `src/components/` |
| State management | `src/store/` |
| Rust commands | `src-tauri/src/commands/` |
| Crypto module | `src-tauri/src/crypto/` |
| Database | `src-tauri/src/storage/` |
| Tauri config | `src-tauri/tauri.conf.json` |

---

**End of Workflow Document**
