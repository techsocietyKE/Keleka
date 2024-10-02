import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'GET') {
    if (req.query) {
      try {
        const bookCount = await Book.countDocuments();
        res.json({ count: bookCount });
      } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching user count." });
      }
    } else {
      return res.status(400).json({ message: "ID is required." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
