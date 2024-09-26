import AxiosUtility from '@/utils/AxiosUtility';
import { accessToken } from '@/utils/generateAccessToken';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req, res) {
  const { phoneNumber, amount } = req.query;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: 'Missing Parameters'});
  }

  try {
    const token = await accessToken();

    const url = '/mpesa/stkpush/v1/processrequest';
    const auth = `Bearer ${token}`;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.BUSINESS_SHORT_CODE}bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`
    ).toString('base64');

    const data = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.BUSINESS_SHORT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.APP_URL}/api/v1/payment/mpesa/stkpush/result/`,
      AccountReference: 'Keleka Bookshop',
      TransactionDesc: 'Test',
    };

    const response = await AxiosUtility.post(url, data, {
      headers: { Authorization: auth },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
}

// Handle GET request for payment status query
export async function GET(req, res) {
  const { checkoutRequestID } = req.query;

  if (!checkoutRequestID) {
    return res.status(400).json({ error: 'Missing CheckoutRequestID' });
  }

  try {
    const token = await accessToken();
    const url = '/mpesa/stkpushquery/v1/query';
    const auth = `Bearer ${token}`;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.BUSINESS_SHORT_CODE}bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`
    ).toString('base64');

    const data = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const response = await AxiosUtility.post(url, data, {
      headers: { Authorization: auth },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'STK query failed' });
  }
}

// Default export handler for Next.js API route
export default async function handler(req, res) {
  if (req.method === 'POST') {
    return POST(req, res);
  } else if (req.method === 'GET') {
    return GET(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
