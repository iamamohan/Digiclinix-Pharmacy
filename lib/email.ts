import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export interface SendVerificationOTPEmailParams {
  email: string;
  name?: string | null;
  otp: string;
}

/**
 * Server-only service for sending 6-digit email verification OTPs via Resend.
 *
 * Environment Behavior:
 * - Development (RESEND_API_KEY missing): Safely logs the 6-digit OTP to the server console for local testing.
 * - Production (RESEND_API_KEY missing): Fails safely returning an error (never logs OTPs in production and never pretends email was sent).
 */
export async function sendVerificationOTPEmail({
  email,
  name,
  otp,
}: SendVerificationOTPEmailParams): Promise<{ success: boolean; error?: string }> {
  const recipientName = name || 'Customer';

  if (!resend) {
    if (process.env.NODE_ENV === 'development') {
      console.log('\n====================================================');
      console.log('📧 [DEV ONLY] Email Verification OTP Generated');
      console.log(`Recipient : ${email}`);
      console.log(`6-Digit OTP: ${otp}`);
      console.log('====================================================\n');
      return { success: true };
    }

    console.error('[EmailService] RESEND_API_KEY is not configured in production environment.');
    return { success: false, error: 'Email service is currently unavailable.' };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Digiclinix Pharmacy <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Digiclinix Pharmacy verification code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Brand Header -->
              <div style="margin-bottom: 24px; text-align: center;">
                <h1 style="color: #9333ea; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Digiclinix Pharmacy</h1>
                <p style="color: #64748b; font-size: 13px; font-weight: 500; margin-top: 4px;">Licensed Healthcare & Pharmaceutical Provider</p>
              </div>

              <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 16px;">
                <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">Hello ${recipientName},</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
                  Thank you for creating an account with Digiclinix Pharmacy. Your 6-digit email verification code is:
                </p>

                <!-- OTP Code Display -->
                <div style="text-align: center; margin: 28px 0; background-color: #faf5ff; border: 1px border #e9d5ff; border-radius: 16px; padding: 20px;">
                  <span style="font-family: monospace, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #9333ea;">${otp}</span>
                </div>

                <p style="font-size: 13px; color: #475569; text-align: center; margin-top: 12px;">
                  ⏱️ This code will expire in <strong>10 minutes</strong>.
                </p>

                <!-- Security Note -->
                <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-top: 32px; border: 1px solid #e2e8f0;">
                  <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                    🛡️ <strong>Security Disclaimer:</strong> Never share this verification code with anyone. Digiclinix Pharmacy staff will never ask for your code. If you did not request this, you can safely ignore this email.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #f1f5f9; margin-top: 32px; padding-top: 20px; text-align: center;">
                <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                  &copy; ${new Date().getFullYear()} Digiclinix Pharmacy. All rights reserved.
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('[EmailService] Resend API error:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('\n====================================================');
        console.log('📧 [DEV ONLY] Resend API Error Fallback (Local Test)');
        console.log(`Recipient : ${email}`);
        console.log(`6-Digit OTP: ${otp}`);
        console.log('====================================================\n');
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send verification email';
    console.error('[EmailService] Unexpected error sending email:', errorMsg);
    if (process.env.NODE_ENV === 'development') {
      console.log('\n====================================================');
      console.log('📧 [DEV ONLY] Email Service Exception Fallback');
      console.log(`Recipient : ${email}`);
      console.log(`6-Digit OTP: ${otp}`);
      console.log('====================================================\n');
      return { success: true };
    }
    return { success: false, error: errorMsg };
  }
}
