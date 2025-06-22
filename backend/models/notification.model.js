import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['follow', 'like', 'comment', 'mention', 'reply'],
    required: true
  }
}, {
  timestamps: true
})

const Notification = model('Notification', notificationSchema)

export default Notification;