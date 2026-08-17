# JAA FOODS Website

Modern FMCG food & beverage website built with React + Vite + Tailwind CSS + Firebase.

## Tech Stack
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Firestore + Auth)
- **Image Storage:** Cloudinary
- **Deployment:** Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore and Authentication (Email/Password)
3. Copy your Firebase config keys to `.env`
4. Create an admin user in Firebase Authentication
5. Add a user document in Firestore `users` collection with the user's UID as doc ID:
```json
{
  "email": "admin@jaafoods.com",
  "name": "Super Admin",
  "role": "ultra_admin"
}
```

## Cloudinary Setup
1. Create a Cloudinary account at https://cloudinary.com
2. Create an unsigned upload preset
3. Add your cloud name and preset to `.env`

## Admin Panel
- Access at `/admin/login`
- Login with your Firebase credentials
- Roles: `viewer`, `admin`, `super_admin`, `ultra_admin`

## Project Structure
```
src/
  lib/          - Firebase, Cloudinary, Firestore services
  data/         - Default product data, settings
  hooks/        - React hooks (useAuth, useProducts, etc.)
  components/   - Reusable components
    layout/     - Navbar, Footer, Layout, AdminLayout
    home/       - Home page sections
    ui/         - ProductCard, WhatsApp button, Loader
    admin/      - Admin sidebar layout
  pages/        - All pages
    admin/      - Admin panel pages
```
