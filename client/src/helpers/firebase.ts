import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth"
import { initializeApp, FirebaseApp } from "firebase/app"
import { getEvn } from "./getEnv"

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrB9FupDgjjVk4_guLC24ydG3retE3bME",
    authDomain: "login-auth-4736e.firebaseapp.com",
    projectId: "login-auth-4736e",
    storageBucket: "login-auth-4736e.appspot.com",
    messagingSenderId: "10562914305",
    appId: "1:10562914305:web:2cff37be4fa9ccf0a29800"
  };

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig)

const auth: Auth = getAuth(app)
const provider: GoogleAuthProvider = new GoogleAuthProvider()

export { auth, provider }
