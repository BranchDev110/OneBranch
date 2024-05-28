/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import cors from "cors";

import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import { sendInvitationEmail, SendEmailArgs } from "./sendInvitation";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

export const sendProjectInvite = onRequest(async (req, res) => {
  //restict to deployed url eventually
  cors()(req, res, async () => {
    try {
      const data = req.body as SendEmailArgs;

      await sendInvitationEmail(data);

      res.status(200).send({ message: `Invitations sent` });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Unable to send invite", error });
    }
  });
});
