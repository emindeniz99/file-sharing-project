// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer, { memoryStorage } from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import crypto from "crypto";
var s3 = new aws.S3({
  /* ... */
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

const upload = multer({
  storage: memoryStorage(),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error(error);

    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(upload.array("theFiles"), async (req, res) => {
  console.log(Date.now());
  if (!req.files || !(req.files && (req.files as any)[0]))
    return res.json({ error: "error", files: req.files });
  const hashSum = crypto.createHash("sha256");
  const file: Express.Multer.File = (req.files as any)[0];

  hashSum.update(file.buffer);

  const hex = hashSum.digest("hex");
  console.log("🚀 ~ file: hello.ts ~ line 43 ~ apiRoute.post ~ hex", hex);
  try {
    console.log(file.mimetype);

    const result = await s3
      .upload({
        Bucket: "cmpe48a-project",
        Key: hex, // File name you want to save as in S3
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalname: file.originalname,
        },
      })
      .promise();
    res.status(200).json({ data: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: "error", error });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
