
import { initializeApp } from "firebase/app";
import {getFirestore, collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBj-X3PruwRjEFYQfSrlTrrF2OCwZzVUXI",
  authDomain: "movieverse-e15f5.firebaseapp.com",
  projectId: "movieverse-e15f5",
  storageBucket: "movieverse-e15f5.appspot.com",
  messagingSenderId: "782549173000",
  appId: "1:782549173000:web:9e84c15257a9f2f58222bd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const moviesRef = collection(db,"movies");
export const reviewsRef = collection(db,"reviews");
export const usersRef = collection(db, "users");

export default app; 