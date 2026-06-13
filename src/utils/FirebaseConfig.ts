import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCxod-eup82Oy_Od04YLHs7iOQdFGBmEHU",
  authDomain: "ruet-cse-24.firebaseapp.com",
  projectId: "ruet-cse-24",
  storageBucket: "ruet-cse-24.firebasestorage.app",
  messagingSenderId: "45659772253",
  appId: "1:45659772253:web:963ee9de7794ee482d84b4",
  measurementId: "G-B8107S52H7",
};

const app = initializeApp(firebaseConfig);

// initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6LcO7aYsAAAAAP-IPs5gALP0XxwlG-KqgLUsgb_k"),
//   isTokenAutoRefreshEnabled: true,
// });

export const db = getFirestore(app);
