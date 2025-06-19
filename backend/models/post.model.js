import mongoose,{ Schema, model } from "mongoose";

const postSchema = new Schema({
  poster: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  text: {
    type: String,
    default: '' 
  },

  img: {
    type: String,
    default: ''
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true
})

const Post = model('Post', postSchema)

export default Post;