const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");
const dashboardEjsController = require("../controllers/dashboardEjsController");



router.get("/dashboard", auth, dashboardController.dashboard);

// for ejs
router.get("/", auth, dashboardEjsController.dashboard);



module.exports = router;