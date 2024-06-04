import { getAuth } from "firebase-admin/auth";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export interface ResetPasswordArgs {
  email: string;
  password: string;
}

export const resetPassword = async ({ email, password }: ResetPasswordArgs) => {
  try {
    // console.log({ email, password });

    const user = await getAuth().getUserByEmail(email);

    await getAuth().updateUser(user.uid, { password });

    return true;
  } catch (e: any) {
    let error = new Error(e?.message || "Unable to update password");
    (error as any).details = e;

    throw error;
  }
};

export interface ForgotPasswordArgs {
  email: string;
  originUrl: string;
}

const buildResetUrl = (originUrl: string, oobCode: string) => {
  let url = `${originUrl}?oobCode=${oobCode}`;

  return url;
};

export const forgotPassword = async ({
  email,
  originUrl,
}: ForgotPasswordArgs) => {
  try {
    // console.log({ email, originUrl });

    const user = await getAuth().getUserByEmail(email);

    if (user?.uid) {
      const link = await getAuth().generatePasswordResetLink(email);

      const urlParams = new URLSearchParams(link);
      const oobCode = urlParams.get("oobCode") as string;

      const resetLink = buildResetUrl(originUrl, oobCode);

      const config = {
        from: `"OneBranch" <${process.env.EMAIL}>`,
        to: email,
        subject: "Initiate Password Reset",
        text: `
              Dear User,

              We received a request to reset your password. Click the link below to reset your password:

              ${resetLink}

              If you did not request a password reset, please ignore this email.

              Thank you,
              OneBranch
        `,
        html: ` <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="20" cellspacing="0" border="0" style="border: 1px solid #ddd;">
                              <tr>
                                  <td align="center" bgcolor="#f7f7f7">
                                      <h2>Reset Your Password</h2>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <p>Dear user,</p>
                                      <p>A request to reset your password was initiated. Click the link below to reset your password:</p>
                                      <p>
                                          <a href="${resetLink}" style="background-color: #131313; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                                              Reset Password
                                          </a>
                                      </p>
                                      <p>If you did not request a password reset, please ignore this email.</p>
                                      <p>Thank you,</p>
                                      <p>OneBranch</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>`,
      };

      await transporter.sendMail(config);
      //   console.log(resetLink);

      return true;
    } else {
      throw new Error(`Unable to find user with this email ${email}`);
    }
  } catch (e: any) {
    let error = new Error(e?.message || "Unable to initiate a password reset");
    // console.log(e);
    (error as any).details = e;

    throw error;
  }
};
