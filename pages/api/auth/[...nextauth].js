import User from "@/models/User";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { mongooseConnect } from "@/lib/mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await mongooseConnect();
          const user = await User.findOne({ email });

          if (!user) {
            console.log("No user found with this email.");
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            console.log("Password does not match.");
            return null;
          }

          // Log the user details fetched from the database
          console.log("User found:", {
            id: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
          });

          return {
            id: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
          };
        } catch (error) {
          console.log("Error in authorize function: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add additional user details to the JWT token
      if (user) {
        token.id = user.id;
        token.fullname = user.fullname; // Add fullname to token
        token.phoneNumber = user.phoneNumber; // Add phoneNumber to token
      }
      return token;
    },
    async session({ session, token }) {
      // Add additional user details to the session object
      if (token) {
        session.user.id = token.id;
        session.user.fullname = token.fullname; // Pass fullname from token to session
        session.user.phoneNumber = token.phoneNumber; // Pass phoneNumber from token to session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);



