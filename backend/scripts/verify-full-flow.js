const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:3000';

async function run() {
    try {
        console.log('--- STARTING API VERIFICATION ---');

        // 1. Register User
        const email = `admin_${Date.now()}@example.com`;
        console.log(`\n1. Registering user: ${email}`);
        await axios.post(`${API_URL}/register`, {
            firstName: 'Admin',
            lastName: 'User',
            email: email,
            password: 'password123',
            role: 'ADMIN',
            organizationId: 'org_test_1'
        });
        console.log('   SUCCESS: User registered');

        // 2. Login
        console.log('\n2. Logging in');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: 'password123'
        });
        const token = loginRes.data.access_token;
        console.log('   SUCCESS: Login successful, token received');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 3. Candidates: Create
        console.log('\n3. Creating Candidate');
        const candidateRes = await axios.post(`${API_URL}/candidates`, {
            firstName: 'John',
            lastName: 'Doe',
            email: `john_${Date.now()}@example.com`,
            skills: ['Node.js', 'React']
        }, authHeaders);
        const candidateId = candidateRes.data._id;
        console.log(`   SUCCESS: Candidate created (ID: ${candidateId})`);

        // 4. Forms: Create
        console.log('\n4. Creating HR Form');
        const formRes = await axios.post(`${API_URL}/forms`, {
            title: 'Recruitment Form',
            description: 'Standard Tech Interview',
            fields: [{ label: 'Score', type: 'NUMBER', required: true }]
        }, authHeaders);
        const formId = formRes.data._id;
        console.log(`   SUCCESS: Form created (ID: ${formId})`);

        // 5. Interviews: Schedule
        console.log('\n5. Scheduling Interview');
        const interviewRes = await axios.post(`${API_URL}/interviews`, {
            title: 'Tech Screen',
            candidateId: candidateId,
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
            participants: ['interviewer@example.com']
        }, authHeaders);
        console.log(`   SUCCESS: Interview scheduled (ID: ${interviewRes.data._id})`);

        // 6. Documents: Upload
        console.log('\n6. Uploading Document');
        // Create dummy file
        fs.writeFileSync('test_cv.txt', 'This is a CV for John Doe with Node.js skills.');
        const form = new FormData();
        form.append('file', fs.createReadStream('test_cv.txt'));
        form.append('candidateId', candidateId);

        const docRes = await axios.post(`${API_URL}/documents/upload`, form, {
            headers: {
                ...authHeaders.headers,
                ...form.getHeaders()
            }
        });
        console.log(`   SUCCESS: Document uploaded (ID: ${docRes.data._id})`);
        console.log(`   -- Extracted Text Snippet: "${docRes.data.extractedText || 'N/A'}"`);

        // Cleanup
        fs.unlinkSync('test_cv.txt');

        console.log('\n--- VERIFICATION COMPLETE: ALL SYSTEMS GO ---');

    } catch (error) {
        console.error('\n!!! VERIFICATION FAILED !!!');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

run();
