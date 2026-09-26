# Smart Lost & Found System

A full-stack MERN application for reporting, searching, and managing lost and found items within a community (e.g., a college campus). Users can report items they've lost or found, search/filter existing reports, submit claim requests, and manage their own reports through a personal dashboard.

## Features

- **JWT Authentication** — secure registration and login with hashed passwords (bcrypt)
- **Lost & Found Reporting** — report items with category, location, date, and optional image upload
- **Search & Filter** — search by keyword, filter by type, category, location, and status
- **Claim Workflow** — users can claim found/lost items; reporters can approve or reject claims, with automatic conflict resolution (approving one claim auto-rejects other pending claims on the same item)
- **My Reports Dashboard** — view, edit, delete your reports, and manage claims received
- **Statistics Dashboard** — live counts of lost/found/resolved/active items and pending claims

## Tech Stack

**Frontend:** React.js (Vite), React Router, Axios, Context API
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose ODM)
**Authentication:** JWT, bcrypt
**File Uploads:** Multer

## Architecture

- RESTful API with a layered backend structure (routes → controllers → models)
- MongoDB schema design using references (not embedding) between User, Item, and Claim collections, enabling independent querying and `.populate()` for joined data
- Client-side route protection via a `ProtectedRoute` wrapper and centralized auth state via React Context
- Ownership-based authorization on the backend — every update/delete operation verifies the requester owns the resource, independent of frontend UI restrictions

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
   \`\`\`bash
   git clone <your-repo-url>
   cd smart-lost-found
   \`\`\`

2. Backend setup
   \`\`\`bash
   cd server
   npm install
   \`\`\`
   Create a `.env` file in `server/`:
   \`\`\`env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret
   CLIENT_URL=http://localhost:5173
   \`\`\`
   \`\`\`bash
   npm run dev
   \`\`\`

3. Frontend setup (in a new terminal)
   \`\`\`bash
   cd client
   npm install
   npm run dev
   \`\`\`

4. Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/me | Get current user profile | Private |
| GET | /api/items | Get all items (supports search/filter query params) | Public |
| POST | /api/items | Report a new item (with optional image) | Private |
| GET | /api/items/my-reports | Get items reported by current user | Private |
| GET | /api/items/:id | Get single item | Public |
| PUT | /api/items/:id | Update an item (owner only) | Private |
| DELETE | /api/items/:id | Delete an item (owner only) | Private |
| POST | /api/claims | Submit a claim on an item | Private |
| GET | /api/claims/my-claims | Get claims made by current user | Private |
| GET | /api/claims/received | Get claims received on current user's items | Private |
| PUT | /api/claims/:id | Approve/reject a claim (item owner only) | Private |
| GET | /api/dashboard | Get dashboard statistics | Private |

## Future Improvements

- Email notifications when a claim is received or approved
- Pagination for large item lists
- Cloudinary/S3 for image storage instead of local disk (production-ready file handling)
- Rate limiting on auth routes
- Real-time updates via WebSockets for claim status changes

## Author

Trishna
