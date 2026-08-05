const Student = require("../models/Student");
const Course = require("../models/Course");
const Notice = require("../models/Notice");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Notification = require("../models/Notification");

class UserStudentController {

    // Dashboard
    async dashboard(req, res) {

        try {

            const user = req.session.user;

            const student = await Student.findOne({
                email: user.email
            });

            const totalCourses = await Course.countDocuments();

            const totalNotices = await Notice.countDocuments();

            // Get all notifications
            const notifications = await Notification.find()
                .sort({ createdAt: -1 });

            // Count unread notifications
            const unreadCount = notifications.filter(notification =>
                !notification.readBy.includes(user._id)
            ).length;

            res.render("userStudent/dashboard", {
                user,
                student,
                totalCourses,
                totalNotices,
                notifications,
                unreadCount
            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    async readNotification(req, res) {

        try {

            const notification =
                await Notification.findById(req.params.id);

            if (!notification.readBy.includes(req.session.user._id)) {

                notification.readBy.push(req.session.user._id);

                await notification.save();

            }

            res.json({
                success: true
            });

        } catch (error) {

            res.status(500).json({
                success: false
            });

        }

    }

    // My Profile
    async profile(req, res) {
        try {

            const student = await Student.findOne({
                email: req.session.user.email
            });

            if (!student) {
                return res.send("Student not found");
            }

            res.render("userStudent/profile", {
                student,
                user: req.session.user
            });

        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

    // =========================
    // Edit Profile Page
    // =========================
    async editProfile(req, res) {

        try {

            const student = await Student.findOne({
                email: req.session.user.email
            });

            const courses = await Course.find();

            res.render("userStudent/edit-profile", {
                student,
                courses,
                user: req.session.user
            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // Update Profile
    async updateProfile(req, res) {

        try {

            const updateData = {
                ...req.body
            };

            if (req.file) {
                updateData.image = req.file.filename;
            }

            await Student.findOneAndUpdate(
                {
                    email: req.session.user.email
                },
                updateData
            );

            req.flash("success_msg", "Profile Updated Successfully");

            res.redirect("/student/profile");

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // =========================
    // My Course
    // =========================
    async course(req, res) {


        try {

            const student = await Student.findOne({
                email: req.session.user.email
            });
            const course = await Course.findOne({
                name: student.course
            });
            console.log(student.course);
            console.log(course);

            res.render("userStudent/courses", {
                student,
                course,
                user: req.session.user
            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // =========================
    // Notices
    // =========================
    async notices(req, res) {

        try {

            const notices = await Notice.find().sort({
                createdAt: -1
            });

            res.render("userStudent/notices", {
                notices,
                user: req.session.user
            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // =========================
    // Change Password Page
    // =========================
    changePasswordPage(req, res) {

        res.render("userStudent/change-password", {
            user: req.session.user
        });

    }

    // =========================
    // Change Password
    // =========================
    async changePassword(req, res) {

        try {

            const {
                currentPassword,
                newPassword,
                confirmPassword
            } = req.body;

            if (newPassword !== confirmPassword) {

                req.flash("error_msg", "Passwords do not match");

                return res.redirect("/userStudent/change-password");

            }

            const user = await User.findById(req.session.user._id);

            const match = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!match) {

                req.flash("error_msg", "Current password is incorrect");

                return res.redirect("/userStudent/change-password");

            }

            user.password = await bcrypt.hash(newPassword, 10);

            await user.save();

            req.flash("success_msg", "Password Changed Successfully");

            res.redirect("/student/dashboard");

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

}

module.exports = new UserStudentController();