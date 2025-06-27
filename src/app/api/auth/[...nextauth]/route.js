import NextAuth from "next-auth";
import { saveUser } from "@/app/actions/saveUser";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // user object returned by the provider
    async signIn({ user, account, profile }) {
      try {
        // saving the user in the database
        const saveUserData = await saveUser(user, account.provider);
        if (saveUserData) {
          return true;
        }
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    async session({ session, token }) {
      // attach custom fields to session
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  providers: []
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
