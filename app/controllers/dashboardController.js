
const Student = require("../models/Student");
const Course = require("../models/Course");

class DashboardController {

    async dashboard(req, res) {

        try {

            const totalStudents = await Student.countDocuments({
                isDeleted: false
            });

            const totalCourses = await Course.countDocuments();

            const maleStudents = await Student.countDocuments({
                gender: "Male",
                isDeleted: false
            });

            const femaleStudents = await Student.countDocuments({
                gender: "Female",
                isDeleted: false
            });

            return res.status(200).json({
                success: true,
                data: {
                    totalStudents,
                    totalCourses,
                    maleStudents,
                    femaleStudents
                }
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

}

module.exports = new DashboardController();
