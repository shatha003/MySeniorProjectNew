# CHEA - Development Guidelines for Agentic Coding

This file contains build commands, coding standards, and architectural guidelines for AI agents working on the CHEA cybersecurity application.

## Project Overview

CHEA is a desktop cybersecurity application built with Tauri (React + TypeScript + Rust) featuring a password vault, link/file scanning, and security analysis tools.

**Tech Stack:**
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- State: Zustand for global state
- Backend: Tauri (Rust) for desktop integration
- Database: Firebase Firestore
- Theme: Cyberpunk/neon aesthetic with light/dark mode support

---

## Build, Lint, and Test Commands

All commands must be run from the `project/` directory:

```bash
# Development
bun run tauri dev        # Start full dev server (frontend + backend)
bun run dev              # Start Vite dev server only

# Build
bun run build            # Production build (TypeScript check + Vite build)

# Quality Assurance
bun run lint             # Run ESLint

# Preview
bun run preview          # Preview production build
```

**Important Notes:**
- No test framework is currently configured. Add tests before implementing features.
- Always run `bun run lint` after code changes.
- Ensure TypeScript compilation passes before committing (build command runs type check).

---

## Code Style Guidelines

### TypeScript

**Type Safety:**
- Use explicit types - avoid `any` unless absolutely necessary
- Define interfaces for all component props
- Use type unions for limited option sets (e.g., `ActivityType`)
- Export types/interfaces that are used across files

**Naming Conventions:**
- Components: `PascalCase` (e.g., `Button`, `DashboardLayout`)
- Functions/Variables: `camelCase` (e.g., `logActivity`, `setUser`)
- Types/Interfaces: `PascalCase` (e.g., `Activity`, `AuthState`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `ACTIVITY_POINTS`)
- Hooks: `use*` prefix (e.g., `useAuthStore`, `useTheme`)

**Import Organization:**
```typescript
// 1. External libraries
import { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Internal imports using @/ alias
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/useAuthStore'

// 3. Relative imports (local files)
import Button from './components/ui/Button'
```

**Component Structure:**
- Use functional components with hooks
- Define interfaces before component
- Use `forwardRef` for button/input components that may need refs
- Set `displayName` for forwardRef components
- Export components as default

**Example Component:**
```typescript
import { forwardRef } from 'react'

interface ComponentProps {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ children, variant = 'primary', onClick }, ref) => {
    // Implementation
  }
)

Component.displayName = 'Component'

export default Component
```

### Styling (Tailwind CSS)

**Utility Classes:**
- Use Tailwind utility classes for all styling
- Prefer component variants over inline styles
- Use `cn()` utility for conditional classes (from `@/lib/utils`)

**Theme System:**
- Use CSS variables for colors: `hsl(var(--primary))`
- Support light/dark modes with `.dark` class
- Use theme-specific colors: `neon-crimson`, `neon-violet`, `cyber-void`, etc.

**Animations:**
- Use Framer Motion for complex animations
- Use Tailwind for simple transitions
- Custom animations in `tailwind.config.js`: `fade-in`, `slide-up`, `shimmer`, etc.

**Example Styling:**
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  variant === 'primary' && "primary-classes",
  "hover:scale-105 transition-all"
)}>
```

### State Management (Zustand)

**Store Pattern:**
```typescript
import { create } from 'zustand'

interface State {
  state: Type
  setState: (state: Type) => void
}

export const useStore = create<State>((set) => ({
  state: initialValue,
  setState: (state) => set({ state }),
}))
```

**File Organization:**
- All stores in `src/store/`
- Prefix with `use` (e.g., `useAuthStore.ts`)
- Export store as default

### Services

**Service Pattern:**
```typescript
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface ServiceType {
  id?: string
  field: string
}

export async function serviceFunction(param: string): Promise<string> {
  if (!param) throw new Error('Parameter required')
  
  const docRef = await addDoc(collection(db, 'path'), { field: param })
  return docRef.id
}
```

**File Organization:**
- All services in `src/services/`
- Export types and functions
- Use async/await for Firestore operations
- Throw descriptive errors for validation

### Error Handling

**Async Functions:**
```typescript
try {
  await someAsyncOperation()
} catch (err: any) {
  console.error(err)
  setError('Descriptive error message')
} finally {
  setLoading(false)
}
```

**Component Error States:**
- Use `useState` for error messages
- Display errors to users in UI
- Log errors to console for debugging
- Always handle loading states

### File Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Input, etc.)
│   ├── layout/       # Layout components (DashboardLayout, etc.)
│   └── auth/         # Auth-specific components
├── pages/            # Route components
├── services/         # Firebase/API service functions
├── store/            # Zustand state stores
├── hooks/            # Custom React hooks
├── lib/              # Utilities (firebase.ts, utils.ts)
├── assets/           # Images, fonts, etc.
├── data/             # Static data
├── App.tsx           # Root component with routing
└── main.tsx          # Entry point
```

---

## Architectural Patterns

### Routing
- Use `react-router-dom` with nested routes
- Create `ProtectedRoute` and `PublicRoute` guards
- Default route redirects to `/login`

### Authentication
- Firebase Auth for user authentication
- Zustand store for auth state (`useAuthStore`)
- Track loading state during auth initialization
- Store user in Zustand, not in localStorage

### Firebase Integration
- Initialize Firebase in `src/lib/firebase.ts`
- Use Firestore SDK for database operations
- Use `serverTimestamp()` for timestamps
- Structure Firestore as: `users/{userId}/collection/`

### Theme Support
- Use `ThemeProvider` from `@/components/theme-provider`
- Access theme with `useTheme()` hook
- Support both light and dark modes
- Use `resolvedTheme === 'dark'` to check current theme

---

## Quality Checklist

Before completing any task:
- [ ] Code compiles without errors (`bun run build`)
- [ ] Linting passes without errors (`bun run lint`)
- [ ] TypeScript has no `any` types without justification
- [ ] All async functions have proper error handling
- [ ] Components have proper TypeScript interfaces
- [ ] Imports follow the organization rules
- [ ] New components follow existing patterns
- [ ] Sensitive data is never logged or committed
- [ ] Loading states are handled for async operations
- [ ] Error messages are user-friendly and descriptive

---

## Important Notes

1. **No Test Framework**: Currently no tests exist. Always verify functionality manually.
2. **Tauri Integration**: Backend commands are in `src-tauri/src/`. Frontend communicates via Tauri IPC.
3. **Security**: Never commit secrets. All user data must be encrypted (AES-256-GCM).
4. **Theme**: Ensure all components work in both light and dark modes.
5. **Performance**: Use memoization for expensive operations. Avoid unnecessary re-renders.
6. **Icons**: Use Lucide React icons (`lucide-react`) for consistency.
