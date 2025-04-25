import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Forever" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html
        })
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email failed to send:', error.message);
    }
}

export default sendMail