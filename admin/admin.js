// ==========================================================================
// SN ART — Admin Panel logic
// Firebase modular SDK (v10) loaded from CDN. Phone-auth login + Firestore CRUD.
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import { firebaseConfig, PRODUCTS_COLLECTION, ADMINS_COLLECTION } from "./firebase-config.js";

// --------------------------------------------------------------------------
// Init
// --------------------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
auth.languageCode = "en";

// --------------------------------------------------------------------------
// Category label map (keeps storefront + admin consistent)
// --------------------------------------------------------------------------
const CATEGORY_LABELS = {
    tokri: "Kashmiri Tokri Baskets",
    papier_mache: "Papier Mâché Artifacts",
    pashmina: "Pashmina & Kani Shawls",
    wood_carving: "Wood Carving & Khatamband",
    namda: "Namda Rugs",
    other: "Other"
};

// --------------------------------------------------------------------------
// Element helpers
// --------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

const els = {
    authView: $("authView"),
    dashView: $("dashView"),
    stepPhone: $("stepPhone"),
    stepOtp: $("stepOtp"),
    stepDenied: $("stepDenied"),
    phoneInput: $("phoneInput"),
    otpInput: $("otpInput"),
    otpPhoneLabel: $("otpPhoneLabel"),
    sendCodeBtn: $("sendCodeBtn"),
    verifyCodeBtn: $("verifyCodeBtn"),
    changePhoneBtn: $("changePhoneBtn"),
    deniedSignOutBtn: $("deniedSignOutBtn"),
    deniedUid: $("deniedUid"),
    authError: $("authError"),
    adminWho: $("adminWho"),
    addProductBtn: $("addProductBtn"),
    signOutBtn: $("signOutBtn"),
    countTotal: $("countTotal"),
    countOos: $("countOos"),
    searchBox: $("searchBox"),
    loadingState: $("loadingState"),
    emptyState: $("emptyState"),
    tableWrap: $("tableWrap"),
    tableBody: $("productTableBody"),
    productModal: $("productModal"),
    productForm: $("productForm"),
    modalTitle: $("modalTitle"),
    modalCloseBtn: $("modalCloseBtn"),
    cancelBtn: $("cancelBtn"),
    saveBtn: $("saveBtn"),
    formError: $("formError"),
    deleteModal: $("deleteModal"),
    deleteName: $("deleteName"),
    deleteCloseBtn: $("deleteCloseBtn"),
    deleteCancelBtn: $("deleteCancelBtn"),
    deleteConfirmBtn: $("deleteConfirmBtn"),
    toast: $("toast")
};

// --------------------------------------------------------------------------
// State
// --------------------------------------------------------------------------
let confirmationResult = null;   // phone-auth confirmation handle
let recaptchaVerifier = null;
let productsCache = [];          // latest snapshot of products
let unsubscribeProducts = null;  // Firestore listener cleanup
let pendingDeleteId = null;

// --------------------------------------------------------------------------
// UI utilities
// --------------------------------------------------------------------------
function showToast(message, isError = false) {
    els.toast.textContent = message;
    els.toast.classList.toggle("error", isError);
    els.toast.classList.add("show");
    setTimeout(() => els.toast.classList.remove("show"), 3200);
}

function setAuthError(msg) { els.authError.textContent = msg || ""; }
function setFormError(msg) { els.formError.textContent = msg || ""; }

function showAuthStep(step) {
    els.stepPhone.classList.toggle("hidden", step !== "phone");
    els.stepOtp.classList.toggle("hidden", step !== "otp");
    els.stepDenied.classList.toggle("hidden", step !== "denied");
}

// --------------------------------------------------------------------------
// reCAPTCHA (required by Firebase phone auth)
// --------------------------------------------------------------------------
function ensureRecaptcha() {
    if (recaptchaVerifier) return recaptchaVerifier;
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptchaContainer", {
        size: "normal",
        callback: () => setAuthError("")
    });
    recaptchaVerifier.render();
    return recaptchaVerifier;
}

function resetRecaptcha() {
    if (recaptchaVerifier) {
        try { recaptchaVerifier.clear(); } catch (_) {}
        recaptchaVerifier = null;
    }
    $("recaptchaContainer").innerHTML = "";
}

