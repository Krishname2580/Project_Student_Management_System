
const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");


router.post("/create/course", auth, courseController.createCourse);
router.get("/getAllCourse", auth, courseController.getCourses);
router.get("/getCourse/:id", auth, courseController.getCourseById);
router.put("/update/:id", auth, courseController.updateCourse);
router.delete("/delete/:id", auth, courseController.deleteCourse);

module.exports = router;
