/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from "firebase-admin/app";
import { onCall, HttpsError } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import { sendInvitationEmail, SendEmailArgs } from "./sendInvitation";
import {
  forgotPassword,
  resetPassword,
  ResetPasswordArgs,
  ForgotPasswordArgs,
} from "./passwordReset";
import { ResetEmailArgs, resetUserEmail } from "./resetEmail";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

export const sendProjectInvite = onCall(async (request) => {
  const data = request.data as SendEmailArgs;

  try {
    await sendInvitationEmail(data);

    return {
      message: `Invitations sent`,
    };
  } catch (error: any) {
    throw new HttpsError(
      "invalid-argument",
      error.message || "Unable to send invite"
    );
  }
});

export const initiatePasswordReset = onCall(async (request) => {
  try {
    const data = request.data as ForgotPasswordArgs;

    await forgotPassword(data);
    return {
      message: `Password reset initiation success`,
    };
  } catch (error: any) {
    throw new HttpsError(
      "invalid-argument",
      error.message || "Unable to initiate reset password"
    );
  }
});

export const completePasswordReset = onCall(async (request) => {
  try {
    const data = request.data as ResetPasswordArgs;

    await resetPassword(data);
    return {
      message: `Password reset success`,
    };
  } catch (error: any) {
    throw new HttpsError(
      "invalid-argument",
      error.message || "Unable to reset password"
    );
  }
});

export const updateUserEmail = onCall(async (request) => {
  try {
    const data = request.data as ResetEmailArgs;

    await resetUserEmail(data);
    return {
      message: `Email reset success`,
    };
  } catch (error: any) {
    throw new HttpsError(
      "invalid-argument",
      error.message || "Unable to reset email"
    );
  }
});
