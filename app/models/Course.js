
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: String,
            required: true
        },

        fees: {
            type: Number,
            required: true
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.models.Course ||
                 mongoose.model("Course", courseSchema);
