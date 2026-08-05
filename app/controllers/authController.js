
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {

    // Register User
    async registerCreate(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || "student"
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login User
    async loginCreate(req, res) {
        try {

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user
            });

            req.session.user = user;

            res.redirect("/dashboard");
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Change Password
    async changePassword(req, res) {
        try {

            const userId = req.user.id;

            const {
                oldPassword,
                newPassword
            } = req.body;

            const user = await User.findById(userId);

            const isMatch = await bcrypt.compare(
                oldPassword,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Old password incorrect"
                });
            }

            const hashedPassword =
                await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async logout(req, res) {

        try {

            req.session.destroy((err) => {

                if (err) {
                    console.log(err);
                    return res.send("Logout failed");
                }

                res.clearCookie("connect.sid");

                req.session = null;

                return res.redirect("/login?logout=1");

            });

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }
}

module.exports = new AuthController();

