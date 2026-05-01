# MyRestaurant

Production-ready restaurant app built with Next.js App Router, Prisma/Postgres, Cloudinary, and Firebase Auth.

## Included flows

- Customer registration and login with Firebase Auth plus server session cookies
- Menu browsing with local cart persistence
- Checkout and order history
- Table reservations
- Contact form submissions
- Admin dashboard for order operations
- Rider dashboard for dispatch updates
- Prisma models for users, menu items, orders, bookings, and contact messages
- Cloudinary image delivery plus signed upload support for admin workflows

## Local development

1. Copy `.env.example` to `.env.local`
2. Set `DATABASE_URL`, Firebase env vars, and Cloudinary env vars
3. Run `pnpm install`
4. Run `pnpm db:generate`
5. Run `pnpm db:push`
6. Run `pnpm db:seed`
7. Run `pnpm dev`

## Production notes

- `next.config.js` is set to `output: 'standalone'`
- Firebase is used only for authentication
- Postgres stores app data through Prisma
- Cloudinary stores and transforms menu imagery
- Promote staff users by updating their `User.role` in Postgres to `ADMIN` or `RIDER`
