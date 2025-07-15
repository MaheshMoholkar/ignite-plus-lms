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
          subject: "Verify your email - Ignite+",
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email - Ignite+</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f8fafc;
                color: #1e293b;
                line-height: 1.6;
              }
              
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
              }
              
              .logo {
                font-size: 28px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 8px;
              }
              
              .tagline {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                font-weight: 400;
              }
              
              .content {
                padding: 40px 30px;
                text-align: center;
              }
              
              .title {
                font-size: 24px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 16px;
              }
              
              .description {
                font-size: 16px;
                color: #64748b;
                margin-bottom: 32px;
                line-height: 1.6;
              }
              
              .otp-container {
                background-color: #f1f5f9;
                border-radius: 8px;
                padding: 24px;
                margin: 24px 0;
                border: 2px solid #e2e8f0;
              }
              
              .otp-code {
                font-size: 32px;
                font-weight: 700;
                color: #1e293b;
                letter-spacing: 4px;
                font-family: 'Courier New', monospace;
                background-color: #ffffff;
                padding: 16px 24px;
                border-radius: 6px;
                border: 1px solid #d1d5db;
                display: inline-block;
                min-width: 200px;
              }
              
              .info {
                font-size: 14px;
                color: #64748b;
                margin-top: 16px;
              }
              
              .footer {
                background-color: #f8fafc;
                padding: 24px 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
              }
              
              .footer-text {
                font-size: 14px;
                color: #64748b;
                margin-bottom: 8px;
              }
              
              .footer-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
              }
              
              .footer-link:hover {
                text-decoration: underline;
              }
              
              @media (max-width: 600px) {
                .container {
                  margin: 0;
                  border-radius: 0;
                }
                
                .header, .content, .footer {
                  padding: 24px 20px;
                }
                
                .otp-code {
                  font-size: 24px;
                  letter-spacing: 2px;
                  min-width: 160px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Ignite+</div>
                <div class="tagline">Empowering Learning Through Technology</div>
              </div>
              
              <div class="content">
                <h1 class="title">Verify Your Email Address</h1>
                <p class="description">
                  Welcome to Ignite+! To complete your registration and start your learning journey, 
                  please enter the verification code below.
                </p>
                
                <div class="otp-container">
                  <div class="otp-code">${otp}</div>
                  <p class="info">This code will expire in 10 minutes for security reasons.</p>
                </div>
                
                <p class="description">
                  If you didn't create an account with Ignite+, you can safely ignore this email.
                </p>
              </div>
              
              <div class="footer">
                <p class="footer-text">
                  Need help? Contact us at 
                  <a href="mailto:support@ignite-plus.com" class="footer-link">support@ignite-plus.com</a>
                </p>
                <p class="footer-text">
                  © 2024 Ignite+. All rights reserved.
                </p>
              </div>
            </div>
          </body>
          </html>
          `,
        });
      },
    }),
    admin(),
  ],
});
