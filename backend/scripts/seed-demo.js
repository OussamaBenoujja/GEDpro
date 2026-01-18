const axios = require('axios');
const API_URL = 'http://localhost:3001';

async function seed() {
    const demoPayload = {
        companyName: 'GEDPro Demo Corp',
        firstName: 'Demo',
        lastName: 'Admin',
        email: 'demo@gedpro.com',
        password: 'password123'
    };

    console.log(`Attempting to seed company & user: ${demoPayload.email}`);

    try {
        await axios.post(`${API_URL}/register/company`, demoPayload);
        console.log('SUCCESS: Company and Account created successfully.');
        console.log(`Email: ${demoPayload.email}`);
        console.log(`Password: ${demoPayload.password}`);
    } catch (error) {
        // If conflict (409), user likely exists.
        if (error.response && (error.response.status === 409 || error.response.status === 400)) {
            console.log('User or Company might already exist. Testing login...');
            try {
                await axios.post(`${API_URL}/auth/login`, {
                    email: demoPayload.email,
                    password: demoPayload.password
                });
                console.log('SUCCESS: Existing account verified with current password.');
                console.log(`Email: ${demoPayload.email}`);
                console.log(`Password: ${demoPayload.password}`);
            } catch (loginError) {
                console.error('ERROR: User exists but password mismatch or other login error.');
                console.error(loginError.response ? loginError.response.data : loginError.message);
            }
        } else {
            console.error('ERROR: Failed to create user/company.');
            console.error(error.response ? error.response.data : error.message);
        }
    }
}

seed();
