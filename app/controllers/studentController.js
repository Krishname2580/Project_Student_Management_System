
const Student = require("../models/Student");
const Course = require("../models/Course");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const mongoose = require("mongoose");

class StudentController {

    async createStudent(req, res) {
        try {

            const student = await Student.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Student created successfully",
                data: student
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async createStudentEjs(req, res) {

        try {
            console.log(req.body);

            const lastStudent = await Student.findOne().sort({ studentId: -1 });

            let newStudentId;

            if (!lastStudent || !lastStudent.studentId) {
                newStudentId = 19100100100;
            } else {
                newStudentId = Number(lastStudent.studentId) + 1;
            }

            const token = jwt.sign(
                {
                    email: req.body.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            const plainPassword = req.body.password; // Save original password

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const studentData = {
                ...req.body,

                password: hashedPassword, // Store hashed password

                studentId: newStudentId,

                isVerified: false,

                verificationToken: token
            };
            if (req.file) {
                studentData.image = req.file.filename;
            }

            await Student.create(studentData);

            const transporter = nodemailer.createTransport({

                service: "gmail",

                auth: {

                    user: process.env.EMAIL_USER,

                    pass: process.env.EMAIL_PASS

                }

            });

            const verifyLink =
                `http://localhost:3007/api/student/verify/${token}`;

            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: req.body.email,

                subject: "Verify Your Student Account",

                html: `
            <h2>Student Management System</h2>

            <h3>Hello ${req.body.name}</h3>

            <p>Your account has been created by Admin.</p>

            <p><strong>Email:</strong> ${req.body.email}</p>
                        
            <p><strong>Password:</strong> ${plainPassword}</p>
                        
            <p>Please verify your email by clicking the button below.</p>

            <a href="${verifyLink}"
            style="padding:12px 20px;
            background:green;
            color:white;
            text-decoration:none;">
            Verify Email
            </a>
            `

            });

            req.flash(
                "success_msg",
                "Student added successfully. Verification email sent."
            );

            res.redirect("/students");

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    }

    async verifyEmail(req, res) {

        try {

            const token = req.params.token;

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const student = await Student.findOne({
                email: decoded.email
            });

            if (!student) {

                req.flash(
                    "error_msg",
                    "Student not found."
                );

                return res.redirect("/login");

            }

            if (student.isVerified) {

                req.flash(
                    "success_msg",
                    "Email already verified."
                );

                return res.redirect("/login");

            }

            student.isVerified = true;

            student.verificationToken = "";

            await student.save();

            await User.create({

                name: student.name,

                email: student.email,

                password: student.password,

                role: "student",

                isVerified: true

            });

            req.flash(
                "success_msg",
                "Email verified successfully. Please login."
            );

            return res.redirect("/login");

        } catch (error) {

            console.log(error);

            req.flash(
                "error_msg",
                "Verification link expired."
            );

            return res.redirect("/login");

        }

    }

    async studentList(req, res) {
        try {
            const students = await Student.find();

            res.render("students/list", {
                students,
                search: "",
                currentPage: 1,
                totalPages: 1,
                totalStudents: students.length
            });

        } catch (error) {
            res.send(error.message);
        }
    }

    async viewStudent(req, res) {
        try {

            const student = await Student.findById(req.params.id);

            if (!student) {
                return res.send("Student not found");
            }

            res.render("students/view", { student });

        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

    async editStudentPage(req, res) {
        try {

            const student = await Student.findById(req.params.id);
            const courses = await Course.find();

            if (!student) {
                return res.send("Student not found");
            }

            res.render("students/edit", {
                student,
                courses
            });

        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

    async updateStudentEjs(req, res) {

        try {

            const updateData = { ...req.body };

            if (req.file) {
                updateData.image = req.file.filename;
            }

            await Student.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            res.redirect("/students");

        } catch (error) {

            console.log(error);
            res.send(error.message);

        }

    }

    async deleteStudentEjs(req, res) {
        try {
            await Student.findByIdAndDelete(req.params.id);
            res.redirect("/students");
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

    async getStudents(req, res) {
        try {

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 5;

            const search = req.query.search || "";

            const skip = (page - 1) * limit;

            const query = {
                isDeleted: false,
                name: {
                    $regex: search,
                    $options: "i"
                }
            };

            const total = await Student.countDocuments(query);

            const students = await Student.find(query)
                .populate("courseId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return res.status(200).json({
                success: true,
                total,
                currentPage: page,
                totalPages:
                    Math.ceil(total / limit),
                data: students
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStudentById(req, res) {
        try {

            const student = await Student.findById(
                req.params.id
            ).populate("courseId");

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: student
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    async updateStudent(req, res) {
        try {

            const student =
                await Student.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Student updated successfully",
                data: student
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteStudent(req, res) {
        try {

            const student =
                await Student.findByIdAndUpdate(
                    req.params.id,
                    {
                        isDeleted: true
                    },
                    {
                        new: true
                    }
                );

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Student deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async uploadImage(req, res) {
        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Image required"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Image uploaded",
                image: req.file.path
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

async searchStudent(req, res) {
    try {
        const keyword = (req.query.keyword || "").trim();

        let students = [];

        if (mongoose.Types.ObjectId.isValid(keyword)) {
            students = await Student.find({ _id: keyword });
        } else if (!isNaN(keyword)) {
            students = await Student.find({
                studentId: Number(keyword)
            });
        }

        res.render("students/search", {
            keyword,
            students,
            currentPage: 1,
            totalPages: 1,
            limit: 10
        });

    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
}

}



module.exports = new StudentController();


