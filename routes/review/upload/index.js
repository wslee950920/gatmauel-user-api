const aws = require("aws-sdk");

const cloudfrontAccessKeyId = process.env.CF_ACCESS_KEY_ID;
const cloudFrontPrivateKey = process.env.CF_PRIVATE_KEY;
const signer = new aws.CloudFront.Signer(
  cloudfrontAccessKeyId,
  cloudFrontPrivateKey
);

module.exports = async (req, res, next) => {
  const future = 60 * 60 * 1000;
  const timestamp = Math.round(new Date().getTime() + future / 1000);

  const signedUrls = [];
  const imgs = req.files;
  await imgs.forEach((img) => {
    const url =
      process.env.CF_BASE_URL +
      img.key.replace("original", "resized", 1).replace(/(\s*)/g, "");
    const signedUrl = signer.getSignedUrl({
      url,
      expires: timestamp,
    });

    signedUrls.push(signedUrl);
  });

  res.json({ signedUrls });
};
