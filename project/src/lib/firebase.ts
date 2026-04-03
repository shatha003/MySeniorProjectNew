import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAW7B2x5i_ZPKqs5k40zLSzAnTIZ2dyD1U",
    authDomain: "chea-new.firebaseapp.com",
    projectId: "chea-new",
    storageBucket: "chea-new.firebasestorage.app",
    messagingSenderId: "706181810831",
    appId: "1:706181810831:web:d465270ba0bdf00d7f7efa",
    measurementId: "G-T9N5YQJGYR"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
});

export async function setAuthPersistence(rememberMe: boolean) {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
}

export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

export default app;
