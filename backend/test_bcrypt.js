const bcrypt = require('bcryptjs');

const test = async () => {
    try {
        console.log('Testing bcrypt hashing...');
        const pass = 'password123';
        const hash = await bcrypt.hash(pass, 10);
        console.log('Hash result:', hash);
        const match = await bcrypt.compare(pass, hash);
        console.log('Match result:', match);
        process.exit(0);
    } catch (err) {
        console.error('--- BCRYPT FAILED ---');
        console.error(err);
        process.exit(1);
    }
}

test();
