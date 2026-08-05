const Course = require("../models/Course");

// Display all courses
exports.courseList = async (req, res) => {
    try {
        const classes = await Course.find();

        res.render("courses/list", {
            classes,
            currentPage: 1,
            totalPages: 1,
            success_msg: "",
            error_msg: "",
            search: ""
        });
    } catch (error) {
        console.log("Course List Error:", error);

        res.render("courses/list", {
            classes: [],
            currentPage: 1,
            totalPages: 1,
            success_msg: "",
            error_msg: "Unable to load courses",
            search: ""
        });
    }
};

// Show Add Course Page
exports.addCoursePage = (req, res) => {
    res.render("courses/add");
};

exports.addCourse = async (req, res) => {
    try {
        const { name, duration, fees, description } = req.body;

        const course = new Course({
            name,
            duration,
            fees,
            description
        });

        await course.save();

        res.redirect("/courses");

    } catch (error) {
        console.log("Add Course Error:", error);
        res.redirect("/courses/add");
    }
};

// Show Edit Course Page
exports.editCoursePage = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.redirect("/courses");
        }

        res.render("courses/edit", {
            course
        });

    } catch (error) {
        console.log(error);
        res.redirect("/courses");
    }
};


exports.updateCourse = async (req, res) => {
    try {

        const { name, duration, fees, description } = req.body;

        await Course.findByIdAndUpdate(
            req.params.id,
            {
                name,
                duration,
                fees,
                description
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.redirect("/courses");

    } catch (error) {
        console.log("Update Course Error:", error);

        res.render("courses/edit", {
            course: {
                _id: req.params.id,
                name: req.body.name,
                duration: req.body.duration,
                fees: req.body.fees,
                description: req.body.description
            },
            success_msg: "",
            error_msg: "Failed to update course."
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.redirect("/courses");
    } catch (error) {
        console.log("Delete Course Error:", error);
        res.redirect("/courses");
    }
};