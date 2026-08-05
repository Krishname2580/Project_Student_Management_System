const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");

router.post("/register/create", authController.registerCreate);
router.post("/login/create", authController.loginCreate);
router.post("/change-password/create", auth, authController.changePassword);
router.get("/logout", authController.logout);

module.exports = router;