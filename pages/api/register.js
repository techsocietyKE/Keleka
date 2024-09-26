import bcrypt from "bcryptjs";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User"; // Ensure the casing is consistent

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body; // Use req.body instead of req.json() in Node.js runtime
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Connect to MongoDB and create the user
      await mongooseConnect();
      const user = await User.create({ email, password: hashedPassword });
      
      // Return the success response
      return res.status(201).json({ message: "User registered." });
    } catch (error) {
      // Return the error response
      return res.status(500).json({
        message: "An error occurred while registering the user.",
      });
    }
  } else {
    // Return a 405 if the method is not POST
    return res.status(405).json({ message: "Method not allowed" });
  }
}
