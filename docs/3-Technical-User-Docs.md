# Technical & User Documentation

## 1. Technical Stack Overview

ReliableToolHub is built using a modern, scalable web development stack:

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS & PostCSS
- **Component Library:** Shadcn UI (accessible, customizable components)
- **Animations:** Framer Motion
- **State Management:** Zustand & SWR (for data fetching)
- **PWA Support:** Serwist

### Backend & Database

- **Platform:** Supabase (BaaS)
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth (Email & Google OAuth)
- **Storage:** Supabase Storage (for tool images and user avatars)
- **Security:** Row Level Security (RLS) ensuring strict access control at the database layer.

### Infrastructure & Deployment

- **Hosting:** Vercel (Optimized for Next.js)
- **Version Control:** GitHub

---

## 2. Environment Setup & Getting Started

To run the project locally or set up a new environment:

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm
- A Supabase project
- A Vercel account (for deployment)

### Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Sushil25742/reliabletoolhub.git
    cd reliabletoolhub
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory based on `.env.example`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
    ```
4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:3000`.

---

## 3. Architecture & Core Concepts

### Authentication Flow

The application uses `@supabase/ssr` to securely handle authentication state across the Next.js server (Server Components) and client (Client Components). Session cookies are securely managed via middleware (`middleware.ts`).

### Database Schema (High-Level)

- `profiles`: Stores user information linked to Supabase Auth.
- `tools`: Information about available premium tools (name, description, pricing).
- `orders`: Tracks user orders.
- `tickets`: Support ticketing system for users.
- `reviews`: User reviews for specific tools.

### Security (Supabase RLS)

Row Level Security (RLS) is heavily enforced. For example:

- Users can only read and update their own `profiles`.
- Users can only view their own `orders` and `tickets`.
- `tools` and `reviews` are readable by anyone (anon/authenticated) but only modifiable by admins (service role).
  A dedicated `supabase_rls_security_audit.sql` script is available to audit these rules.

---

## 4. User Documentation (Handover / Guide)

### For Customers

- **Discovering Tools:** Navigate to the homepage or the "Tools" section to browse the catalog. Use the search bar to find specific items.
- **Account Creation:** Click "Sign In" to create an account via Email or your Google account.
- **Making a Purchase:**
  1.  Select a tool and navigate to its details page.
  2.  Click "Buy Now" or "Add to Cart".
  3.  Proceed to checkout, which will direct you to a WhatsApp chat with the ReliableToolHub support number, pre-filled with your order details.
  4.  Complete the payment and verification via WhatsApp with the admin.
- **Managing Subscriptions & Orders:** Go to your **Dashboard** to view active subscriptions, past orders, and your wishlist.
- **Getting Support:** From the Dashboard, navigate to the "Support" or "Tickets" tab to open a new support request.

### For Administrators / Maintainers

- **Order Fulfillment:** Since checkout is currently manual via WhatsApp, administrators must verify payments and manually provision access to the requested tools for the customer.
- **Database Management:** Use the Supabase Dashboard to manage tool listings, categories, and user data. Ensure that any manual database updates respect existing foreign key constraints.
- **Deploying Updates:** Push code changes to the `main` branch on GitHub. If Vercel is connected, it will automatically trigger a new deployment. Ensure environment variables are correctly set in the Vercel project settings.
- **Scripts:** Use the provided scripts in the `scripts/` directory (e.g., `test-db.js`, `run-migration.sh`) to manage and verify database integrity during development.
