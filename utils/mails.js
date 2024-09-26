require('dotenv').config();
const nodemailer = require('nodemailer');

// Configure nodemailer transport
const gmailTransport = () => nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE_NAME,
    host: process.env.GMAIL_SERVICE_HOST,
    secure: process.env.GMAIL_SERVICE_SECURE === 'true',
    port: process.env.GMAIL_SERVICE_PORT,
    auth: {
        user: process.env.GMAIL_USER_NAME,
        pass: process.env.GMAIL_USER_PASSWORD
    }
});

// Email template for booking
const AdminOrderNotificationEmailTemplate = (line_items) => {
    return `
    <p>You have a new pending order with the following items:</p>
    <ul>
        ${line_items.map(item => `
            <li>
                <strong>${item.price_data.book_data.name}</strong>: ${item.quantity} units
            </li>
        `).join('')}
    </ul>
    <p>From Keleka Bookshop.</p>
    `;
};

const ClientPendingOrderEmailTemplate = (line_items, totalAmount) => {
    return `
    <p>Your order has been successfully placed with the following items:</p>
    <ul>
        ${line_items.map(item => `
            <li>
                <strong>${item.price_data.book_data.name}</strong>: ${item.quantity} units
            </li>
        `).join('')}
    </ul>
    <p><strong>Total Amount: Ksh ${totalAmount.toLocaleString()}</strong></p>
    <p>Your order will be delivered soon. Thank you for shopping with Keleka Bookshop!</p>
    `;
};



module.exports = {
    gmailTransport,
    AdminOrderNotificationEmailTemplate,
    ClientPendingOrderEmailTemplate,
};
