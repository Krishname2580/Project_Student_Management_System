const Course = require("../models/Course");
const Student = require("../models/Student");

const User = require("../models/User");
const Notice = require("../models/Notice");
const PublicNotice = require("../models/PublicNotice");

class DashboardEjsController {
    async dashboard(req, res) {
        try {
            const totalCourses = await Course.countDocuments();
            const totalStudents = await Student.countDocuments();
            const totalNotices = await Notice.countDocuments();
            const totalPublicNotices = await PublicNotice.countDocuments();

            const students = await Student.find().sort({ createdAt: -1 });

            res.render("dashboard/index", {
                title: "Dashboard",
                totalCourses,
                totalStudents,
                totalNotices,
                totalPublicNotices,
                students
            });

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async profilePage(req, res) {

        try {

            const admin = await User.findById(req.session.user._id);

            res.render("profile/profile", {
                admin
            });


        } catch (error) {

            console.log(error);
            res.redirect("/login");

        }

    }


    async changePasswordPage(req, res) {

        try {

            res.render("auth/change-password");

        } catch (error) {

            console.log(error);
            res.status(500).send("Internal Server Error");

        }

    }

    async changePassword(req, res) {

        try {

            const { oldPassword, newPassword, confirmPassword } = req.body;

            // Your password update logic here

            res.redirect("/profile");

        } catch (error) {

            console.log(error);
            res.status(500).send("Internal Server Error");

        }

    }


    async forgotPasswordPage(req, res) {

        try {

            res.render("auth/forgot-password");

        } catch (error) {

            console.log(error);
            res.status(500).send("Internal Server Error");

        }

    }
}

module.exports = new DashboardEjsController();