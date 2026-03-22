export const otpTemplate = (otp: string) => `
<!DOCTYPE html>
<html>
  <body style="margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f6f7fb; padding: 40px 0; color: #111827;">
    <div style="max-width: 460px; margin: auto; background: #ffffff; border-radius: 14px; padding: 0; box-shadow: 0 6px 20px rgba(17, 24, 39, 0.08); overflow: hidden;">
      <div style="padding: 20px 28px; background: #111827; color: #ffffff;">
        <p style="margin: 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.8;">JustClick</p>
        <h1 style="margin: 8px 0 0; font-size: 22px; line-height: 1.3;">Email Verification</h1>
      </div>

      <div style="padding: 28px;">
        <p style="margin: 0 0 10px; color: #374151; font-size: 15px; line-height: 1.6;">
          Welcome to <strong>JustClick</strong>. Use the one-time code below to verify your account.
        </p>
        <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
          This code expires in <strong>10 minutes</strong>.
        </p>

        <div style="font-size: 34px; font-weight: 700; letter-spacing: 9px; padding: 18px 14px; background: #f3f4f6; text-align: center; border-radius: 10px; color: #111827; margin: 0 0 18px;">
        ${otp}
        </div>

        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
          If you did not request this code, you can ignore this email safely.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
          Sent by JustClick Security Team
        </p>
      </div>
    </div>
  </body>
</html>
`;
