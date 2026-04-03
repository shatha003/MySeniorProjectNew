import { useEffect, useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'
import { signInWithRedirect, getRedirectResult, browserPopupRedirectResolver } from 'firebase/auth'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { emit } from '@tauri-apps/api/event'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function GoogleAuthCallback() {
    const [error, setError] = useState('')

    useEffect(() => {
        const handleAuth = async () => {
            try {
                // According to Firebase documentation, signInWithRedirect behavior can be tricky in desktop webviews.
                // We will try signInWithRedirect, and if it's the first load, trigger it. 
                // Then getRedirectResult will catch the callback.

                // Check if we are returning from a redirect
                const result = await getRedirectResult(auth)

                if (result) {
                    // Success! Emit the payload back to the main window
                    await emit('google-auth-success', {
                        uid: result.user.uid,
                        email: result.user.email,
                        displayName: result.user.displayName
                    })

                    // Close this popup window
                    await getCurrentWebviewWindow().close()
                    return
                }

                // If no result, this is the initial load. Start the redirect flow.
                await signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver)

            } catch (err: any) {
                console.error("Auth error:", err)
                setError(err.message || 'Authentication failed. You can close this window.')
            }
        }

        handleAuth()
    }, [])

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
            >
                {error ? (
                    <div className="text-destructive max-w-sm">
                        <p className="font-semibold mb-2">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : (
                    <>
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                        <h2 className="text-xl font-semibold font-display">Connecting to Google...</h2>
                        <p className="text-sm text-muted-foreground">Please complete sign in on the Google page.</p>
                    </>
                )}
            </motion.div>
        </div>
    )
}
