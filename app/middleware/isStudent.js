const isStudent = (req, res, next) => {

    if (!req.session.user) {
        req.flash("error_msg", "Please login first.");
        return res.redirect("/login");
    }

    if (req.session.user.role !== "student") {
        req.flash("error_msg", "Access Denied. Student only.");
        return res.redirect("/login");
    }

    next();
};

module.exports = isStudent;