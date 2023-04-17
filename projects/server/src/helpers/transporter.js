const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ifritcompany@gmail.com', // Email Sender
        pass: 'bbledoaixkzaqaov' // Key Generate
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter