// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAz-WUX5fiwNfGkkh-4AtfJJYiLtPY4lk",
  authDomain: "video-tutorial-6f559.firebaseapp.com",
  projectId: "video-tutorial-6f559",
  storageBucket: "video-tutorial-6f559.firebasestorage.app",
  messagingSenderId: "503210100704",
  appId: "1:503210100704:web:69e0db07221a0f03d38d85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
export const db = getFirestore(app);

export { storage }