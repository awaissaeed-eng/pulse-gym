# Pulse Gym

Pulse Gym is a full-stack gym management application for administrators. It centralizes member records, membership plans, payments, and dashboard reporting in one authenticated web application.

## Project Planning

### Problem

Small gyms often manage members, plans, and fee payments using disconnected spreadsheets or manual records. This makes it difficult to track membership expiry, payment status, revenue, and recent registrations accurately.

### Solution

Pulse Gym provides a persistent web-based management console where authorized staff can create and maintain gym data, review payment activity, and monitor important membership statistics from a dashboard.

### Main Features

- User registration and login
- Bcrypt password hashing
- JWT-based authentication
- Protected API routes and authenticated dashboard access
- Member management with create, read, update, and delete operations
- Member search and active/expired status filtering
- Membership plan management with full CRUD operations
- Payment management with create, read, update, delete, filtering, and mark-as-paid actions
- Automatic membership expiry-date calculation from the selected plan
- Dashboard statistics for members, active members, revenue, and pending fees
- Responsive desktop and mobile interface
- MongoDB persistence through Mongoose

## Technologies Used

### Frontend

- React
- Vite
- Axios
- React DOM
- CSS and responsive utility classes

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv

## Application Structure

```text
pulse-gym/
├── frontend/
│   ├── src/
│   │   ├── components/       Reusable UI components
│   │   ├── context/          Authentication state
│   │   ├── libraries/        Axios API client
│   │   └── pages/            Dashboard and management screens
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── config/               Database connection
│   ├── controllers/          Request handlers
│   ├── middleware/           JWT and error middleware
│   ├── models/               Mongoose schemas
│   ├── routes/               Express API routes
│   └── server.js
└── README.md
```

## Database Design

The application uses MongoDB Atlas with four Mongoose models.

### User

- `name`
- `email`
- `passwordHash`
- `createdAt` and `updatedAt`

Passwords are never stored as plain text. The server stores bcrypt hashes.

### Plan

- `name`
- `price`
- `duration`: monthly, quarterly, or yearly
- `description`
- `isActive`
- timestamps

### Member

- `name`
- `phone`
- `email`
- `plan`: reference to a Plan
- `joinDate`
- `expiryDate`
- `statusOverride`
- timestamps

The expiry date is calculated from the join date and selected plan duration.

### Payment

- `member`: reference to a Member
- `memberNameSnapshot`
- `amount`
- `date`
- `periodCovered`
- `status`: paid or pending
- timestamps

## API Documentation

The backend runs under the `/api` prefix.

### Authentication

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Create a user account | No |
| `POST` | `/api/auth/login` | Authenticate and return a JWT | No |
| `GET` | `/api/auth/me` | Return the current user | JWT |

### Members

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/members` | List members; supports `search` and `status` query filters | JWT |
| `GET` | `/api/members/:id` | Get one member | JWT |
| `POST` | `/api/members` | Create a member | JWT |
| `PUT` | `/api/members/:id` | Update a member | JWT |
| `PUT` | `/api/members/:id/status` | Change status override | JWT |
| `DELETE` | `/api/members/:id` | Delete a member | JWT |

### Plans

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/plans` | List plans | JWT |
| `POST` | `/api/plans` | Create a plan | JWT |
| `PUT` | `/api/plans/:id` | Update a plan | JWT |
| `DELETE` | `/api/plans/:id` | Delete a plan | JWT |

### Payments

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/payments` | List payments; supports `status` filtering | JWT |
| `POST` | `/api/payments` | Create a payment | JWT |
| `PUT` | `/api/payments/:id` | Update a payment | JWT |
| `PATCH` | `/api/payments/:id/mark-paid` | Mark a payment as paid | JWT |
| `DELETE` | `/api/payments/:id` | Delete a payment | JWT |

### Dashboard

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/dashboard/stats` | Return dashboard statistics and recent members | JWT |

### Health Check

```text
GET /health
```

Returns a simple success response for deployment monitoring:

```json
{"status":"ok"}
```

## Local Setup

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB Atlas database

### 1. Clone the repository

```bash
git clone https://github.com/awaissaeed-eng/pulse-gym.git
cd pulse-gym
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create `server/.env` using `server/.env.example`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pulse-gym?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API is available at `http://localhost:5000`.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` using `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend is available at the local Vite URL shown in the terminal, normally `http://localhost:5173`.

## Authentication Flow

1. A user submits the signup form.
2. The server validates the fields and hashes the password with bcrypt.
3. A user logs in with the registered email and password.
4. The server returns a JWT valid for seven days.
5. The frontend stores the session token and attaches it as a Bearer token to API requests.
6. Protected routes reject missing, invalid, or expired tokens.
7. Logout clears the client-side token and user session.

## Deployment

The application is designed for separate deployment:

- Frontend: Vercel
- Backend/API: Render
- Database: MongoDB Atlas

### Live Deployment

- Backend/API: https://pulse-gym.onrender.com
- Backend health check: https://pulse-gym.onrender.com/health
- Frontend: Add the deployed Vercel URL here after confirming it.

### MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user.
2. Add the deployment service to Atlas Network Access.
3. Copy the Atlas connection string into the backend `MONGO_URI` variable.
4. Do not commit `.env` files or database credentials.

### Render Backend

Create a Render Web Service connected to this repository:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Set these Render environment variables:

```env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-secret
CLIENT_URL=https://your-frontend.vercel.app
PORT=10000
```

### Vercel Frontend

Create a Vercel project connected to this repository:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this Vercel environment variable:

```env
VITE_API_URL=https://pulse-gym.onrender.com/api
```

After deployment, verify:

```text
https://pulse-gym.onrender.com/health
```

Then test signup, login, member CRUD, plan CRUD, payment CRUD, and logout through the live frontend.

## Verification Commands

Frontend production build and lint:

```bash
cd frontend
npm run build
npm run lint
```

Backend syntax checks:

```bash
cd server
node --check server.js
node --check controllers/authController.js
node --check controllers/paymentController.js
```

## Security Notes

- Never commit `.env` files.
- Use a unique production `JWT_SECRET`.
- Rotate credentials if they are accidentally exposed.
- Restrict MongoDB Atlas network access where possible.
- Passwords are stored only as bcrypt hashes.
