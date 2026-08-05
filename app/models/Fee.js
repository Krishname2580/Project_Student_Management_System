const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    totalFee: {
        type: Number,
        required: true
    },

    paidAmount: {
        type: Number,
        default: 0
    },

    dueAmount: {
        type: Number,
        default: 0
    },

    paymentStatus: {
        type: String,
        enum: ["Paid", "Pending", "Partial"],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Fee", feeSchema);