import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";
import { Order } from "@/models/Order";
import { AdminOrderNotificationEmailTemplate, ClientPendingOrderEmailTemplate, gmailTransport } from "@/utils/mails";

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Only POST requests are allowed' });
        return;
    }

    const {
        name, email, phoneNumber, county, city, street,total, paid, Mpesa,paymentMethod, cartBooks
    } = req.body;

    // Connect to the database
    await mongooseConnect();

    const booksIds = cartBooks;
    const uniqueIds = [...new Set(booksIds)];
    const booksInfo = await Book.find({ _id: uniqueIds });

    let book_items = [];
    let totalAmount = 0;
    
    for (const bookId of uniqueIds) {
        const bookInfo = booksInfo.find(p => p._id.toString() === bookId);
        const quantity = booksIds.filter(id => id === bookId)?.length || 0;
        if (quantity > 0 && bookInfo) {
            const itemPrice = bookInfo.price * quantity;
            totalAmount += itemPrice;

            book_items.push({
                quantity,
                price_data: {
                    book_data: { name: bookInfo.title },
                    unit_amount: bookInfo.price * 100,
                }
            });
        }
    }

    // Create the order document in MongoDB
    const order = await Order.create({
        book_items,
        name,
        phonenumber: phoneNumber,
        county,
        city,
        street,
        amount: total,
        paid,
        Mpesa,
        paymentMethod
    });

    // Send email to admin
    gmailTransport().sendMail({
        from: process.env.GMAIL_USER_NAME,
        to: process.env.ADMIN_EMAIL,  // Make sure to set the admin email in .env
        subject: 'New Pending Order',
        html: AdminOrderNotificationEmailTemplate(book_items),
    }, (error, info) => {
        if (error) {
            console.error('Error sending email to admin:', error);
        } else {
            console.log('Admin email sent:', info.response);
        }
    });

    // Send email to client with total amount
    gmailTransport().sendMail({
        from: process.env.GMAIL_USER_NAME,
        to: email,  // Client's email
        subject: 'Order Confirmation',
        html: ClientPendingOrderEmailTemplate(book_items, totalAmount),
    }, (error, info) => {
        if (error) {
            console.error('Error sending email to client:', error);
        } else {
            console.log('Client email sent:', info.response);
        }
    });

    // Send the created order back with success status
    res.status(200).json({ success: true, order: orderDoc });
}
