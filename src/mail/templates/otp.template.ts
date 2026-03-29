export const otpTemplate = (otp: string) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; background: #f9f9f9; padding: 40px 0; margin: 0;">
    <div style="max-width: 420px; margin: auto; background: white;
                border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <h2 style="margin-top: 0; color: #111;">Verify your email</h2>
      <p style="color: #555;">Use the code below to complete your verification.
         It expires in <strong>10 minutes</strong>.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
        <tr>
          <td style="background: #f4f4f4; border-radius: 8px; text-align: center; padding: 18px 12px;">
            <span style="display: inline-block; font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; line-height: 1; letter-spacing: 8px; color: #111; unicode-bidi: bidi-override; direction: ltr;">
              ${otp}
            </span>
          </td>
        </tr>
      </table>
      <p style="color: #999; font-size: 13px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
`;
