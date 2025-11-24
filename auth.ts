import { createManyChatsWithOthers } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
// import { encode as defaultEncode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import process from "process";
import { UserType } from "./app/generated/prisma";
// import { v4 as uuid } from "uuid";

// TODO: Change to database session strategy
// TODO: Fix JWT signing secret for Supabase

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password!
        );

        return passwordMatch ? user : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
          dailyMoods: {
            where: {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
        },
      });

      session.user.id = user?.id || "";
      session.user.type = user?.type;
      session.user.darkMode = user?.darkMode || false;
      session.user.moodToday = user?.dailyMoods[0]?.mood || undefined;

      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user?.id,
          email: user?.email,
          role: "authenticated",
          type: user?.type,
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }

      return session;
    },
    authorized: async ({ auth }) => {
      if (!auth) return false;

      return true; // Default allow
    },
  },
  events: {
    async createUser({ user }) {
      const newUser = await prisma.user.findUnique({
        where: { email: user.email || "" },
      });

      if (!newUser) return;

      await prisma.student.create({
        data: {
          studentId: newUser.id,
        },
      });
      createManyChatsWithOthers(UserType.Counselor, newUser.id);
    },
  },
});

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "Email" },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Password",
//         },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email as string },
//         });
//         if (!user) return null;

//         const passwordMatch = await bcrypt.compare(
//           credentials.password as string,
//           user.password!
//         );

//         return passwordMatch ? user : null;
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     // async jwt({ token, user, account }) {
//     //   if (account?.provider === "credentials") {
//     //     token.credentials = true;
//     //   }
//     //   return token;
//     // },
//     async session({ session, user }) {
//       const signingSecret = process.env.SUPABASE_JWT_SECRET;

//       if (user) {
//         session.user.name = user.name;
//         session.user.email = user.email;
//         session.user.image = user.image;
//         session.user.type = user.type;
//         session.user.id = user.id;
//       }

//       if (signingSecret) {
//         const payload = {
//           aud: "authenticated",
//           exp: Math.floor(new Date(session.expires).getTime() / 1000),
//           sub: user?.id,
//           email: user?.email,
//           role: "authenticated",
//         };
//         session.supabaseAccessToken = jwt.sign(payload, signingSecret);
//       }

//       return session;
//     },
//   },
//   events: {
//     async createUser({ user }) {
//       const newUser = await prisma.user.findUnique({
//         where: { email: user.email || "" },
//       });

//       if (!newUser) return;

//       await prisma.student.create({
//         data: {
//           studentId: newUser.id,
//         },
//       });
//       createManyChatsWithOthers(newUser.type, newUser.id);
//     },
//   },
//   // jwt: {
//   //   encode: async function (params) {
//   //     if (params.token?.credentials) {
//   //       const sessionToken = uuid();

//   //       if (!params.token.sub) {
//   //         throw new Error("No user ID found in token");
//   //       }

//   //       const createdSession = await prisma.verificationToken.create({
//   //         data: {
//   //           identifier: params.token.sub,
//   //           token: sessionToken,
//   //           expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//   //         },
//   //       });

//   //       if (!createdSession) {
//   //         throw new Error("Failed to create session");
//   //       }

//   //       return sessionToken;
//   //     }
//   //     return defaultEncode(params);
//   //   },
//   // },
// });
