const router = require('express').Router();
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

const multer = require("multer");
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

aws.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, res, cb) {
      cb(null, {fieldName: file.fieldName});
    },
    key: function (req, res, cb) {
      const uniqueFileKey = Date.now().toString() + "-" + file.originalname;
      cb(null, uniqueFileKey);
    }
  })
})

const dotenv = require("dotenv");
dotenv.config();

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