// --------------------------------------------------------------------------
// Phone authentication flow
// --------------------------------------------------------------------------
async function handleSendCode() {
    const phone = els.phoneInput.value.trim();
    setAuthError("");
    if (!/^\+\d{8,15}$/.test(phone)) {
        setAuthError("Enter the number in international format, e.g. +919876543210");
        return;
    }
    els.sendCodeBtn.disabled = true;
    els.sendCodeBtn.textContent = "Sending…";
    try {
        const verifier = ensureRecaptcha();
        confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
        els.otpPhoneLabel.textContent = phone;
        showAuthStep("otp");
        els.otpInput.focus();
    } catch (err) {
        console.error(err);
        setAuthError(friendlyAuthError(err));
        resetRecaptcha();
    } finally {
        els.sendCodeBtn.disabled = false;
        els.sendCodeBtn.textContent = "Send Code";
    }
}

async function handleVerifyCode() {
    const code = els.otpInput.value.trim();
    setAuthError("");
    if (!/^\d{6}$/.test(code)) {
        setAuthError("Enter the 6-digit code.");
        return;
    }
    if (!confirmationResult) {
        setAuthError("Session expired. Please request a new code.");
        showAuthStep("phone");
        return;
    }
    els.verifyCodeBtn.disabled = true;
    els.verifyCodeBtn.textContent = "Verifying…";
    try {
        await confirmationResult.confirm(code);
        // onAuthStateChanged handles the rest (admin check + dashboard)
    } catch (err) {
        console.error(err);
        setAuthError(friendlyAuthError(err));
    } finally {
        els.verifyCodeBtn.disabled = false;
        els.verifyCodeBtn.textContent = "Verify & Sign In";
    }
}

function friendlyAuthError(err) {
    const code = (err && err.code) || "";
    const map = {
        "auth/invalid-phone-number": "That phone number looks invalid. Use international format like +91…",
        "auth/missing-phone-number": "Please enter a phone number.",
        "auth/quota-exceeded": "SMS quota exceeded. Try again later.",
        "auth/too-many-requests": "Too many attempts. Please wait a while and try again.",
        "auth/invalid-verification-code": "Incorrect code. Please check and try again.",
        "auth/code-expired": "That code expired. Request a new one.",
        "auth/captcha-check-failed": "reCAPTCHA failed. Reload the page and try again.",
        "auth/operation-not-allowed": "Phone sign-in isn't enabled in Firebase. Enable it under Authentication › Sign-in method."
    };
    return map[code] || ("Authentication error: " + (err.message || code || "unknown"));
}

// --------------------------------------------------------------------------
// Admin authorisation check
// --------------------------------------------------------------------------
async function isAuthorisedAdmin(uid) {
    try {
        const snap = await getDoc(doc(db, ADMINS_COLLECTION, uid));
        return snap.exists();
    } catch (err) {
        console.error("Admin check failed:", err);
        return false;
    }
}

// --------------------------------------------------------------------------
// Auth state listener — single source of truth for which view shows
// --------------------------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        teardownDashboard();
        els.dashView.classList.add("hidden");
        els.authView.classList.remove("hidden");
        showAuthStep("phone");
        return;
    }

    const allowed = await isAuthorisedAdmin(user.uid);
    if (!allowed) {
        teardownDashboard();
        els.dashView.classList.add("hidden");
        els.authView.classList.remove("hidden");
        els.deniedUid.textContent = user.uid;
        showAuthStep("denied");
        return;
    }

    // Authorised — open dashboard
    setAuthError("");
    els.authView.classList.add("hidden");
    els.dashView.classList.remove("hidden");
    els.adminWho.textContent = user.phoneNumber || "Admin";
    startProductsListener();
});

// --------------------------------------------------------------------------
// Real-time products listener
// --------------------------------------------------------------------------
function startProductsListener() {
    if (unsubscribeProducts) return; // already listening
    els.loadingState.classList.remove("hidden");
    els.emptyState.classList.add("hidden");

    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
    unsubscribeProducts = onSnapshot(q, (snap) => {
        productsCache = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        renderProducts();
    }, (err) => {
        console.error("Products listener error:", err);
        els.loadingState.classList.add("hidden");
        showToast("Could not load products. Check Firestore rules.", true);
    });
}

function teardownDashboard() {
    if (unsubscribeProducts) {
        unsubscribeProducts();
        unsubscribeProducts = null;
    }
    productsCache = [];
}

