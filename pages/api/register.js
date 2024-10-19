import bcrypt from "bcryptjs";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password,fullname,phoneNumber,role } = req.body; 
      const hashedPassword = await bcrypt.hash(password, 10);
      await mongooseConnect();
      const user = await User.create({ email, password: hashedPassword,fullname,phoneNumber,role });

      return res.status(201).json({ message: "User registered." });
    } catch (error) {

      return res.status(500).json({
        message: "An error occurred while registering the user.",
      });
    }
  } else {

    return res.status(405).json({ message: "Method not allowed" });
  }
}
