const test = async () => {
    try {
        const res2 = await fetch('http://localhost:5000/api/attendance/student-list?year=2');
        const data2 = await res2.json();
        console.log('--- Year 2 Test ---');
        console.log('Count:', data2.length);
        console.log('First 2 Reg Numbers:', data2.slice(0, 2).map(s => s.registerNumber));

        const res3 = await fetch('http://localhost:5000/api/attendance/student-list?year=3');
        const data3 = await res3.json();
        console.log('\n--- Year 3 Test ---');
        console.log('Count:', data3.length);
        console.log('First 2 Reg Numbers:', data3.slice(0, 2).map(s => s.registerNumber));
    } catch (e) { console.error(e.message); }
};
test();
