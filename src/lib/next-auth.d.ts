import NextAuth, { DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User  extends DefaultUser {
    displayName: string,
    mail: string,
    jobTitle:string,
    officeLocation: string,
    newAccessToken: string,
    refresh_token: string,
 
  }

  interface Session {
    user: User;
  }
  declare module "next-auth/jwt" {
    interface JWT {
      user: User,}}
}
