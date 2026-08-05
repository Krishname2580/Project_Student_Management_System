const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: Number,
        unique: true,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    address: {
        type: String
    },

    image: {
        type: String,
        default: ""
    },

    course: {
        type: String
    },

    dob: {
        type: Date,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },

    motherName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String,
        default: ""
    }

}, { timestamps: true });



module.exports =
    mongoose.models.Student ||
    mongoose.model("Student", studentSchema);
