import mongoose,{ Schema, model } from "mongoose";

const notificationSchema = new Schema({
  recipient: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  sender: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  subject: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
})

const Notification = model('Notification', notificationSchema)

export default Notification;