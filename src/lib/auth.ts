import "server-only";

import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        await resend.emails.send({
          from: "Ignite+ <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email",
          html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
            <h1 style="font-size: 24px; font-weight: bold;">Verify your email</h1>
            <p style="font-size: 16px; margin-top: 10px;">Your verification code is ${otp}</p>
          </div>
          `,
        });
      },
    }),
    admin(),
  ],
});
