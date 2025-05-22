const { v2: cloudinary } = require('cloudinary');
// const { v4: uuidv4 } = require('uuid');

// Configure Cloudinary
try {
    cloudinary.config({
        cloud_name: 'dbqgnaqqa',
        api_key: '847761132142789',
        api_secret: 'tVRzZ6A1BR4dbt70tFj6jzHUG2Q',
        secure: true, // Ensure HTTPS URLs
        secure_distribution: null,
        private_cdn: false,
        cname: null
    });

    // Test the configuration
    cloudinary.api.ping()
        .then(() => {
            console.log('✅ Cloudinary configuration is valid');
            console.log('Cloud name: dbqgnaqqa');
            console.log('Using secure URLs: true');
        })
        .catch(err => {
            console.error('❌ Cloudinary configuration error:', err);
            console.error('Please check your Cloudinary credentials');
        });
} catch (error) {
    console.error('❌ Error configuring Cloudinary:', error);
    console.error('Please check your Cloudinary credentials');
}

module.exports = cloudinary;