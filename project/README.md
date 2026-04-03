# HyperTool

A comprehensive cybersecurity desktop application built with Tauri (React + TypeScript + Rust).

## Overview

HyperTool is a powerful cybersecurity suite designed to help users manage their digital security with features including:
- Link scanning and threat detection
- Password vault with AES-256-GCM encryption
- Security analysis and reporting
- User authentication and secure data storage

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe development
- **Zustand** - State management
- **React Query** - Server state management
- **Tailwind CSS** - Styling

### Backend
- **Rust** - Core backend logic
- **Tauri** - Desktop application framework
- **AES-256-GCM** - Encryption for sensitive data
- **Argon2id** - Password hashing

### Build Tools
- **Bun** - JavaScript runtime and package manager
- **Cargo** - Rust package manager

## Prerequisites

- **Node.js 18+** and **Bun** (for frontend)
- **Rust 1.70+** and **Cargo** (for backend)
- **Tauri CLI** - Install via: `cargo install tauri-cli`

## Getting Started

### 1. Install Dependencies

```bash
# Install frontend dependencies
bun install
```

### 2. Development Mode

```bash
# Start the development server (runs both frontend and backend)
bun run tauri dev
```

This will:
- Start the React development server
- Build and run the Rust backend
- Open the application window

### 3. Build for Production

```bash
# Build the production bundle
bun run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`.

## Development Workflow

### Frontend Commands

```bash
bun run tauri dev      # Start development server
bun run lint          # Run ESLint
bun run typecheck      # Run TypeScript type checking
```

### Backend Commands

```bash
cargo run              # Run Rust backend in development
cargo test             # Run all tests
cargo clippy           # Run Rust linter
cargo fmt              # Format Rust code
```

## Project Structure

```
project/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # UI components
│   │   ├── ui/                  # Reusable UI elements
│   │   ├── scanner/             # Link scanning components
│   │   ├── vault/               # Password vault components
│   │   └── auth/                # Authentication components
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand state stores
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
│
├── src-tauri/                    # Backend (Rust)
│   ├── src/
│   │   ├── commands/            # Tauri IPC commands
│   │   ├── crypto/              # Encryption modules
│   │   ├── storage/             # Database operations
│   │   └── main.rs              # Application entry point
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
│
├── package.json                 # Frontend dependencies
└── AGENTS.md                    # Development guidelines
```

## Code Style Guidelines

### TypeScript
- Use explicit types - avoid `any` unless necessary
- camelCase for variables/functions
- PascalCase for interfaces/types and components
- Group imports: external → internal → relative

### Rust
- Explicit types for all parameters and returns
- snake_case for functions/variables
- PascalCase for structs/enums
- Use `Result<T, Error>` for error handling

## Security Best Practices

- All sensitive data is encrypted with AES-256-GCM
- Passwords are hashed with Argon2id
- No secrets are committed to version control
- All user inputs are validated before processing
- Frontend-backend communication uses Tauri IPC

## Quality Checklist

Before committing code, ensure:
- [ ] Code compiles without warnings
- [ ] TypeScript has no `any` types without justification
- [ ] Rust code passes `cargo clippy` without errors
- [ ] All sensitive data is properly encrypted
- [ ] Error handling covers edge cases

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## License

[Add your license information here]

## Contributing

Please follow the guidelines in [AGENTS.md](./AGENTS.md) for code style, architecture, and quality standards.