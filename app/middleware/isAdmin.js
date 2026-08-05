const isAdmin = (req, res, next) => {

    if (!req.session.user) {
        req.flash("error_msg", "Please login first.");
        return res.redirect("/login");
    }

    if (req.session.user.role !== "admin") {
        req.flash("error_msg", "Access Denied. Admin only.");
        return res.redirect("/login");
    }

    next();
};

module.exports = isAdmin;