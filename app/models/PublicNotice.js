const mongoose = require("mongoose");

const publicNoticeSchema = new mongoose.Schema(
    {
        nottitle: {
            type: String,
            required: true,
            trim: true
        },

        notmsg: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.PublicNotice ||
    mongoose.model("PublicNotice", publicNoticeSchema);