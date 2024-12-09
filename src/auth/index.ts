import { User } from "@/lib/definitions";
import { getAzureAccessToken, getNewTokenWithScope } from "@/lib/oauth";
import axios from "axios";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
      
          if (!credentials ) {
            throw new Error("Invalid credentials");
          }


        
    // Fetch the initial access token using user credentials
    console.log(credentials.username)

    const tokenData = await getAzureAccessToken(credentials.username as string, credentials.password as string);
    const { access_token } = tokenData;

    // Fetch the user's profile from Microsoft Graph API using the access token
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(await response.data)

    // Extract the necessary data from the response
    const {jobTitle, displayName, mail, officeLocation } = await response.data;

    // Fetch a new token with the new scope
    const newTokenData = await getNewTokenWithScope(credentials.username as string, credentials.password as string);
    const { access_token: newAccessToken, refresh_token } = await newTokenData;
    console.log(newAccessToken)

    const user ={  displayName, mail,jobTitle, officeLocation,newAccessToken,refresh_token } as User
    console.log(user)
        return user
      } catch (error) {
        console.error("Authorization failed:", error);
        return null;
      }
      },
    }),
  ],
   callbacks: {
    async session({ session, token, user }:any) {
      session.user = token.user 
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Path to your custom login page
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
