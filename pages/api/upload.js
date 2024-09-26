import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handle(req, res) {
  await mongooseConnect()
  await isAdminRequest(req, res);
    const form = new multiparty.Form();
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ files });
      });
    });
  
    const uploadPromises = files.file.map(async file => {
      const { path: filePath } = file;
      const result = await cloudinary.uploader.upload(filePath);
      return result.secure_url;
    });
  
    try {
      const uploadedImages = await Promise.all(uploadPromises);
      console.log('Uploaded images:', uploadedImages);
      res.status(200).json(uploadedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ error: 'Error uploading images' });
    }
  }
  

export const config = {
  api: { bodyParser: false }
};
