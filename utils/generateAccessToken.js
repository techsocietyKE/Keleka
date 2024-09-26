
import dotenv from 'dotenv';
import AxiosUtility from './AxiosUtility';

dotenv.config();

export const accessToken = async () => {
    const url = "/oauth/v1/generate?grant_type=client_credentials";
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64");

    try {
        const response = await AxiosUtility.get(url, {
            headers: {
                "Authorization": `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Failed to generate access token:", error);
        throw new Error("Unable to generate access token");
    }
};
