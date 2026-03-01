const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const script = 'seed_simple.js';
const logFile = 'actual_error.txt';

const child = spawn('node', [script], {
    cwd: __dirname,
    env: process.env
});

let output = '';

child.stdout.on('data', (data) => {
    output += data.toString();
});

child.stderr.on('data', (data) => {
    output += data.toString();
});

child.on('close', (code) => {
    fs.writeFileSync(logFile, `Exit Code: ${code}\n\nOutput:\n${output}`);
    console.log(`Finished with code ${code}. Log written to ${logFile}`);
});
