# Pulse Gym

> A focused MERN administration console for running the day-to-day operations of a gym.

[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=111111)](frontend/)
[![Backend](https://img.shields.io/badge/backend-Node%20%2B%20Express-339933?logo=node.js&logoColor=white)](server/)
[![Database](https://img.shields.io/badge/database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

## Live Links

| Resource | URL |
| --- | --- |
| Backend API | [pulse-gym.onrender.com](https://pulse-gym.onrender.com) |
| API health check | [/health](https://pulse-gym.onrender.com/health) |
| Frontend | [pulse-gym-sigma.vercel.app](https://pulse-gym-sigma.vercel.app) |

The frontend calls the backend through `VITE_API_URL`. The backend accepts browser requests from the deployed frontend through `CLIENT_URL`.

Pulse Gym is a full-stack gym management application for administrators. It centralizes member records, membership plans, payments, and dashboard reporting in one authenticated web application.

## Project Planning

### Problem

Small gyms often manage members, plans, and fee payments using disconnected spreadsheets or manual records. This makes it difficult to track membership expiry, payment status, revenue, and recent registrations accurately.

### Solution

Pulse Gym provides a persistent web-based management console where authorized staff can create and maintain gym data, review payment activity, and monitor important membership statistics from a dashboard.

### Intended User

The primary user is a gym administrator or staff member who needs a quick, reliable view of memberships and fee collection without maintaining separate spreadsheets.

### Success Criteria

- A new administrator can create an account and sign in securely.
- A staff member can maintain members and plans through the interface.
- A staff member can record, edit, filter, complete, and delete payments.
- The dashboard reflects persisted MongoDB data rather than placeholder values.
- The application can run locally and be deployed as a separate Vercel frontend and Render API.

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

### Rubric Coverage

| Assignment requirement | Implementation |
| --- | --- |
| React frontend | `frontend/src/` with dashboard, members, plans, fees, and authentication screens |
| Persistent database | MongoDB Atlas through Mongoose models |
| CRUD operations | Full CRUD for members, plans, and payments |
| User registration/login | Signup and login forms with API integration |
| Secure passwords | bcrypt password hashing |
| JWT authentication | JWT issue, storage, Bearer headers, and protected API middleware |
| Deployment | Vercel frontend, Render backend, MongoDB Atlas database |
| Documentation | This README, environment examples, API tables, and verification commands |

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

## How It Works

### Administrator workflow

1. The administrator creates an account or signs in.
2. The frontend stores the JWT session and attaches it to protected API requests.
3. Plans are created before members are registered so each member can reference a plan.
4. A member receives a calculated expiry date based on the plan duration.
5. Payments are recorded against members and can be marked paid, edited, or deleted.
6. Dashboard totals are calculated from members, plans, and payment records in MongoDB.

### Data flow

```text
React UI
	-> Axios API client
	-> Express routes
	-> JWT middleware
	-> Controllers
	-> Mongoose models
	-> MongoDB Atlas
```

## Application Structure

```text
pulse-gym/
├── frontend/
│   ├── src/
│   │   ├── components/       Reusable UI components
│   │   ├── context/          Authentication state
│   │   ├── libraries/        Axios API client
│   │   ├── pages/            Dashboard and management screens
│   │   ├── App.jsx            Application shell
│   │   └── main.jsx           React entry point
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

## Database Relationships

```text
User
	(authentication account)

Plan 1 <---- many Member
Member 1 <---- many Payment
```

- A member references one membership plan through `Member.plan`.
- A payment references one member through `Payment.member`.
- `memberNameSnapshot` preserves the member name shown on a payment record.
- Active/expired member status is calculated from `expiryDate` unless an administrator sets `statusOverride`.

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

### Example Requests

Create an account:

```http
POST /api/auth/signup
Content-Type: application/json

{
	"name": "Gym Admin",
	"email": "admin@example.com",
	"password": "change-this-password"
}
```

Create a plan with a JWT:

```http
POST /api/plans
Authorization: Bearer <jwt>
Content-Type: application/json

{
	"name": "Monthly Standard",
	"price": 3000,
	"duration": "monthly",
	"description": "Full gym access"
}
```

Protected requests without a valid token return `401 Unauthorized`.

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

### Environment Variables: Which URL Goes Where?

The two URLs have different responsibilities:

| Variable | File | Value | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | `frontend/.env` | `http://localhost:5000/api` locally | Tells React where the backend API is located |
| `CLIENT_URL` | `server/.env` | `http://localhost:5173` locally | Tells Express which frontend origin CORS should allow |

For production, `VITE_API_URL` is the Render API URL and `CLIENT_URL` is the Vercel frontend URL. Never swap these values.

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
CLIENT_URL=https://pulse-gym-sigma.vercel.app
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

### Production Smoke Test

- [ ] Open the Vercel frontend without a console error.
- [ ] Create a new account through signup.
- [ ] Sign in and confirm the dashboard loads.
- [ ] Create a membership plan.
- [ ] Create, edit, filter, and delete a member.
- [ ] Create, edit, mark paid, filter, and delete a payment.
- [ ] Confirm dashboard totals change after payment updates.
- [ ] Sign out and confirm protected content is no longer accessible.

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

## Submission Checklist

- [ ] Push the latest source to the GitHub repository.
- [ ] Add the GitHub URL to the assignment submission form.
- [ ] Add the live Vercel frontend URL to the submission form and this README.
- [ ] Add the live Render API URL to the submission form.
- [ ] Confirm MongoDB Atlas network access allows the deployed backend.
- [ ] Confirm `.env` files are not committed.
- [ ] Rotate any database password or JWT secret that has been exposed.
