import { NextApiRequest, NextApiResponse } from "next";
import { isEmailValid } from "../../lib/email";
import { saveEmail } from "../../lib/s3";

function sendError(res: NextApiResponse, statusCode: number, message: string, reason?: string) {
  return res.status(statusCode).json({ message, reason });
}

function sendSuccess(res: NextApiResponse, message: string) {
  return res.status(200).json({ message });
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!req || !req.body || !req.body.email) {
    return sendError(res, 400, "Bad Request", "Request body is missing email");
  }

  const { email } = req.body;
  if (!isEmailValid(email)) {
    return sendError(res, 400, "Bad Request", "Email is not valid");
  }

  try {
    await saveEmail(email);
    return sendSuccess(res, "Subscribed");
  } catch (e) {
    console.error(e);
    return sendError(res, 500, "Internal Server Error", "Failed to subscribe");
  }
}
