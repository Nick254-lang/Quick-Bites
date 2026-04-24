# Project 3 - Next.js with Firebase Migration

This project has been successfully migrated from Express.js to Next.js with Firebase as the backend.

## 📁 Project Structure

```
app/
  ├── api/                    # API routes (migrated from Express backend)
  │   └── orders/
  │       ├── route.js        # POST /api/orders, GET /api/orders
  │       └── [id]/route.js   # PUT /api/orders/:id
  ├── admin/
  │   └── dashboard/          # Admin dashboard (manage orders)
  ├── rider/
  │   └── dashboard/          # Rider dashboard (pickup orders)
  ├── layout.js               # Root layout with Navbar
  ├── page.js                 # Home page
  ├── menu/page.js            # Menu page
  ├── booking/page.js         # Booking page
  ├── contact/page.js         # Contact page
  ├── login/page.js           # Login page
  ├── register/page.js        # Register page
  └── globals.css             # Global styles

components/
  ├── Navbar.js               # Navigation component
  └── MenuCard.js             # Menu items component

lib/
  ├── firebase.js             # Client-side Firebase config
  └── firebaseAdmin.js        # Server-side Firebase Admin SDK

config/
  └── serviceAccountKey.json  # Firebase Admin credentials (keep secure!)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- `.env.local` file with Firebase credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure `.env.local` exists with your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_ADMIN_SDK_KEY=./config/serviceAccountKey.json
```

3. Ensure `config/serviceAccountKey.json` is in place (never commit this file!)

### Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📝 What's Changed

### From Express to Next.js API Routes

**Old (Express):**
```javascript
app.post("/api/orders/create", async (req, res) => {
  // Handle order creation
});
```

**New (Next.js):**
```javascript
// app/api/orders/route.js
export const POST = async (req) => {
  // Handle order creation
};
```

### Pages Migrated
- ✅ Home page → `app/page.js`
- ✅ Menu → `app/menu/page.js`
- ✅ Booking → `app/booking/page.js`
- ✅ Contact → `app/contact/page.js`
- ✅ Login → `app/login/page.js`
- ✅ Register → `app/register/page.js`
- ✅ Admin Dashboard → `app/admin/dashboard/page.js`
- ✅ Rider Dashboard → `app/rider/dashboard/page.js`

### Frontend Changes
- Static HTML pages converted to React components
- Client-side navigation using Next.js `Link` component
- Dark mode toggle using localStorage and state management
- Responsive hamburger menu

## 🔐 Firebase Integration

### Client-side (Browser)
- Used in pages for authentication, real-time updates
- Located in: `lib/firebase.js`

### Server-side (API Routes)
- Used in API routes for secure database operations
- Located in: `lib/firebaseAdmin.js`

## 📚 Next Steps

1. **Implement Authentication:**
   - Update Login/Register pages to use Firebase Auth
   - Add auth context for global state

2. **Add Cart Functionality:**
   - Create a cart management system
   - Update MenuCard component

3. **Complete Forms:**
   - Connect Booking and Contact forms to Firebase
   - Add form validation

4. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

## 📦 Build & Production

```bash
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔗 Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
