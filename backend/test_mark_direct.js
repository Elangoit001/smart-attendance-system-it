const axios = require('axios');

const testMark = async () => {
    try {
        // 1. Login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            identifier: 'HOD001',
            password: 'HODPassword123'
        });
        const token = loginRes.data.token;
        const studentId = '69a331c77c2359b7641667fd'; // Dr. Student? No, check real student id.

        console.log('Login successful. Sending mark request...');

        // 2. Mark Attendance
        const markRes = await axios.post('http://localhost:5000/api/attendance/mark', {
            records: [
                { studentId, status: 'Present', date: '2026-03-01' }
            ]
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Response:', markRes.data);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        process.exit(1);
    }
};

testMark();
