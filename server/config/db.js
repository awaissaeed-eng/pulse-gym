const mongoose = require('mongoose')

const connectDB = async () => {
    while (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log('MongoDB connected');
        } catch (err) {
            console.error('MongoDB connection failed:', err.message);
            console.error('Retrying MongoDB connection in 5 seconds...');
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

module.exports = connectDB;
