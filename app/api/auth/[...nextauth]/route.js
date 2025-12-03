import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import mongoose from "mongoose";
import User from "@/models/User";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI);
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },

    async signIn({ user }) {

      return true;
      // try {
      //   await connectDB();
      //   let currentUser = await User.findOne({ email: user.email });

      //   if (!currentUser) {
      //     currentUser = await User.create({
      //       email: user.email,
      //       username: user.name || user.email.split("@")[0],
      //       profilePic: user.image || "",
      //     });
      //   }

      //   return true; // Must return true for login to succeed
      // } catch (err) {
      //   console.error("SignIn error:", err);
      //   return false; // Returning false denies login
      // }
    },


    async session({ session }) {
      try {
        await connectDB();

        const dbUser = await User.findOne({ email: session.user.email });

        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.name = dbUser.username;
          session.user.image = dbUser.profilePic || session.user.image;
        }

        return session;
      } catch (err) {
        console.error("Session error:", err);
        return session;
      }
    },
  },

  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
