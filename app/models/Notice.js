const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        nottitle: {
            type: String,
            required: true,
            trim: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        notmsg: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Notice ||
    mongoose.model("Notice", noticeSchema);