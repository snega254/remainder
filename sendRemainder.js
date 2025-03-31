const nodemailer = require('nodemailer');

// Configure transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'snegak254@gmail.com',  // Replace with your Gmail
        pass: 'tgnb wqdy bdla eyoo' // Replace with your App Password
    }
});

// Function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: to,  // Receiver's email
        subject: subject,  
        text: text  
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email Sent:', info.response);
        }
    });
};

// Example usage
sendEmail('student@example.com', 'Study Reminder', 'Time to start your scheduled study session!');
