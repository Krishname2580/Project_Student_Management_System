
const Course = require("../models/Course");

class CourseController {

    // Create Course
    async createCourse(req, res) {
        try {

            const course = await Course.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: course
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get All Courses
    async getCourses(req, res) {
        try {

            const courses = await Course.find()
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: courses.length,
                data: courses
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get Single Course
    async getCourseById(req, res) {
        try {

            const course = await Course.findById(req.params.id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: course
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update Course
    async updateCourse(req, res) {
        try {

            const course =
                await Course.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Course updated successfully",
                data: course
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete Course
    async deleteCourse(req, res) {
        try {

            const course =
                await Course.findByIdAndDelete(req.params.id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Course deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CourseController();

