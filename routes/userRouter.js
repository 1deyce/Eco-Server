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
  confirmEmail
} = require("../controllers/authController");

const {
  sendEmail,
  updateUserAccount,
  uploadAvatar,
  displayAvatar,
  updateAddress,
  submitFeedback,
  getCollectors,
  getAreas,
  getLocations
} = require("../controllers/userController");

//cloudinary

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
router.post("/profile/avatar", uploadAvatar)
router.get("/avatar/:userId", displayAvatar)
router.put("/addresses/:id", updateAddress)
// feedback form
router.post("/feedback", submitFeedback)
// Collection Schedule
router.get("/collectors", getCollectors)
router.get("/areas", getAreas)
router.get("/locations", getLocations)

module.exports = router;
