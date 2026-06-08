// ==========================================================================
// Firebase configuration for SN ART admin panel.
//
// NOTE: These config values are NOT secrets — they identify your project to
// Firebase and are safe to ship in client code. Real protection comes from
// Firestore Security Rules (see admin/firestore.rules) and the Authentication
// settings in the Firebase console.
// ==========================================================================
export const firebaseConfig = {
    apiKey: "AIzaSyBpNTG8wdmJW8gkdgSDd6eeo7ethX8kHJg",
    authDomain: "project-6171059a-ad07-4459-a39.firebaseapp.com",
    projectId: "project-6171059a-ad07-4459-a39",
    storageBucket: "project-6171059a-ad07-4459-a39.firebasestorage.app",
    messagingSenderId: "464402894171",
    appId: "1:464402894171:web:e95dbb83e3c454a72e5e7e",
    measurementId: "G-RNBNVQGPP0"
};

// Firestore collection that holds product documents.
export const PRODUCTS_COLLECTION = "products";

// Firestore collection that holds live site configuration values.
export const SITE_CONFIG_COLLECTION = "site_config";

// Firestore collection that holds authorised admin UIDs (one doc per admin,
// document ID = the user's Firebase Auth UID).
export const ADMINS_COLLECTION = "admins";
