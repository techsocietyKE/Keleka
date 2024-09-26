import { mongooseConnect } from "@/lib/mongoose";
import Book from "@/models/Book"; // Your Book model

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const books = await Book.find();
    console.log(books) 
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to load books." });
  }
}
