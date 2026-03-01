const testByDate = async () => {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'HOD001', password: 'HODPassword123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        const res = await fetch('http://localhost:5000/api/attendance/by-date/2026-03-01', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log('--- BY DATE ---');
        console.log(JSON.stringify(data[0], null, 2));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};
testByDate();
