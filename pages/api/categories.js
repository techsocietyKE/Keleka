import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";


export default async function handler(req, res) {
  try {
    await mongooseConnect();
    
    const { genre } = req.query;
    const query = genre ? { genre } : {}; 
    
    const books = await Book.find(query);
    res.status(200).json(books);
    console.log(books)
  } catch (error) {
    res.status(500).json({ message: "Failed to load books." });
    console.log(error)
  }
}
