const testLogin = async () => {
    try {
        console.log('Testing login for HOD001...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'HOD001', password: 'HODPassword123' })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Login Success:', data.user.name);
        } else {
            console.log('Login Failed (Admin):', data.message);
        }
    } catch (err) {
        console.error('Network Error:', err.message);
    }

    try {
        console.log('Testing login for 22IT002...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: '22IT002', password: 'Student 202' })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Login Success:', data.user.name);
        } else {
            console.log('Login Failed (Student):', data.message);
        }
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

testLogin();
