import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      default: ""
    },
    public_id: {
      type: String,
      default: ""
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
