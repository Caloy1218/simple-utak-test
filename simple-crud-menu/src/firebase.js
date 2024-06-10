import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD57OT3UsE5gmLGNjxtHIXXZu-_Lzv6WKA",
  authDomain: "utak-restaurant-menu.firebaseapp.com",
  projectId: "utak-restaurant-menu",
  storageBucket: "utak-restaurant-menu.appspot.com",
  messagingSenderId: "542304608854",
  appId: "1:542304608854:web:8cb618da350f10c28791f7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
