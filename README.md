# MyRestaurant - Full-Stack Restaurant Ordering System

A comprehensive, production-ready restaurant application built with modern web technologies. This app enables customers to browse menus, place orders, reserve tables, and purchase gift cards, while providing admin and rider dashboards for operational management.

## Features

### Customer Features
- **User Authentication**: Secure registration and login using Firebase Auth with session cookies
- **Menu Browsing**: Interactive menu with categories, pricing, and high-quality images
- **Shopping Cart**: Persistent local cart with quantity management
- **Order Placement**: Seamless checkout with delivery details and order history
- **Table Reservations**: Book tables for dine-in experiences
- **Gift Cards**: Purchase and send digital gift cards
- **Contact Form**: Submit inquiries and feedback
- **Responsive Design**: Mobile-first UI with dark/light theme support

### Admin Features
- **Order Management**: View, update, and track order statuses (pending → confirmed → out for delivery → delivered)
- **Dashboard Overview**: Real-time order pipeline and operational insights
- **Order Type Distinction**: Identifies food orders vs. gift card purchases

### Rider Features
- **Dispatch Management**: Update order statuses for delivery tracking
- **Order History**: View assigned deliveries and completion status

### Technical Features
- **Image Management**: Cloudinary integration for menu image storage and optimization
- **Database**: PostgreSQL with Prisma ORM for robust data management
- **Authentication**: Firebase Auth with server-side session validation
- **API Routes**: RESTful endpoints for all operations
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with Next.js App Router and Vercel deployment

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: CSS Modules with custom design system
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (standalone output)
- **Package Manager**: pnpm

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **PostgreSQL**: Database server (local or cloud instance)
- **Firebase Project**: For authentication
- **Cloudinary Account**: For image management

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd project-3
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
   - `FIREBASE_CLIENT_EMAIL`: Firebase service account email
   - `FIREBASE_PRIVATE_KEY`: Firebase service account private key
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Database Setup

1. **Generate Prisma client**:
   ```bash
   pnpm db:generate
   ```

2. **Push database schema**:
   ```bash
   pnpm db:push
   ```

3. **Seed the database** (optional, adds sample data):
   ```bash
   pnpm db:seed
   ```

## Running the Application

1. **Start development server**:
   ```bash
   pnpm dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### For Customers
1. **Register/Login**: Create an account or sign in
2. **Browse Menu**: View available items by category
3. **Add to Cart**: Select items and quantities
4. **Checkout**: Provide delivery details and place order
5. **Track Orders**: View order history and status
6. **Reserve Tables**: Book tables for dine-in
7. **Purchase Gift Cards**: Select value and send to recipients

### For Admins
1. **Access Dashboard**: Navigate to `/admin/dashboard`
2. **Manage Orders**: Update order statuses and view details
3. **Monitor Operations**: Track order pipeline

### For Riders
1. **Access Dashboard**: Navigate to `/rider/dashboard`
2. **Update Deliveries**: Change order status as deliveries progress

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user session
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration

### Orders
- `GET /api/orders` - List orders (filtered by user role)
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create table reservation

### Menu
- `GET /api/menu` - List menu items

### Contact
- `POST /api/contact` - Submit contact form

### Uploads
- `POST /api/uploads/signature` - Upload signature images

## Database Schema

### User
- `id`: String (Primary Key)
- `firebaseUid`: String
- `name`: String
- `email`: String
- `role`: UserRole (customer/admin/rider)
- `createdAt`: DateTime

### MenuItem
- `id`: String (Primary Key)
- `slug`: String
- `name`: String
- `description`: String
- `price`: Float
- `category`: MenuCategory
- `prepTime`: String
- `calories`: Int (Optional)
- `imagePublicId`: String
- `imageUrl`: String
- `featured`: Boolean (Optional)

### Order
- `id`: String (Primary Key)
- `userId`: String (Foreign Key to User)
- `customerName`: String
- `customerEmail`: String
- `deliveryAddress`: String
- `notes`: String (Optional)
- `total`: Float
- `status`: OrderStatus
- `createdAt`: DateTime
- `items`: OrderItem[]

### Booking
- `id`: String (Primary Key)
- `name`: String
- `email`: String
- `date`: String
- `time`: String
- `guests`: Int
- `notes`: String (Optional)
- `createdAt`: DateTime

### Contact
- `id`: String (Primary Key)
- `name`: String
- `email`: String
- `message`: String
- `createdAt`: DateTime

## Deployment

This app is configured for deployment on Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Configure all required env vars in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy using the standalone output

### Build Commands
- **Build**: `pnpm build`
- **Start**: `pnpm start`

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema
- `pnpm db:seed` - Seed database with sample data

## Project Structure

```
project-3/
├── app/                    # Next.js App Router pages
│   ├── admin/dashboard/    # Admin dashboard
│   ├── api/                # API routes
│   ├── booking/            # Table reservation page
│   ├── checkout/           # Order checkout
│   ├── contact/            # Contact form
│   ├── giftcards/          # Gift card purchase
│   ├── login/              # User login
│   ├── menu/               # Menu browsing
│   ├── orders/             # Order history
│   ├── register/           # User registration
│   └── rider/dashboard/    # Rider dashboard
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── styles/                 # Additional CSS files
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, Prisma, and Firebase**
