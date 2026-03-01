const testMark = async () => {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'HOD001', password: 'HODPassword123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        const studentId = '69a331c77c2359b7641667fd';

        console.log('Login successful. Sending mark request for 22IT001...');

        const markRes = await fetch('http://localhost:5000/api/attendance/mark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                records: [
                    { studentId, status: 'Present', date: '2026-03-01' }
                ]
            })
        });

        const markData = await markRes.json();
        console.log('Response Status:', markRes.status);
        console.log('Response Body:', markData);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

testMark();
