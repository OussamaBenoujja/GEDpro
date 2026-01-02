const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:3000';

async function run() {
    try {
        console.log('--- Starting AI CV Parser Test ---');

        // 1. Login as Admin
        const adminEmail = `admin_parser_${Date.now()}@example.com`;
        await axios.post(`${API_URL}/register`, {
            firstName: 'Parser',
            lastName: 'Tester',
            email: adminEmail,
            password: 'password123',
            role: 'HR',
            organizationId: 'org_test_parser'
        });

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: 'password123'
        });
        const token = loginRes.data.access_token;
        console.log('1. Logged in successfully.');

        // 2. Create a Dummy Candidate
        const candidateRes = await axios.post(`${API_URL}/candidates`, {
            firstName: 'Oussama',
            lastName: 'Benoujja',
            email: 'oussama.test@example.com',
            status: 'APPLIED',
            organizationId: 'org_test_parser'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const candidateId = candidateRes.data._id;
        console.log(`2. Created Candidate: ${candidateId}`);

        // 3. Upload CV (PDF)
        const pdfPath = path.join(__dirname, '../src/assets/Oussama_Benoujja_CV.pdf');
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`Test file not found at ${pdfPath}`);
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(pdfPath));
        form.append('candidateId', candidateId);
        form.append('organizationId', 'org_test_parser');

        console.log('3. Uploading PDF to AI Parser... (This may take 10-20s for Gemini)');
        const uploadRes = await axios.post(`${API_URL}/documents/upload`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        console.log('\n--- PARSING RESULT (Gemini 2.0) ---');
        console.log(JSON.stringify(uploadRes.data, null, 2));

        if (uploadRes.data.skills && uploadRes.data.skills.length > 0) {
            console.log('\n✅ SUCCESS: Skills extracted!');
        } else {
            console.log('\n⚠️ WARNING: No skills found.');
        }

    } catch (error) {
        console.error('\n!!! FAILED !!!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

run();
