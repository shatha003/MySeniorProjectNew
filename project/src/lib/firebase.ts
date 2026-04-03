import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, browserPopupRedirectResolver, setPersistence, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC2-5eY7G-SlS1WJlbqGYdwgQicba-guRA",
    authDomain: "seniorproject-d1dbb.firebaseapp.com",
    projectId: "seniorproject-d1dbb",
    storageBucket: "seniorproject-d1dbb.firebasestorage.app",
    messagingSenderId: "220494552719",
    appId: "1:220494552719:web:c2c06a1a1f18862eb31afa",
    measurementId: "G-F5QQMTS4CM"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
    popupRedirectResolver: browserPopupRedirectResolver
});

export async function setAuthPersistence(rememberMe: boolean) {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
}

export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
export const googleProvider = new GoogleAuthProvider();

export default app;
