const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const multer = require('multer');
const upload = multer();

const app = express();
const PORT = process.env.PORT || 5000;

// Resend API key
const RESEND_API_KEY = 're_RVNK7zAW_HiRDCoetHz3kSzPejTWDhP8C';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/send-email', upload.none(), async(req, res) => {
    try {
        const { email, subject, message } = req.body;

        console.log('Received email request:', { email, subject });

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'ww@ramezhany.online',
                to: email,
                subject: subject,
                html: message
            })
        });

        const data = await response.json();
        console.log('Resend API response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Email sending failed');
        }

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Email proxy server running on port ${PORT}`);
});
