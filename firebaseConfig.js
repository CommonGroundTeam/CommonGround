// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig =
  Platform.OS === "ios"
    ? {
        apiKey: "AIzaSyDOFE6Cbf2SHRBI70132-WgRARS7OGfQaI",
        authDomain: "commonground-84817.firebaseapp.com",
        projectId: "commonground-84817",
        storageBucket: "commonground-84817.firebasestorage.app",
        messagingSenderId: "533701465679",
        appId: "1:533701465679:ios:feed39ec0cd311fde93c3a",
      }
    : {
        apiKey: "AIzaSyBmwK-6n_1EjheavNYyzpuDk6blZyE_wjk",
        authDomain: "commonground-84817.firebaseapp.com",
        projectId: "commonground-84817",
        storageBucket: "commonground-84817.firebasestorage.app",
        messagingSenderId: "533701465679",
        appId: "1:533701465679:android:6b452fd6ac57deade93c3a",
      };

export default firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_APP = app;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_AUTH = auth;
export const usersRef = collection(FIRESTORE_DB, "users");
export const roomRef = collection(FIRESTORE_DB, "rooms");
