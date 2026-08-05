const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    marks: {
        type: Number,
        required: true
    },

    grade: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Result", resultSchema);