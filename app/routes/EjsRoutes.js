const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const dashboardEjsController = require('../controllers/dashboardEjsController')
const courseEjsController = require("../controllers/courseEjsController");
const studentController = require("../controllers/studentController");
const authEjsController = require("../controllers/authEjsController");
const noticeEjsController = require("../controllers/noticeEjsController")
const isAdmin = require("../middleware/isAdmin");

router.get("/", (req, res) => {
    res.redirect("/login");
});
// Auth
// Register
router.get("/register", authEjsController.registerPage);
router.post("/register", authEjsController.register);
router.get("/verify-email/:token", authEjsController.verifyEmail);

// router.post("/send-otp", authEjsController.sendOTP);

// router.post("/verify-otp", authEjsController.verifyOTP);
// Login
router.get("/login", authEjsController.loginPage);
router.post("/login", authEjsController.login);

// Dashboard
router.get("/dashboard", dashboardEjsController.dashboard);

// Profile
router.get("/profile", dashboardEjsController.profilePage);
router.get("/change-password", dashboardEjsController.changePasswordPage);
router.post("/change-password", dashboardEjsController.changePassword);
router.get("/forgot-password", dashboardEjsController.forgotPasswordPage);



// Courses

router.get("/courses", isAdmin, courseEjsController.courseList);

router.get("/courses/add", isAdmin, courseEjsController.addCoursePage);

router.post("/courses/add", isAdmin, courseEjsController.addCourse);

router.get("/courses/edit/:id", isAdmin, courseEjsController.editCoursePage);

router.post("/courses/update/:id", isAdmin, courseEjsController.updateCourse);

router.get("/courses/delete/:id", isAdmin, courseEjsController.deleteCourse);


// Students
router.get("/students/add", (req, res) => {
    res.render("students/add", {
        classes: []
    });
});

router.post("/students/create", upload.single("image"), studentController.createStudentEjs);

router.get("/students", studentController.studentList);

router.get("/students/view/:id", studentController.viewStudent);

router.get("/students/edit/:id", studentController.editStudentPage);

router.post("/students/update/:id", upload.single("image"), studentController.updateStudentEjs);

router.get("/students/delete/:id", studentController.deleteStudentEjs);

router.get("/students/search", studentController.searchStudent);



// Settings
router.get("/about", (req, res) => {
    res.render("settings/about");
});

router.get("/contact", (req, res) => {
    res.render("settings/contact");
});



// ================= Notices =================

// Manage Notices
router.get("/notices", noticeEjsController.noticeList);

// Add Notice
router.get("/notices/add", noticeEjsController.addNoticePage);
router.post("/notices/add", noticeEjsController.addNotice);

// Edit Notice
router.get("/notices/edit/:id", noticeEjsController.editNoticePage);
router.post("/notices/update/:id", noticeEjsController.updateNotice);

// Delete Notice
router.get("/notices/delete/:id", noticeEjsController.deleteNotice);

router.get('/public-notices/add', (req, res) => {
    res.render('public-notices/add-public-notice');
});
router.post("/public-notices/add", noticeEjsController.addPublicNotice);
router.get("/public-notices", noticeEjsController.publicNoticeList);

router.get("/public-notices/edit/:id", noticeEjsController.editPublicNoticePage);

router.post("/public-notices/update/:id", noticeEjsController.updatePublicNotice);
router.get("/public-notices/delete/:id", noticeEjsController.deletePublicNotice);

router.get("/reports/between-dates", noticeEjsController.betweenDateReport);

module.exports = router;