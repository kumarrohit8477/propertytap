# Property Tap — Production V1 Real Estate Social Media Platform

Property Tap is a production-ready real-estate social discovery platform connecting property seekers directly with owners, landlords, dealers, and listers.

---

## 🚀 Key Platform Features

- **₹0 Brokerage**: Property Tap charges ₹0 brokerage on all property transactions.
- **₹0 Launch Listing Discount**: 100% launch discount enabling users to list properties free during launch.
- **Payment-Ready Architecture**: Full database schema (`payments`, `listing_plans`, `property_listings`) for 1-month, 3-month, and future paid plans.
- **Strict Contact Privacy**: Contact details (Phone & Email) remain hidden on public property cards/details and are securely exchanged via in-app Notifications upon clicking **Show Interest**.
- **Safety Guidelines**: Embedded Safety First banner and dedicated safety page warning against upfront payments without independent verification.
- **2 Application Roles Only**: `user` (can browse AND list properties) and `admin`.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Standard Pure CSS (`.css`) ONLY. No Tailwind, CSS Modules, or CSS-in-JS libraries.
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security)
- **Deployment**: Vercel (Frontend), Supabase (Database/Auth/Storage)

---

## 📐 Strict Naming & Styling Conventions

1. **File Names**: `snake_case` (e.g. `property_card.tsx`, `dashboard.css`, `property_service.ts`).
2. **Folder Names**: `snake_case` (e.g. `property_details/`, `user_profile/`).
3. **CSS Classes**: `snake_case` (e.g. `.property_card`, `.property_title`).
4. **Variables & Functions**: `snake_case` (e.g. `get_properties()`, `user_profile`).
5. **Database Identifiers**: `snake_case` (e.g. `profiles`, `user_id`, `created_at`).
6. **React Components**: `PascalCase` exported inside `snake_case` files.
7. **CSS File Requirement**: EVERY page and reusable visual component MUST have its own corresponding `.css` file.

---

## 🗄️ Database Setup Instructions

1. Log into your Supabase Dashboard.
2. Run `supabase/reset_database.sql` in the SQL Editor if you need a clean reset of application tables.
3. Execute `supabase/migrations/001_initial_schema.sql` to construct tables, enums, triggers, and Row Level Security (RLS) policies.
4. Execute `supabase/seed.sql` to populate initial property categories and listing plans.

---

## 💻 Local Development

1. Clone or navigate to the project directory:
   ```bash
   cd propertytap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Build for production verification:
   ```bash
   npm run build
   ```

---

## ☁️ Vercel Deployment

1. Connect repository to Vercel.
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!
