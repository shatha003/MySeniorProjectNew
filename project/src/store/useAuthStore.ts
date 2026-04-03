import { create } from 'zustand'
import type { User } from 'firebase/auth'

interface AuthState {
    user: User | null
    loading: boolean
    masterPassword: string | null
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    setMasterPassword: (password: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    masterPassword: null,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    setMasterPassword: (password) => set({ masterPassword: password }),
}))
