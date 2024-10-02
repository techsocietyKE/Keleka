import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/User";


// Function to check if user exists
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectMongoDB();
      const { email } = req.body;
      const user = await User.findOne({ email }).select("_id");
      console.log("user: ", user);
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to check user existence" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
