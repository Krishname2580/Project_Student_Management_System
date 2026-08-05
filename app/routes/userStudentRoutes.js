const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");


const studentController = require("../controllers/userStudentController");
const isStudent = require("../middleware/isStudent");

router.get("/student/dashboard", isStudent, studentController.dashboard);

router.get("/student/profile", isStudent, studentController.profile);

router.get("/student/profile/edit", isStudent, studentController.editProfile);

router.post("/student/profile/update", upload.single("image"), isStudent, studentController.updateProfile);

router.get("/student/course", isStudent, studentController.course);

router.get("/student/notices", isStudent, studentController.notices);

router.get("/student/change-password", isStudent, studentController.changePasswordPage);

router.post("/student/change-password", isStudent, studentController.changePassword);

router.post(
"/student/notification/read/:id",
studentController.readNotification
);

module.exports = router;