import mongoose,{ Schema, model } from "mongoose";

const tweetSchema = new Schema({
  poster: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  likes: {
    type: [mongoose.Types.ObjectId]
  },
  comments: {
    type: [mongoose.Types.ObjectId]
  },
  views: {
    type: [mongoose.Types.ObjectId]
  }
}, {
  timestamps: true
})

const Tweet = model('Tweet', tweetSchema)

export default Tweet;