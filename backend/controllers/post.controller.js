import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import { v2 as cloudinary } from "cloudinary";

export const getPosts = async function (req, res) {
  const user = req.user;

  try {
    const posts = await Post.find({ parentId: null })
      .sort({ createdAt: -1 })
      .populate({
        path: "poster",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "poster",
          select: "-password",
        },
      });

    if (posts.length === 0)
      return res.status(200).json({ error: "No liked posts", data: [] });

    res.status(200).json({ message: "Posts Found", data: posts });
  } catch (error) {
    console.error(`Error occured in getting posts: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const getLikedPosts = async function (req, res) {
  const { userName } = req.params;
  const user = await User.findOne({ userName });

  try {
    const likedPosts = user.likedPosts;
    const posts = await Post.find({ _id: { $in: likedPosts } })
      .sort({ createdAt: -1 })
      .populate({
        path: "poster",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "poster",
          select: "-password",
        },
      });

    if (posts.length === 0)
      return res.status(200).json({ error: "No liked posts", data: [] });

    res.status(200).json({ message: "Posts Found", data: posts });
  } catch (error) {
    console.error(`Error occured in getting posts: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const getFollowingPosts = async function (req, res) {
  const user = req.user;

  try {
    const followingUsers = user.following;
    const followingUserPosts = await Post.find({
      poster: { $in: followingUsers },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "poster",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "poster",
          select: "-password",
        },
      });

    if (followingUserPosts.length === 0)
      return res.status(200).json({ error: "No posts available", data: [] });

    res.status(200).json({ message: "Posts Found", data: followingUserPosts });
  } catch (error) {
    console.error(
      `Error occured while fetching following posts: ${error.message}`
    );
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserPosts = async function (req, res) {
  const user = req.user;
  const { userName } = req.params;

  try {
    const otherUser = await User.findOne({ userName });

    if (!otherUser) return res.status(404).json({ error: "User not found" });

    const otherUserPosts = await Post.find({ poster: otherUser._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "poster",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "poster",
          select: "-password",
        },
      });

    if (!otherUserPosts)
      return res.status(404).json({ error: "User has no posts", data: [] });

    return res
      .status(200)
      .json({
        message: "User posts fetched successfully",
        data: otherUserPosts,
      });
  } catch (error) {
    console.error(`Error occured in fetching user posts: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const createPost = async function (req, res) {
  const userId = req.user._id;
  const { text } = req.body;
  let { img } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!text && !img)
      return res
        .status(400)
        .json({
          error:
            "Post can only be created if one of or both image and text are provided",
        });

    if (img) {
      const uploadedImg = await cloudinary.uploader.upload(img);
      img = uploadedImg.secure_url;
      const imgId = uploadedImg.public_id;
    }

    const post = new Post({
      poster: userId,
      text,
      img,
    });

    await post.save();

    return res
      .status(200)
      .json({ message: "Post created successfully", data: post });
  } catch (error) {
    console.error(`Error occured in creating post: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const likePost = async function (req, res) {
  const userId = req.user._id;
  const postId = req.params.id;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      const updatedLikes = post.likes.filter(
        (like) => like.toString() !== userId.toString()
      );

      return res
        .status(200)
        .json({ message: "Post unliked", data: updatedLikes });
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      const notification = new Notification({
        from: userId,
        to: post.poster,
        type: "like",
      });

      await notification.save();

      const updatedLikes = [...post.likes, userId];
      return res
        .status(200)
        .json({ message: "Post liked", data: updatedLikes });
    }
  } catch (error) {
    console.error(
      `Error occured in liking the post: PostId: ${postId}, error: ${error.message}`
    );
    return res.status(500).json({ error: error.message });
  }
};

export const commentOnPost = async function (req, res) {
  const userId = req.user._id;
  const postId = req.params.id;
  const { text } = req.body;
  let { img } = req.body;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!text && !img)
      return res
        .status(400)
        .json({
          error: "At least an image or a text in needed to create a comment",
        });

    if (img) {
      const uploadedImg = await cloudinary.uploader.upload(img);
      img = uploadedImg.secure_url;
    }

    const comment = new Post({
      poster: userId,
      text,
      img,
      parentId: postId,
    });

    const notification = new Notification({
      from: userId,
      to: post.poster,
      type: "comment",
    });

    await comment.save();
    await notification.save();
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    await comment.populate("poster", "name userName profileImage");

    return res
      .status(200)
      .json({ message: "Commented Successfully", data: comment });
  } catch (error) {
    console.error(`Error occured while commenting on post: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const deletePost = async function (req, res) {
  const userId = req.user._id;
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ error: "Post not found" });

  try {
    if (userId.toString() !== post.poster.toString())
      return res
        .status(401)
        .json({
          error:
            "Unautharized access, only author of the post can delete the post",
        });

    if (post.img) {
      const img = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(img);
    }

    if (post.parentId !== null) {
      const parentPost = await Post.findByIdAndUpdate(post.parentId, {
        $pull: { comments: postId },
      });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!post.parentId) {
      await Post.deleteMany({ parentId: postId }); // Delete all replies
    }

    res.status(200).json({ message: "Post deleted", data: deletedPost });
  } catch (error) {
    console.error(
      `Error occured in deleting a post: PostId: ${postId}, error: ${error.message}`
    );
    return res.status(500).json({ error: error.message });
  }
};
