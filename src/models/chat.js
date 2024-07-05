const mongoose = require("mongoose");
const uuid = require("uuid");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { toJSON } = require("./plugins");
const { Schema } = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    messageContent: {
      type: String,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    roomId: {
      type: String,
      required: true,
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: false,
      default: null,
    },
    isEdited: {
      type: Date,
      default: null,
    },
    isDeleted: Boolean,
    seenTime: { type: Date, default: Date.now },
    // seenBy: [
    //   {
    //     userId: {
    //       type: Schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //     seenTime: { type: Date, default: Date.now },
    //     _id: false,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

chatSchema.plugin(toJSON);
chatSchema.plugin(aggregatePaginate);

chatSchema.set("toObject", { virtuals: true, versionKey: false });
chatSchema.set("toJSON", { virtuals: true, versionKey: false });

// User Virtual to fetch user
chatSchema.virtual("user", {
  ref: "User", // The Model to use
  localField: "senderId", // Find in Model, where localField
  foreignField: "_id", // is equal to foreignField
  justOne: true,
});

module.exports = mongoose.model("Chat", chatSchema);