// --------------------------------------------------------------------------
// Render product list
// --------------------------------------------------------------------------
function renderProducts() {
    els.loadingState.classList.add("hidden");

    const term = els.searchBox.value.trim().toLowerCase();
    const list = term
        ? productsCache.filter((p) =>
            (p.name || "").toLowerCase().includes(term) ||
            (p.category || "").toLowerCase().includes(term) ||
            (CATEGORY_LABELS[p.category] || "").toLowerCase().includes(term))
        : productsCache;

    // Stats reflect the full catalogue, not the filtered view
    els.countTotal.textContent = productsCache.length;
    els.countOos.textContent = productsCache.filter((p) => Number(p.stock) <= 0).length;

    if (productsCache.length === 0) {
        els.tableWrap.classList.add("hidden");
        els.emptyState.classList.remove("hidden");
        return;
    }
    els.emptyState.classList.add("hidden");
    els.tableWrap.classList.remove("hidden");

    els.tableBody.innerHTML = "";
    if (list.length === 0) {
        els.tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No products match “${escapeHtml(term)}”.</td></tr>`;
        return;
    }

    list.forEach((p) => {
        const stock = Number(p.stock) || 0;
        const stockClass = stock <= 0 ? "stock-out" : stock <= 5 ? "stock-low" : "stock-ok";
        const stockLabel = stock <= 0 ? "Out of stock" : stock;
        const catLabel = CATEGORY_LABELS[p.category] || p.category || "—";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Image" class="col-img">
                <img class="row-img" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}"
                     onerror="this.style.visibility='hidden'">
            </td>
            <td data-label="Name">
                <div class="row-name">${escapeHtml(p.name)}</div>
                ${p.badge ? `<span class="row-badge">${escapeHtml(p.badge)}</span>` : ""}
            </td>
            <td data-label="Category"><span class="cat-chip">${escapeHtml(catLabel)}</span></td>
            <td data-label="Price" class="col-num">₹${Number(p.price || 0).toLocaleString("en-IN")}</td>
            <td data-label="Stock" class="col-num"><span class="stock-tag ${stockClass}">${stockLabel}</span></td>
            <td data-label="Actions" class="col-actions">
                <div class="row-actions">
                    <button class="admin-btn admin-btn-ghost admin-btn-sm" data-edit="${p.id}">Edit</button>
                    <button class="admin-btn admin-btn-danger admin-btn-sm" data-del="${p.id}">Delete</button>
                </div>
            </td>
        `;
        els.tableBody.appendChild(tr);
    });
}

// Event delegation for edit/delete buttons
els.tableBody.addEventListener("click", (e) => {
    const editId = e.target.getAttribute("data-edit");
    const delId = e.target.getAttribute("data-del");
    if (editId) openProductModal(editId);
    if (delId) openDeleteModal(delId);
});

els.searchBox.addEventListener("input", renderProducts);

// --------------------------------------------------------------------------
// Product modal (add / edit)
// --------------------------------------------------------------------------
function openProductModal(id) {
    setFormError("");
    els.productForm.reset();
    $("imgPreview").classList.remove("show");

    if (id) {
        const p = productsCache.find((x) => x.id === id);
        if (!p) { showToast("Product not found.", true); return; }
        els.modalTitle.textContent = "Edit Product";
        $("productId").value = p.id;
        $("f_name").value = p.name || "";
        $("f_category").value = p.category || "other";
        $("f_price").value = p.price ?? "";
        $("f_stock").value = p.stock ?? "";
        $("f_badge").value = p.badge || "";
        $("f_image").value = p.image || "";
        $("f_description").value = p.description || p.details || "";
        updateImagePreview();
    } else {
        els.modalTitle.textContent = "Add Product";
        $("productId").value = "";
    }
    els.productModal.classList.remove("hidden");
}

function closeProductModal() {
    els.productModal.classList.add("hidden");
}

function updateImagePreview() {
    const url = $("f_image").value.trim();
    const img = $("imgPreview");
    if (url) {
        img.src = url;
        img.classList.add("show");
    } else {
        img.classList.remove("show");
    }
}
$("f_image").addEventListener("input", updateImagePreview);
$("imgPreview").addEventListener("error", () => $("imgPreview").classList.remove("show"));

// Image upload to Firebase Storage. On success, the download URL is written
// into the image field so it saves with the product like any other URL.
$("f_image_file").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        setFormError("Please choose an image file.");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setFormError("Image is larger than 5 MB. Please choose a smaller file.");
        return;
    }

    const btnText = $("uploadBtnText");
    const originalText = btnText.textContent;
    btnText.textContent = "Uploading…";
    setFormError("");

    try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `products/${Date.now()}_${safeName}`;
        const sRef = storageRef(storage, path);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        $("f_image").value = url;
        updateImagePreview();
        btnText.textContent = "Uploaded ✓";
        setTimeout(() => { btnText.textContent = originalText; }, 2000);
    } catch (err) {
        console.error(err);
        btnText.textContent = originalText;
        setFormError(uploadError(err));
    } finally {
        e.target.value = ""; // allow re-selecting the same file
    }
});

