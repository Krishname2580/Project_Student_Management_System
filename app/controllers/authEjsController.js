const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const OTP = require("../models/Otp");

class AuthEjsController {


    registerPage(req, res) {
        res.render("auth/register", {
            success_msg: req.flash("success_msg"),
            error_msg: req.flash("error_msg")
        });
    }


    async register(req, res) {

        try {

            const {
                name,
                email,
                phone,
                gender,
                age,
                password,
                confirmPassword
            } = req.body;

            if (!name || !email || !phone || !gender || !age || !password || !confirmPassword) {
                req.flash("error_msg", "All fields are required");
                return res.redirect("/register");
            }

            if (password !== confirmPassword) {
                req.flash("error_msg", "Passwords do not match");
                return res.redirect("/register");
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                req.flash("error_msg", "Email already exists");
                return res.redirect("/register");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const verificationToken = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            await User.create({
                name,
                email,
                phone,
                gender,
                age,
                password: hashedPassword,
                role: "student",
                isVerified: false,
                verificationToken
            });

            console.log("Before sending email...");
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const verifyLink = `http://localhost:3007/verify-email/${verificationToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Verify Your Email",
                html: `
                <h2>Student Management System</h2>

                <p>Hello ${name},</p>

                <p>Please click the button below to verify your email.</p>

                <a href="${verifyLink}" 
                   style="padding:10px 20px;
                          background:green;
                          color:white;
                          text-decoration:none;">
                    Verify Email
                </a>
            `
            });

            req.flash("success_msg", "Registration successful. Please verify your email.");

            return res.redirect("/login");

        } catch (error) {

            console.error("Register Error:", error);

            req.flash("error_msg", error.message);

            return res.redirect("/register");

        }

    }

    async verifyEmail(req, res) {

        try {

            const { token } = req.params;

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findOne({
                email: decoded.email
            });

            if (!user) {

                req.flash("error_msg", "User not found.");

                return res.redirect("/login");

            }

            user.isVerified = true;
            user.verificationToken = "";

            await user.save();

            req.flash("success_msg", "Email verified successfully. Please login.");

            return res.redirect("/login");

        } catch (error) {

            req.flash("error_msg", "Verification link expired or invalid.");

            return res.redirect("/login");

        }

    }


    loginPage(req, res) {

        res.render("auth/login", {
            success_msg: req.flash("success_msg"),
            error_msg: req.flash("error_msg")
        });

    }


    // async login(req, res) {

    //     try {

    //         const { email, password } = req.body;

    //         if (!email || !password) {

    //             req.flash("error_msg", "Email and Password required");
    //             return res.redirect("/login");

    //         }



    //         const user = await User.findOne({ email });

    //         if (!user) {

    //             req.flash("error_msg", "Invalid Email");
    //             return res.redirect("/login");

    //         }

    //         if (!user.isVerified) {

    //             req.flash("error_msg", "Please verify your email before login.");

    //             return res.redirect("/login");

    //         }



    //         const isMatch = await bcrypt.compare(
    //             password,
    //             user.password
    //         );

    //         if (!isMatch) {

    //             req.flash("error_msg", "Invalid Password");
    //             return res.redirect("/login");

    //         }

    //         req.session.user = user;

    //         if (user.role === "admin") {
    //             return res.redirect("/dashboard");
    //         }

    //         if (user.role === "student") {
    //             return res.redirect("/student/dashboard");
    //         }

    //     } catch (error) {

    //         req.flash("error_msg", error.message);
    //         return res.redirect("/login");

    //     }

    // }



    // Logout

    async sendOTP(req, res) {

    try {

        console.log("Step 1");

        const { email } = req.body;

        console.log("Email:", email);

        const user = await User.findOne({ email });

        console.log("Step 2");
        console.log(user);

        if (!user) {
            req.flash("error_msg", "User not found");
            return res.redirect("/login");
        }

        console.log("Step 3");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("OTP:", otp);

        await OTP.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log("Step 4");

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("Step 5");

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Login OTP",
            html: `<h2>Your OTP is ${otp}</h2>`
        });

        console.log("Step 6 - Email Sent");

        return res.render("auth/verifyOtp", {
            email
        });

    } catch (error) {

        console.log("ERROR:", error);

        return res.send(error.message);

    }

}
    async verifyOTP(req, res) {

        try {

            const { email, otp } = req.body;

            const otpData = await OTP.findOne({ email });

            if (!otpData) {

                req.flash("error_msg", "OTP not found");
                return res.redirect("/login");

            }

            if (otpData.expiresAt < Date.now()) {

                req.flash("error_msg", "OTP Expired");
                return res.redirect("/login");

            }

            if (otpData.otp !== otp) {

                return res.render("auth/verifyOtp", {
                    email,
                    error_msg: "Invalid OTP",
                    success_msg: ""
                });

            }

            const user = await User.findOne({ email });

            req.session.user = user;

            await OTP.deleteOne({ email });

            if (user.role === "admin") {

                return res.redirect("/dashboard");

            }

            return res.redirect("/student/dashboard");

        } catch (error) {

            req.flash("error_msg", error.message);
            return res.redirect("/login");

        }

    }

    logout(req, res) {

        req.session.destroy(() => {

            res.redirect("/login");

        });

    }

}

module.exports = new AuthEjsController();