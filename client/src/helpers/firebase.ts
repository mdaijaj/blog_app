import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth"
import { initializeApp, FirebaseApp } from "firebase/app"
import { getEvn } from "./getEnv"

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrB9FupDgjjVk4_guLC24ydG3retE3bME",
    authDomain: "yt-mern-blog.firebaseapp.com",
    projectId: "yt-mern-blog",
    storageBucket: "yt-mern-blog.firebasestorage.app",
    messagingSenderId: "150248092393",
    appId: "1:150248092393:web:34bc9843d732ee4be7f678"
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig)

const auth: Auth = getAuth(app)
const provider: GoogleAuthProvider = new GoogleAuthProvider()

export { auth, provider }
