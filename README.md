# HomeSphere 🌍 (Full Project Documentation)

HomeSphere is a modern, full-stack web application designed for booking and hosting properties. It serves as a comprehensive clone of top-tier lodging platforms, emphasizing strict validation, deep user-role relationships, and robust reservation algorithms.

This detailed documentation outlines the complete functionality of the website and breaks down the core modules operating under the hood.

---

## 🏗️ Core Modules & Functionality Breakdown

### 1. The Authentication & RBAC Module
HomeSphere implements a strict **Role-Based Access Control (RBAC)** architecture. Upon registration, users are assigned a role of either `guest`, `host`, or `admin`. 
- **JSON Web Tokens (JWT)**: Login/Registration provides the client with an encrypted JWT valid for 1 hour. This token verifies the identity and role on all subsequent API requests.
- **Frontend Interceptor**: A custom `axiosConfig.js` interceptor constantly listens to incoming API responses. If it detects a `401 Unauthorized` (expired token), it instantly wipes the local storage and reroutes the user to the login screen securely.
- **Protected Routes**: The React frontend uses a custom `<ProtectedRoute />` wrapper ensuring users cannot URL-hop into Dashboards that don't belong to their role.

### 2. The Booking & Reservation Engine
The booking engine handles complex date math and conflict prevention to ensure reliable reservations.
- **Dynamic Price Calculator**: In the frontend, selecting check-in and checkout dates via `react-datepicker` triggers live state changes that calculate `(Days * Nightly Rate) + 10% Platform Fee`, rendering total costs before the user clicks reserve.
- **Database Conflict Checking**: When a booking is submitted, the `bookingController` queries MongoDB for any existing `pending` or `confirmed` bookings that overlap with the requested dates via `$lt` and `$gt` interval overlap operators. If a conflict exists, the payload is rejected.
- **GUI Date Blocking**: A dedicated API endpoint fetches the timeline of unavailable dates for a specific property. The React UI converts this JSON array into disabled intervals on the booking calendar, providing immediate visual feedback.

### 3. The Interactive Dashboard Module
The platform morphs depending on who logs in, generating deeply customized dashboard tools for the active user:
- **Guest Dashboard ("Your Trips")**: Displays a history of homes booked. Shows total cost, date ranges, and a unique color-coded status badge (`Pending`, `Confirmed`, `Cancelled`). Guests have the specific privilege to hit `Cancel`, which issues a PUT request to update the status.
- **Host Dashboard ("Your Bookings")**: Displays an aggregate list of reservations requested by guests across *all* properties owned by this host. Instead of cancelling, hosts have specialized `Accept` and `Reject` action buttons.
- **Admin Dashboard**: Located at `/admin` (accessible only to those with an Admin JWT), this superuser GUI features tabular navigation. Admins can view all users and alter their roles via dropdowns, forcefully delete malicious listings, and cancel any booking on the platform.

### 4. Advanced Search & Query Processing Module
The homepage features a dynamic, multi-parameter search engine.
- **Visual Filters**: Users can select high-level visual categories (🏖️ Beach House, 🏰 Villa, etc.) that instantly trigger an asynchronous database filter using Mongoose's exact-match querying.
- **Parametric Query Builder**: The Advanced Search bar captures states for `location`, `minPrice`, `maxPrice`, and `guests`. The frontend converts these into a URL Search Param string (`/api/listings?location=Miami&minPrice=100...`). The backend `listingController` digests this query string and builds a MongoDB query object leveraging operators like `$gte` (Greater Than or Equal) and RegExp for wildcard location matching.

### 5. Review & Rating Ecosystem
A fully integrated, two-way relationship between Users and Listings.
- **Posting Reviews**: Only authenticated users who do *not* own the property can submit a review with a 1-5 star rating and comment text.
- **Aggregation**: Upon fetching property details, a secondary hook automatically fetches the `Review` collection matching the `listingId`. It populates the review author names and avatars and maps them sequentially on the property details page.

### 6. Media & File Handling Module
- **Multer Middleware**: The backend features a dedicated `/api/uploads` route managed by `multer.js`. 
- **Validation Constraints**: Multer intercepts raw `FormData`, strictly validating that the file extension matches Image patterns (`jpg|jpeg|png|webp`) and ensuring individual files do not easily exceed 5 Megabytes, mitigating memory bloat risks. Valid files are then moved into a native static `/uploads` storage directory.

---

## 🔒 Security Infrastructure

HomeSphere was designed with production-grade security precautions in mind:
1. **DDoS Mitigation**: `express-rate-limit` brackets the `/login` route, dropping requests from the same IP origin if they exceed 5 attempts in 15 minutes to counter brute-force scraping scripts.
2. **HTTP Header Hardening**: Integrated `helmet.js` natively rewrites incoming packet headers to obscure server origins and enable strict cross-origin policies.
3. **Password Salting**: Backed by `bcryptjs`, plain text passwords are mathematically hashed before ever touching the NoSQL instance.

---

## 💻 Technical Stack Overview

**Client (Frontend):** 
- **React.js** (Built with **Vite** for optimized HMR and bundling)
- **Tailwind CSS** (Utility-first styling system)
- **Axios** (Configured as an instance for global interception)
- **React-Router-DOM** (For SPA DOM manipulation)
- **Leaflet / React-Leaflet** (For geographic map rendering)
- **Lucide-React** (Lightweight scalable SVG icons)

**Server (Backend):**
- **Node.js** with **Express.js** 
- **MongoDB** / **Mongoose ODM**
- **JSON Web Token** (Authentication headers)
- **Bcryptjs** (Cryptography)
- **Multer** (File handling engine)
