const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elangopoomi@gmail.com',
        pass: 'ofej zxjr mnkq gojj'
    }
});

const sendLeaveEmail = async (studentName, registerNumber, type, reason, startDate, endDate, leaveId) => {
    const apiBase = 'https://beige-books-tease.loca.lt/api/leave/direct';

    const mailOptions = {
        from: 'elangopoomi@gmail.com',
        to: 'elangopoomi@gmail.com',
        subject: `[ACTION REQUIRED] ${type} from ${studentName} (${registerNumber})`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="display: inline-block; padding: 10px 20px; background: #eff6ff; border-radius: 10px; color: #3b82f6; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                        New Leave Application
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Student</td><td style="color: #1e293b; font-weight: 700;">${studentName}</td></tr>
                        <tr><td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Register No</td><td style="color: #1e293b; font-weight: 500;">${registerNumber}</td></tr>
                        <tr><td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Request Type</td><td style="color: #3b82f6; font-weight: 800;">${type}</td></tr>
                        <tr><td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Duration</td><td style="color: #1e293b;">${startDate} to ${endDate}</td></tr>
                        <tr><td style="padding: 20px 0 10px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;" colspan="2">Reasoning</td></tr>
                        <tr><td style="color: #475569; font-style: italic; line-height: 1.6;" colspan="2">"${reason}"</td></tr>
                    </table>
                </div>

                <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 25px;">
                    <a href="${apiBase}/${leaveId}/Approved" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);">APPROVE</a>
                    &nbsp;&nbsp;
                    <a href="${apiBase}/${leaveId}/Rejected" style="display: inline-block; background: #f43f5e; color: white; padding: 15px 35px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 10px rgba(244, 63, 94, 0.25);">REJECT</a>
                </div>

                <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 25px;">
                    <p style="color: #94a3b8; font-size: 11px;">Powered by Smart Dept Management System</p>
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
