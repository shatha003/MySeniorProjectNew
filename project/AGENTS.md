# AGENTS.md - HyperTool Development Guidelines

## Overview
HyperTool is a cybersecurity desktop application built with Tauri (React + TypeScript + Rust).

---

## 1. Build, Lint, and Test Commands

### Frontend (React + TypeScript)
```bash
bun install                  # Install dependencies
bun run tauri dev            # Start development server
bun run tauri build          # Build for production
bun run lint                 # Run ESLint
bun run typecheck            # Run TypeScript type checking
```

### Backend (Rust)
```bash
cargo build                  # Build Rust backend
cargo run                    # Run in development mode
cargo test                   # Run all tests
cargo test test_name         # Run a single test by name
cargo test module_name::     # Run tests in a specific module
cargo test -- --nocapture    # Run tests with output visible
cargo clippy                 # Run Rust linter
cargo clippy -- -D warnings  # Lint with warnings as errors
cargo fmt                    # Format code
cargo fmt --check            # Check formatting
cargo build --release        # Build release version
```

---

## 2. Code Style Guidelines

### General Principles
- Write clean, self-documenting code with meaningful variable names
- Add inline comments for complex logic and security-critical sections
- Keep functions focused and small (under 50 lines when possible)
- Never commit secrets, API keys, or credentials to version control

### TypeScript Guidelines

#### Types
- **Always** define explicit types - avoid `any` unless absolutely necessary
- Use interfaces for object shapes, types for unions/primitives
- Export types that are used across modules

```typescript
interface Credential {
  id: string;
  website: string;
  username: string;
  encryptedPassword: string;
}
```

#### Naming Conventions
- **Variables/Functions**: camelCase (`calculateEntropy`, `scanUrl`)
- **Interfaces/Types**: PascalCase (`UserProgress`, `ScanResult`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_PASSWORD_LENGTH`)
- **Components**: PascalCase (`LinkScanner`, `PasswordInput`)

#### Imports
- Use absolute imports from `@/` alias when available
- Group imports: external → internal → relative, sort alphabetically

```typescript
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { validateUrl } from '../utils/validation';
import type { ScanResult } from '@/types';
```

#### Error Handling
- Always handle errors with try/catch for async operations
- Provide user-friendly error messages
- Log errors appropriately without exposing sensitive data

### Rust Guidelines

#### Types and Structs
- Use explicit types for all function parameters and return values
- Derive `Serialize`, `Deserialize` for types shared with frontend

```rust
#[derive(Serialize, Deserialize)]
pub struct ScanResult {
    pub url: String,
    pub threat_level: ThreatLevel,
    pub detections: Vec<Detection>,
}
```

#### Naming Conventions
- **Functions/Variables**: snake_case (`calculate_entropy`)
- **Structs/Enums**: PascalCase (`ScanResult`, `ThreatLevel`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)

#### Error Handling
- Use `Result<T, Error>` for functions that can fail
- Create custom error types for domain-specific errors
- Use `?` operator for propagating errors

#### Imports
- Group: standard library → external crates → internal modules

```rust
use std::path::Path;
use aes_gcm::{Aead, KeyInit};
use crate::crypto::CryptoEngine;
```

---

## 3. Architecture Guidelines

### Tauri IPC
- All frontend-backend communication MUST go through Tauri IPC commands
- Never expose Rust functions directly to frontend
- Use typed request/response structs

### Security
- All sensitive data (credentials, passwords) MUST be encrypted with AES-256-GCM
- Never store plaintext passwords - use Argon2id for hashing
- Validate all user inputs before processing

### State Management
- Use Zustand for global state (auth, user preferences)
- Use React Query for server state (API calls)
- Keep component state local when possible

---

## 4. File Organization
```
src/                    # Frontend (React)
├── components/         # UI components (ui/, scanner/, vault/, auth/)
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── types/              # TypeScript definitions
└── utils/              # Utility functions

src-tauri/src/          # Backend (Rust)
├── commands/           # Tauri IPC commands
├── crypto/             # Encryption modules
├── storage/            # Database operations
└── main.rs             # Entry point
```

---

## 5. Quality Checklist
- [ ] Code compiles without warnings
- [ ] TypeScript has no `any` types without justification
- [ ] Rust code passes `cargo clippy` without errors
- [ ] All sensitive data is properly encrypted
- [ ] Error handling covers edge cases
