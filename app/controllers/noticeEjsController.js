const Notice = require("../models/Notice");
const Course = require("../models/Course");
const PublicNotice = require("../models/PublicNotice");
const Notification = require("../models/Notification");



class NoticeController {

    // Add Notice Page
    async addNoticePage(req, res) {
        try {

            const courses = await Course.find();

            res.render("notices/add-notice", {
                courses,
                success: "",
                error: ""
            });

        } catch (error) {

            console.log(error);

            res.render("notices/add-notice", {
                courses: [],
                success: "",
                error: "Unable to load courses."
            });

        }
    }

    // Save Notice
    async addNotice(req, res) {

        try {

            const { nottitle, courseId, notmsg } = req.body;

            // Save Notice
            const notice = await Notice.create({
                nottitle,
                courseId,
                notmsg
            });

            // Save Notification
            await Notification.create({
                title: nottitle,
                message: notmsg
            });

            // Socket Notification
            const io = req.app.get("io");

            io.emit("newNotice", {
                id: notice._id,
                title: notice.nottitle,
                message: notice.notmsg,
                createdAt: notice.createdAt
            });

            res.redirect("/notices/add");

        } catch (error) {

            console.log(error);

            const courses = await Course.find();

            res.render("notices/add-notice", {
                courses,
                success: "",
                error: "Failed to add notice."
            });

        }

    }
    // Edit Notice Page
    async editNoticePage(req, res) {

        try {

            const notice = await Notice.findById(req.params.id);

            const courses = await Course.find();

            res.render("notices/edit-notice-detail", {
                notice,
                courses,
                success: "",
                error: ""
            });

        } catch (error) {

            console.log(error);

            res.redirect("/notices/add");

        }

    }

    // Update Notice
    async updateNotice(req, res) {

        try {

            const { nottitle, courseId, notmsg } = req.body;

            await Notice.findByIdAndUpdate(
                req.params.id,
                {
                    nottitle,
                    courseId,
                    notmsg
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            res.redirect("/notices/add");

        } catch (error) {

            console.log(error);

            res.redirect("/notices/add");

        }

    }

    // Notice List
    async noticeList(req, res) {

        try {

            const notices = await Notice.find()
                .populate("courseId")
                .sort({ createdAt: -1 });

            res.render("notices/list", {
                notices,
                currentPage: 1,
                totalPages: 1,
                success_msg: "",
                error_msg: ""
            });

        } catch (error) {

            console.log(error);

            res.render("notices/list", {
                notices: [],
                currentPage: 1,
                totalPages: 1,
                success_msg: "",
                error_msg: "Unable to load notices."
            });

        }

    }

    // Delete Notice
    async deleteNotice(req, res) {

        try {

            await Notice.findByIdAndDelete(req.params.id);

            res.redirect("/notices");

        } catch (error) {

            console.log(error);

            res.redirect("/notices");

        }

    }

    // Add Public Notice
    async addPublicNotice(req, res) {

        try {

            await PublicNotice.create({
                nottitle: req.body.nottitle,
                notmsg: req.body.notmsg,
                status: req.body.status
            });

            req.flash(
                "success_msg",
                "Public Notice Added Successfully"
            );

            res.redirect("/public-notices/add");

        } catch (error) {

            console.log(error);

            req.flash("error_msg", error.message);

            res.redirect("/public-notices/add");

        }

    }

    // Public Notice List
    async publicNoticeList(req, res) {

        try {

            const page = Number(req.query.page) || 1;
            const limit = 5;

            const skip = (page - 1) * limit;

            const total = await PublicNotice.countDocuments();

            const publicNotices = await PublicNotice.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            res.render("public-notices/manage-public-notice", {
                publicNotices,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit
            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // Delete Public Notice
    async deletePublicNotice(req, res) {

        try {

            await PublicNotice.findByIdAndDelete(req.params.id);

            req.flash(
                "success_msg",
                "Public Notice Deleted Successfully"
            );

            res.redirect("/public-notices");

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // Edit Public Notice Page
    async editPublicNoticePage(req, res) {

        try {

            const notice = await PublicNotice.findById(req.params.id);

            res.render("public-notices/edit-public-notice-detail", {
                notice
            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // Update Public Notice
    async updatePublicNotice(req, res) {

        try {

            await PublicNotice.findByIdAndUpdate(
                req.params.id,
                req.body
            );

            req.flash(
                "success_msg",
                "Public Notice Updated Successfully"
            );

            res.redirect("/public-notices");

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    // Between Date Report
    async betweenDateReport(req, res) {

        try {

            const { fromdate, todate } = req.query;

            const students = [];

            res.render(
                "reports/between-date-reports-details",
                {
                    fromDate: fromdate,
                    toDate: todate,
                    students,
                    currentPage: 1,
                    limit: 10,
                    totalPages: 1
                }
            );

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

}

module.exports = new NoticeController();