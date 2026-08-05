const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    title: String,
    message: String,

    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);