import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");
        const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";

        console.log("=== ADMIN LOGIN DEBUG 2 ===");
        console.log("Email:", JSON.stringify(email));
        console.log("Email esperado:", JSON.stringify(process.env.ADMIN_EMAIL));
        console.log("Email confere:", email === process.env.ADMIN_EMAIL);
        console.log("Senha tamanho:", password.length);
        console.log("Hash tamanho:", passwordHash.length);
        console.log("Hash início:", JSON.stringify(passwordHash.slice(0, 7)));
        console.log("Hash fim:", JSON.stringify(passwordHash.slice(-7)));
        console.log("Hash bytes:", Buffer.from(passwordHash).toString("hex"));

        const validAsync = await bcrypt.compare(password, passwordHash);
const validSync = bcrypt.compareSync(password, passwordHash);

console.log("bcrypt async:", validAsync);
console.log("bcrypt sync:", validSync);
console.log("Senha recebida bytes:", Buffer.from(password).toString("hex"));
console.log("Hash bytes:", Buffer.from(passwordHash).toString("hex"));

const valid = validSync;

        console.log("bcrypt:", valid);

        if (
          !email ||
          !password ||
          email !== process.env.ADMIN_EMAIL ||
          !valid
        ) {
          console.log("RESULTADO: INVALIDO");
          return null;
        }

        console.log("RESULTADO: OK");

        return {
          id: "admin",
          email,
          name: "Administrador",
        };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub || "admin");
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
