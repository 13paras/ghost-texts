import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// this functionas should always be handler, it is defined in
const handler = NextAuth(authOptions);

// these files only work like this
export { handler as GET, handler as POST };

