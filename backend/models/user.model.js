import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 128,
    select: false // Exclude password from queries by default
  },

  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },

  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },

  profileImage: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  bannerImage: {
    type: String,
    default: ""
  },
  link: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
})

const User = model('User', userSchema)

export default User;