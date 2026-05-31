// ==========================================================================
// SN ART — Storefront Firebase bridge
// Loads products live from Firestore and hands them to the storefront via
// window.snLoadProducts(). If Firestore is empty or unreachable, the page
// simply keeps its built-in fallback catalogue (defined in index.js).
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig, PRODUCTS_COLLECTION } from "./admin/firebase-config.js";

const CATEGORY_LABELS = {
    tokri: "Kashmiri Tokri Baskets",
    papier_mache: "Papier Mâché Artifacts",
    pashmina: "Pashmina & Kani Shawls",
    wood_carving: "Wood Carving & Khatamband",
    namda: "Namda Rugs",
    other: "Other"
};

// Map a Firestore product document to the shape the storefront expects.
function mapProduct(id, d) {
    return {
        id: id,
        name: d.name || "Untitled",
        category: d.category || "other",
        categoryName: d.categoryName || CATEGORY_LABELS[d.category] || "Kashmiri Craft",
        price: Number(d.price) || 0,
        rating: Number(d.rating) || 5.0,
        reviews: Number(d.reviews) || 0,
        image: d.image || "assets/tokri_basket.png",
        badge: d.badge || "Handcrafted",
        // Storefront templates read `details`; admin stores `description`.
        details: d.description || d.details || "",
        dimensions: d.dimensions || "—",
        material: d.material || "—",
        origin: d.origin || "Kashmir",
        stock: Number(d.stock) || 0
    };
}

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
    onSnapshot(
        q,
        (snap) => {
            if (snap.empty) return; // keep fallback catalogue
            const live = snap.docs.map((doc) => mapProduct(doc.id, doc.data()));
            if (typeof window.snLoadProducts === "function") {
                window.snLoadProducts(live);
            }
        },
        (err) => {
            // Non-fatal: log and keep the fallback catalogue.
            console.warn("SN ART: live products unavailable, using built-in catalogue.", err.code || err.message);
        }
    );
} catch (err) {
    console.warn("SN ART: Firebase not initialised, using built-in catalogue.", err.message);
}
