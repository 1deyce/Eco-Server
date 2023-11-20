const router = require('express').Router();
const dotenv = require("dotenv");
dotenv.config();
const { 
  test, 
  registerUser, 
  loginUser, 
  getProfile,
  forgotPassword,
  resetPassword, 
  logoutUser,
  confirmEmail,
  sendEmail,
  updateUserAccount,
  uploadAvatar,
  displayAvatar,
  updateAddress
} = require("../controllers/authController");

// AWS S3 BUCKET
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { S3, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const stream = require("stream");

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

const s3 = new S3({ 
  region: region,
});

const s3StreamUpload = async (options) => {
  const pass = new stream.PassThrough();
  pass.end(options.Body);
  const result = await s3.send(new PutObjectCommand(options));
  return result;
};

const getPresignedUrl = async (bucket, key) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires after 1 hour
  return signedUrl;
};

const upload = multer({
  storage: {
    _handleFile: async function (req, file, cb) {
      const uniqueFileKey = uuidv4() + '-' + file.originalname;
      console.log(file.originalname)
      let chunks = [];
      file.stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      file.stream.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        try {
          await s3StreamUpload({
            Bucket: bucketName,
            Key: uniqueFileKey,
            Body: buffer,
          });

          const presignedUrl = await getPresignedUrl(bucketName, uniqueFileKey);
          cb(null, {
            path: presignedUrl, // The pre-signed url to the uploaded file
            size: file.size,
          });
        } catch (error) {
          cb(error);
        }
      });
    },
    _removeFile: function (req, file, cb) {
      // Add your file removal logic here
    },
  },
});

router.get("/", test)
//user auth
router.post("/signup", registerUser)
router.get("/confirm/:id/:token", confirmEmail)
router.post("/login", loginUser)
router.get("/profile", getProfile)
router.get("/logout", logoutUser)
// contact form
router.post("/email", sendEmail)
// forgot password
router.post("/forgot", forgotPassword)
// reset password
router.post("/reset/:id/:token", resetPassword)
// User profile
router.post("/profile/update", updateUserAccount)
router.post("/profile/avatar", upload.single('avatar'), uploadAvatar)
router.get("/avatar/:userId", displayAvatar)
router.put("/addresses/:id", updateAddress)

module.exports = router;
