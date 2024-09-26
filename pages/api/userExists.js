import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await mongooseConnect();
      const { email } = req.body;
      const user = await User.findOne({ email }).select("_id");
      console.log("user: ", user);
      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "An error occurred while checking user existence." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
