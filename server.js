const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());  // Allow requests from different origins

// 📌 Fetch Motivational Quote (Education & Career)
async function getMotivationalQuote() {
    try {
        const response = await axios.get('https://api.quotable.io/random?tags=education|success|career');
        return `"${response.data.content}" – ${response.data.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return '"Education is the passport to the future." – Malcolm X';
    }
}

// 📌 Configure Mail Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// 📌 Send Email
const sendEmail = async (to, subject, name, subjectStudy, date, time) => {
    const quote = await getMotivationalQuote();

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: `Hey ${name}!\n\nIt's time to study **${subjectStudy}** as per your schedule.\n📅 Date: ${date}\n⏰ Time: ${time}\n\n${quote}\n\nHappy learning! 📖😊\n- Study Buddy 🤖`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            return { success: false, message: 'Failed to send email' };
        } else {
            console.log('✅ Email Sent:', info.response);
            return { success: true, message: 'Email sent successfully' };
        }
    });
};

// 📌 API Endpoint to Send Reminder
app.post('/send-reminder', async (req, res) => {
    const { email, studentName, subjectStudy, date, time } = req.body;

    if (!email || !studentName || !subjectStudy || !date || !time) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const response = await sendEmail(email, '⏰ Study Reminder!', studentName, subjectStudy, date, time);
    res.json(response);
});

// 📌 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
