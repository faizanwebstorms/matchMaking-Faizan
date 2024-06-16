const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON } = require('./plugins');

const chatSchema = mongoose.Schema(
  {
    messageContent: {
      type: String,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    roomId: {
      type: String,
      required: true,
    },

    // IN CASE OF REPLY
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: false,
      default: null,
    },
    
    isDeleted: Boolean,
    isSeen: Boolean,
  },
  {
    timestamps: true,
  }
);

chatSchema.plugin(toJSON);
chatSchema.plugin(mongoosePaginate);
chatSchema.plugin(aggregatePaginate);

chatSchema.set('toObject', { virtuals: true, versionKey: false });
chatSchema.set('toJSON', { virtuals: true, versionKey: false });

// User Virtual to fetch user
chatSchema.virtual('user', {
  ref: 'User', // The Model to use
  localField: 'senderId', // Find in Model, where localField
  foreignField: '_id', // is equal to foreignField
  justOne: true,
});

module.exports = mongoose.model('Chat', chatSchema);
