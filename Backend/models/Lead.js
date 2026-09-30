const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,

    },

    phone: {
      type: String,
      trim: true,
    },   
    

    company: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      trim: true,
    },

    value: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "interested", "negotiation", "won", "lost"],
      default: "new",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    aiScore: {
      type: Number,
      default: null,
    },

    aiPriority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: null,
    },

    aiReason: {
      type: String,
      default: null,
    },

    aiNextBestAction: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lead", leadSchema);
