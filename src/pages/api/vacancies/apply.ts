import { NextApiRequest, NextApiResponse } from "next";
import { saveVacancyApplication } from "../../../lib/s3";

function sendError(res: NextApiResponse, statusCode: number, message: string, reason?: string) {
  return res.status(statusCode).json({ message, reason });
}

function sendSuccess(res: NextApiResponse, message: string) {
  return res.status(200).json({ message });
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!req || !req.body || !req.body.contact || !req.body.id) {
    return sendError(res, 400, "Bad Request", "Request body is missing contact or id");
  }

  try {
    await saveVacancyApplication(req.body);
    return sendSuccess(res, "Applied");
  } catch (e) {
    console.error(e);
    return sendError(res, 500, "Internal Server Error", "Failed to apply");
  }
}
