const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'users.json');
const tokensFilePath = path.join(__dirname, 'tokens.json');

app.use(bodyParser.json());
app.use(express.static('public'));

function readFileSync(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return {};
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return data ? JSON.parse(data) : {};
    } catch (err) {
        console.error(`Error reading or parsing file ${filePath}:`, err);
        return {};
    }
}

function writeFileSync(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bekzat051102@gmail.com', // replace with your email
        pass: 'beka zamirbek uulu' // replace with your email password or app-specific password
    }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const users = readFileSync(usersFilePath);

    if (users[email]) {
        return res.json({ success: false, message: 'Email already registered.' });
    }

    const newUser = { name, email, password, address: '', phone: '' };
    users[email] = newUser;
    writeFileSync(usersFilePath, users);
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readFileSync(usersFilePath);

    const user = users[email];

    if (user && user.password === password) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Invalid email or password.' });
    }
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const users = readFileSync(usersFilePath);

    const user = users[email];

    if (user) {
        const token = generateResetToken();
        const tokens = readFileSync(tokensFilePath);
        tokens[token] = email;
        writeFileSync(tokensFilePath, tokens);

        const mailOptions = {
            from: 'bekzat051102@gmail.com', // replace with your email
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: http://localhost:3000/reset-password.html?token=${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.json({ success: false, message: 'Error sending email.' });
            } else {
                console.log('Email sent:', info.response);
                res.json({ success: true, message: 'Password reset link sent to your email.' });
            }
        });
    } else {
        res.json({ success: false, message: 'Email not found.' });
    }
});

app.post('/reset-password', (req, res) => {
    const { token, password } = req.body;
    const tokens = readFileSync(tokensFilePath);

    const email = tokens[token];
    if (!email) {
        return res.json({ success: false, message: 'Invalid or expired token.' });
    }

    const users = readFileSync(usersFilePath);
    const user = users[email];

    if (user) {
        user.password = password;
        writeFileSync(usersFilePath, users);
        delete tokens[token];
        writeFileSync(tokensFilePath, tokens);
        res.json({ success: true, message: 'Password has been reset.' });
    } else {
        res.json({ success: false, message: 'User not found.' });
    }
});

app.post('/profile', (req, res) => {
    const { name, address, phone, email } = req.body;
    const users = readFileSync(usersFilePath);

    const user = users[email];

    if (user) {
        user.name = name;
        user.address = address;
        user.phone = phone;
        writeFileSync(usersFilePath, users);
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'User not found.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});