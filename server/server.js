require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const memberRoutes = require('./routes/memberRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [
	'http://localhost:5173',
	'https://pulse-gym-sigma.vercel.app',
	...(process.env.CLIENT_URL || '').split(',').map((origin) => origin.trim()).filter(Boolean),
];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error('Origin is not allowed by CORS'));
	},
}));
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});