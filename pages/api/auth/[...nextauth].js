import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

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

          return {
            id: user._id.toString(),
            email: user.email,
            phonenumber: user.phonenumber,
            lastname: user.lastname,
            firstname: user.firstname,
            role: user.role,
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
      if (user) {
        token.id = user.id;
        token.phonenumber = user.phonenumber;
        token.lastname = user.lastname;
        token.firstname = user.firstname;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.phonenumber = token.phonenumber;
        session.user.lastname = token.lastname;
        session.user.firstname = token.firstname;
        session.user.role = token.role;
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
