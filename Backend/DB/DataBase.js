const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB:', connect.connection.host);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1); // Exit if DB connection fails
    }
};

module.export  = ConnectDB;
  