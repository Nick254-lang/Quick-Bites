# TODO: Next.js Migration Checklist

## Completed ✅
- [x] Next.js project structure setup
- [x] Package.json updated with Next.js dependencies
- [x] Environment variables configured (.env.local)
- [x] Firebase client config created (lib/firebase.js)
- [x] Firebase Admin SDK config created (lib/firebaseAdmin.js)
- [x] Layout and global styles created
- [x] Navbar component created with dark mode toggle
- [x] Home page migrated
- [x] Menu page migrated
- [x] Booking page migrated
- [x] Contact page migrated
- [x] Login page migrated
- [x] Register page migrated
- [x] Admin dashboard created
- [x] Rider dashboard created
- [x] API routes created for orders CRUD
- [x] Migration documentation created

## In Progress 🔄
None

## TODO - Future Implementation 📋
- [ ] Connect Login/Register to Firebase Auth
- [ ] Add Firebase Auth context for global user state
- [ ] Implement Cart functionality with localStorage
- [ ] Connect form submissions to Firestore
- [ ] Add form validation and error handling
- [ ] Payment integration (Stripe/M-Pesa)
- [ ] Real-time order updates with Firestore listeners
- [ ] Image upload functionality for menu items
- [ ] Email notifications on order status
- [ ] Deploy to Vercel/Firebase Hosting
- [ ] Set up CI/CD pipeline
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Performance optimization
- [ ] Analytics integration

## Files No Longer Needed
- [x] root-level `server.js` (reorganized under `server/index.js`)
- [x] client/pages/*.html (replaced by app/*.js pages)
- [x] client/js/*.js (reorganized under client/assets/js)
- [x] config/firebaseAdmin.js (reorganized under server/config)

## Keep
- [x] config/serviceAccountKey.json (needed for server-side Firebase access)
- [x] .env.local (for environment variables)
