const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function run() {
    try {
        // 1. Register/Login as Admin to get Token
        const adminEmail = `admin_tester_${Date.now()}@example.com`;
        console.log(`\n1. Registering Admin: ${adminEmail}`);

        // Register
        await axios.post(`${API_URL}/register`, {
            firstName: 'Sarah',
            lastName: 'Recruiter',
            email: adminEmail,
            password: 'password123',
            role: 'HR',
            organizationId: 'org_tech_corp'
        });

        // Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: 'password123'
        });
        const token = loginRes.data.access_token;
        console.log('   Logged in successfully.');

        // 2. Schedule Interview
        console.log('\n2. Scheduling Interview with Professional Data...');

        // Calculate a time 2 days from now at 10 AM
        const startTime = new Date();
        startTime.setDate(startTime.getDate() + 2);
        startTime.setHours(10, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(11, 30, 0, 0); // 1.5 hours

        const interviewData = {
            candidateId: 'candidate_5582',
            organizationId: 'org_tech_corp',
            title: 'Senior Full Stack Engineer Interview - Round 2',
            description: `Dear Candidate,

We are excited to invite you to the technical assessment for the Senior Full Stack Engineer position at TechCorp Solutions.

Agenda:
1. System Design Discussion: Scalable Microservices (45 mins)
2. Live Coding Challenge: Algorithm & Data Structures (45 mins)

Please ensure you are in a quiet environment with a stable internet connection.
We look forward to meeting you!

Best regards,
Sarah Recruiter
TechCorp Solutions`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            participants: [
                'oussamabnj2002@gmail.com'
            ]
        };

        const inviteRes = await axios.post(`${API_URL}/interviews`, interviewData, {
            headers: { Authorization: `Bearer ${token}` }
        });


        console.log('\n!!! SUCCESS !!!');
        console.log('Interview Object Created:', inviteRes.data);
        console.log(`\nCheck the inboxes of: ${interviewData.participants.join(', ')}`);


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
