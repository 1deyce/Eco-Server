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
  uploadAvatar
} = require("../controllers/authController");

// AWS S3 BUCKET
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { S3 } = require('@aws-sdk/client-s3');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

const s3 = new S3({ 
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const s3StreamUpload = (options) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({ ...options, Body: pass }).promise(),
  };
};

const storage = multer.memoryStorage({
  fileFilter: function (req, file, cb) {
    // Add your file filter logic here
    cb(null, true);
  },
});

const upload = multer({
  storage: {
    _handleFile: async function (req, file, cb) {
      const uniqueFileKey = uuidv4() + '-' + file.originalname;
      const upload = s3StreamUpload({
        Bucket: bucketName,
        Key: uniqueFileKey,
      });

      file.stream.pipe(upload.writeStream);

      upload.promise
        .then((result) => {
          cb(null, {
            path: result.Location, // The S3 url to the uploaded file
            size: file.size,
          });
        })
        .catch(cb);
    },
    _removeFile: function (req, file, cb) {
      // Add your file removal logic here
    },
  },
});

const {OAuth2Client, JWT} = require("google-auth-library");

router.get("/", test)
router.post("/signup", registerUser)
router.get("/confirm/:id/:token", confirmEmail)
router.post("/login", loginUser)
router.get("/profile", getProfile)
router.get("/logout", logoutUser)
router.post("/email", sendEmail)
// forgot password
router.post("/forgot", forgotPassword)
// reset password
router.post("/reset/:id/:token", resetPassword)
// User profile
router.post("/profile/update", updateUserAccount)
router.post("/profile/avatar", upload.single('avatar'), uploadAvatar)
// google auth


module.exports = router;