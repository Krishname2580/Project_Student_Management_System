const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

router.post("/create/student", auth, studentController.createStudent);
router.post("/upload", auth, upload.single("image"), studentController.uploadImage);
router.get("/getAllStudents", auth, studentController.getStudents);
router.get("/student/verify/:token",studentController.verifyEmail);
router.get("/getStudent/:id", auth, studentController.getStudentById);
router.put("/update/student/:id", auth, studentController.updateStudent);
router.delete("/delete/student/:id", auth, studentController.deleteStudent);

module.exports = router;