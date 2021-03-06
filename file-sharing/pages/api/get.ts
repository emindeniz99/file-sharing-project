// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer, { memoryStorage } from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import crypto from "crypto";
import bodyParser from "body-parser";
var s3 = new aws.S3({
  /* ... */
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
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

apiRoute.get(bodyParser.json(), async (req, res) => {
  console.log(Date.now());
  console.log(req.query.id);

  try {
    const objHead = await s3
      .headObject({
        Bucket: "cmpe48a-project",
        Key: req.query.id as string,
      })
      .promise();
    console.log(objHead);

    const filename = objHead.Metadata?.originalname;
    const contentType = objHead.ContentType as string;
    s3.getObject({
      Bucket: "cmpe48a-project",
      Key: req.query.id as string,
    })
      .createReadStream()
      // https://stackoverflow.com/questions/35386749/how-download-a-file-from-amazon-s3-with-express-js-and-request-js/35386796#35386796
      .pipe(
        res
          .setHeader("Content-Type", contentType)
          .setHeader("Content-Disposition", `inline; filename="${filename}"`)
      );
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
