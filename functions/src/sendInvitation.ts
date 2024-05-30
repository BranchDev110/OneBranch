import * as nodemailer from "nodemailer";

export interface SendEmailArgs {
  emails: string[];
  projectId: string;
  taskId?: string;
  projectName: string;
  originUrl: string;
  adminName: string;
  inviteId: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const buildUrl = (
  originUrl: string,
  projectId: string,
  inviteId: string,
  taskId?: string
) => {
  let url = `${originUrl}`;

  if (originUrl.includes("?")) {
    url = `${url}&projectId=${projectId}`;
  } else {
    url = `${url}?projectId=${projectId}`;
  }

  if (taskId) {
    url = `${url}&taskId=${taskId}`;
  }

  url = `${url}&verifyToken=${inviteId}`;
  return url;
};

export const sendInvitationEmail = async ({
  adminName,
  emails = [],
  originUrl,
  projectId,
  taskId,
  projectName,
  inviteId,
}: SendEmailArgs) => {
  try {
    const url = buildUrl(originUrl, projectId, inviteId, taskId);

    // console.log({
    //   adminName,
    //   emails,
    //   originUrl,
    //   projectId,
    //   taskId,
    //   projectName,
    // });

    let config = {
      from: `"${adminName}" <${process.env.EMAIL}>`,
      to: emails.join(", "),
      subject: "Project Invitation",
      text: `${adminName} has invited you to join the project "${projectName}"\n Click this link ${url} and get started.`,
      html: `<table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="20">
                        <tr>
                            <td>
                                <h1>Project Invitation</h1>
                                <p>Hello,</p>
                                <p>${adminName} has invited you to join the project "<strong>${projectName}</strong>".
                                </p>

                                <p>Please click the link below to accept the invitation and get started:</p>
                                <p><a href="${url}">Join the Project</a></p>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`,
    };

    // console.log(config);

    await transporter.sendMail(config);

    return true;
  } catch (e) {
    let error = new Error("Unable to send invitation");
    (error as any).details = e;

    throw error;
  }
};
