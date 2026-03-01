const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elangopoomi@gmail.com',
        pass: 'YOUR_GMAIL_APP_PASSWORD' // User must replace this
    }
});

const sendLeaveEmail = async (studentName, registerNumber, type, reason, startDate, endDate) => {
    const mailOptions = {
        from: 'elangopoomi@gmail.com',
        to: 'elangopoomi@gmail.com',
        subject: `[LEAVE REQUEST] ${type} from ${studentName} (${registerNumber})`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #3b82f6;">New ${type} Application</h2>
                <p>A student has submitted a new ${type.toLowerCase()} request for your approval.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <table style="width: 100%;">
                    <tr><td style="font-weight: bold; width: 150px;">Student Name:</td><td>${studentName}</td></tr>
                    <tr><td style="font-weight: bold;">Register No:</td><td>${registerNumber}</td></tr>
                    <tr><td style="font-weight: bold;">Type:</td><td>${type}</td></tr>
                    <tr><td style="font-weight: bold;">Reason:</td><td>${reason}</td></tr>
                    <tr><td style="font-weight: bold;">Start Date:</td><td>${startDate}</td></tr>
                    <tr><td style="font-weight: bold;">End Date:</td><td>${endDate}</td></tr>
                </table>
                <div style="margin-top: 30px;">
                    <a href="http://localhost:3000/admin/leaves" style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Approve</a>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('--- EMAIL SENT TO HOD SUCCESSFULLY ---');
    } catch (error) {
        console.error('--- EMAIL FAILED TO SEND ---', error.message);
    }
};

module.exports = { sendLeaveEmail };
