# SN ART Admin Panel — Setup Guide

A self-contained admin console for managing products in Firestore, with login
via **phone-number (SMS OTP)** authentication. No build step — it's plain
HTML/CSS/JS using the Firebase CDN, so it runs on GitHub Pages.

Open it at: `https://<your-username>.github.io/SN-ART/admin/`

---

## One-time Firebase setup

You must do these steps in the [Firebase Console](https://console.firebase.google.com)
for the panel to work. The config in `firebase-config.js` is already filled in
for your project.

### 1. Enable Phone authentication
1. Console → **Authentication** → **Sign-in method**.
2. Enable **Phone**.
3. Under **Authentication → Settings → Authorised domains**, add the domains
   the panel runs on:
   - `localhost` (for local testing)
   - `<your-username>.github.io` (for the live site)

> Phone auth requires reCAPTCHA. The panel renders the reCAPTCHA widget on the
> login screen automatically.

### 2. Create the Firestore database
1. Console → **Firestore Database** → **Create database**.
2. Start in **production mode** (we lock it down with rules next).

### 3. Publish the security rules
1. Console → **Firestore Database** → **Rules**.
2. Replace the contents with the rules from [`firestore.rules`](./firestore.rules).
3. Click **Publish**.

These rules make products publicly readable but writable only by admins, and
prevent anyone from tampering with the admin list from the browser.

### 4. Add yourself as an admin
Because phone auth alone would let *any* phone number sign in, the panel checks
an `admins` collection. Add your UID once:

1. Open the panel and sign in with your phone number + the SMS code.
2. You'll see an **"Access pending"** screen showing your **User ID** — copy it.
3. In the Console → **Firestore Database** → **Data**:
   - Create a collection named `admins` (if it doesn't exist).
   - Add a **document** whose **Document ID = your copied User ID**.
   - Add one field, e.g. `role` (string) = `owner`. (Any field works; the
     document just needs to exist.)
4. Back in the panel, sign out and sign in again — you now have full access.

To add more admins later, repeat steps 1–3 for each person's UID.

### 5. (Optional) Enable image uploads
The product form lets you either paste an image URL **or** upload a file. File
upload uses Firebase Storage:

1. Console → **Storage** → **Get started** (start in production mode).
2. Console → **Storage → Rules**, and publish rules that let admins write:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{file=**} {
      allow read: if true;                  // public product images
      allow write: if request.auth != null  // signed-in admins only
        && firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid));
    }
  }
}
```

If you skip this, image **URLs** still work everywhere — only file upload needs Storage.

---

## Product data model

Each document in the `products` collection has:

| Field         | Type    | Notes                                        |
|---------------|---------|----------------------------------------------|
| `name`        | string  | Product title                                |
| `category`    | string  | One of: `tokri`, `papier_mache`, `pashmina`, `wood_carving`, `namda`, `other` |
| `categoryName`| string  | Human-readable label (auto-filled)           |
| `price`       | number  | In ₹                                         |
| `stock`       | number  | Units available                              |
| `badge`       | string  | Optional tag, e.g. "GI-Tagged"               |
| `image`       | string  | URL or relative path (e.g. `assets/x.png`)   |
| `description` | string  | Product details                              |
| `createdAt`   | timestamp | Set automatically                          |
| `updatedAt`   | timestamp | Set automatically                          |

---

## Local testing

From the project root:

```bash
npm install
npm run dev
```

Then open `http://localhost:3010/admin/` (or whichever port lite-server prints).

---

## Notes & security

- The Firebase config values are **not secrets** — they're safe to commit. Real
  security comes from the Firestore rules + authorised admin UIDs.
- The storefront (`index.js`) currently uses a hard-coded product array. To make
  it read live products from Firestore instead, that's a follow-up change — ask
  and it can be wired up.