function uploadError(err) {
    const code = (err && err.code) || "";
    if (code === "storage/unauthorized") {
        return "Upload denied. Enable Firebase Storage and set its rules to allow admin writes (see SETUP.md). You can still paste an image URL instead.";
    }
    if (code === "storage/unknown" || code.includes("cors")) {
        return "Storage upload failed (Storage may not be enabled). You can paste an image URL instead.";
    }
    return "Upload failed: " + ((err && err.message) || "unknown") + ". You can paste an image URL instead.";
}

els.productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setFormError("");

    const id = $("productId").value;
    const data = {
        name: $("f_name").value.trim(),
        category: $("f_category").value,
        categoryName: CATEGORY_LABELS[$("f_category").value] || "",
        price: Number($("f_price").value),
        stock: Number($("f_stock").value),
        badge: $("f_badge").value.trim(),
        image: $("f_image").value.trim(),
        description: $("f_description").value.trim()
    };

    // Validation
    if (!data.name) return setFormError("Name is required.");
    if (!data.image) return setFormError("Image URL is required.");
    if (!data.description) return setFormError("Description is required.");
    if (Number.isNaN(data.price) || data.price < 0) return setFormError("Enter a valid price.");
    if (Number.isNaN(data.stock) || data.stock < 0) return setFormError("Enter a valid stock quantity.");

    els.saveBtn.disabled = true;
    els.saveBtn.textContent = "Saving…";
    try {
        if (id) {
            data.updatedAt = serverTimestamp();
            await updateDoc(doc(db, PRODUCTS_COLLECTION, id), data);
            showToast("Product updated.");
        } else {
            data.createdAt = serverTimestamp();
            data.updatedAt = serverTimestamp();
            await addDoc(collection(db, PRODUCTS_COLLECTION), data);
            showToast("Product added.");
        }
        closeProductModal();
    } catch (err) {
        console.error(err);
        setFormError(crudError(err));
    } finally {
        els.saveBtn.disabled = false;
        els.saveBtn.textContent = "Save Product";
    }
});

// --------------------------------------------------------------------------
// Delete flow
// --------------------------------------------------------------------------
function openDeleteModal(id) {
    const p = productsCache.find((x) => x.id === id);
    pendingDeleteId = id;
    els.deleteName.textContent = p ? p.name : "this product";
    els.deleteModal.classList.remove("hidden");
}
function closeDeleteModal() {
    els.deleteModal.classList.add("hidden");
    pendingDeleteId = null;
}
els.deleteConfirmBtn.addEventListener("click", async () => {
    if (!pendingDeleteId) return;
    els.deleteConfirmBtn.disabled = true;
    els.deleteConfirmBtn.textContent = "Deleting…";
    try {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, pendingDeleteId));
        showToast("Product deleted.");
        closeDeleteModal();
    } catch (err) {
        console.error(err);
        showToast(crudError(err), true);
    } finally {
        els.deleteConfirmBtn.disabled = false;
        els.deleteConfirmBtn.textContent = "Delete";
    }
});

function crudError(err) {
    if (err && err.code === "permission-denied") {
        return "Permission denied. Your account isn't allowed to write — check Firestore rules and the admins collection.";
    }
    return "Save failed: " + ((err && err.message) || "unknown error");
}

// --------------------------------------------------------------------------
// Escaping helpers (prevent breaking markup with quotes / angle brackets)
// --------------------------------------------------------------------------
function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
}
function escapeAttr(str) { return escapeHtml(str).replace(/`/g, "&#96;"); }

// --------------------------------------------------------------------------
// Wire up buttons
// --------------------------------------------------------------------------
els.sendCodeBtn.addEventListener("click", handleSendCode);
els.verifyCodeBtn.addEventListener("click", handleVerifyCode);
els.phoneInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSendCode(); });
els.otpInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleVerifyCode(); });

els.changePhoneBtn.addEventListener("click", () => {
    confirmationResult = null;
    els.otpInput.value = "";
    setAuthError("");
    resetRecaptcha();
    showAuthStep("phone");
});

els.deniedSignOutBtn.addEventListener("click", () => signOut(auth));
els.signOutBtn.addEventListener("click", () => signOut(auth));

els.addProductBtn.addEventListener("click", () => openProductModal(null));
els.modalCloseBtn.addEventListener("click", closeProductModal);
els.cancelBtn.addEventListener("click", closeProductModal);
els.deleteCloseBtn.addEventListener("click", closeDeleteModal);
els.deleteCancelBtn.addEventListener("click", closeDeleteModal);

// Close modals on backdrop click / Escape
[els.productModal, els.deleteModal].forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.add("hidden");
    });
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        els.productModal.classList.add("hidden");
        els.deleteModal.classList.add("hidden");
    }
});
