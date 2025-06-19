import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async function(req,res) {
  const {userName} = req.params;
  try {
    const user = await User.findOne( {userName} ).select('-password');

    if(!user) {
      return res.status(404).json({error: 'User not found'});
    }
    
    res.status(200).json({message: 'User fetched successfully',data:user});

  } catch (error) {
    console.error(`Error occured in fetching user: ${error.message}`);
    return res.status(500).json({error: 'server error'})
  }
}

export const followUnfollowUser = async function(req,res) {
  const { id } = req.params;
  const otherUser  = await User.findById(id).select('-password');
  const currUser = req.user;

  if(!otherUser) {
    return res.status(404).json({error: 'User not found'})
  }

  if(!currUser) {
    return res.status(401).json({error: 'User unauthorized'})
  }

  if(currUser._id.toString() === id) {
    return res.status(400).json({error: 'You cannot follow/unfollow yourself'})
  }

  const isFollowing = otherUser.followers.includes(currUser._id)
  try {
    if(isFollowing) {
      //unfollow the user
      await User.findByIdAndUpdate(id, {$pull: {followers: currUser._id}});
      await User.findByIdAndUpdate(currUser._id, {$pull: {following: id}});
      return res.status(200).json({message: "User unfollowed successfully", data: otherUser._id}) 
    } else {
      //Follow the user
      await User.findByIdAndUpdate(id, { $push: {followers: currUser._id}});
      await User.findByIdAndUpdate(currUser._id, { $push: {following: id}});
      // Send notification to the user 

      const notification = new Notification({
        to: id,
        from: currUser._id,
        type: 'follow',
      })

      await notification.save();

      return res.status(200).json({message: "User followed successfully", data: otherUser._id});
    }
  } catch (error) {
    console.error(`Error occured in follow/unfollow: ${error.message}`);
    return res.status(500).json({error: error.message});
  }
}

export const updateProfile = async function(req,res) {
  let { name, userName, email, currentPassword, newPassword, bio, link } = req.body;
  const { profileImage, bannerImage } = req.body;

  const userId = req.user._id;
  
  try {
    let user = await User.findById(userId);

    if(!user) {
      return res.status(404).json({error: 'User not found'});
    }

    //Password validation
    if((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
      return res.status(400).json({error: 'Both current and new password are required'});
    }

    if(currentPassword && newPassword) {

      if(currentPassword === newPassword) {
        return res.status(400).json({error: 'Current password and new password cannot be the same'})
      }

      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      const validPassword = regex.test(newPassword);
      if(!validPassword) {
        return res.status(400).json({error: 'Invalid password format'});
      }

      const isPasswordCorrect = bcrypt.compare(currentPassword, user.password);

      if(!isPasswordCorrect) {
        return res.status(400).json({error: 'Current password is incorrect'});
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      newPassword = hashedPassword; // Update the password
      await user.save();
    }

    //Profile Image
    if(profileImage) {
      if(user.profileImage) {
        await cloudinary.uploader.destroy(user.profileImage.split('/').pop().split('.')[0]);
      }

      const uploadedProfileImage = await cloudinary.uploader.upload(profileImage);
      profileImage = uploadedProfileImage.secure_url;
    }

    //Banner Image
    if(bannerImage) {
      if(user.bannerImage) {
        await cloudinary.uploader.destroy(user.bannerImage.split('/').pop().split('.')[0]);
      }
      const uploadedBannerImage = await cloudinary.uploader.upload(bannerImage);
      bannerImage = uploadedBannerImage.secure_url;
    }

    if(userName) {
      const doesExist = await User.findOne({ userName });
      if(doesExist) return res.status(400).json({error: 'Username already exists'});
    }

    if(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/
      const valid = regex.test(email);
      if(!valid) return res.status(400).json({error: 'Invalid email format'})
    }

    console.log('hello');

    user.name = name || user.name;
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.password = newPassword || user.password;
    user.profileImage = profileImage || user.profileImage;
    user.bannerImage = bannerImage || user.bannerImage;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();

    user.password = null;

    return res.status(200).json({message: 'user profile updated', data: user});

  } catch (error) {
    console.error(`Error occured in updating profile: ${error.message}`);
    return res.status(500).json({error: error.message});
  }
}

export const getSuggestedUsers = async function(req,res) {

  try {
    const user = req.user;
    const usersFollowedByMe = await User.findById(user._id).select('following');
    const users = await User.aggregate([
      {
        $match: {
          _id: {$ne: user._id}
        },
      },
      {$sample: {size: 10}}, // Randomly select 10 users
    ])

    const filteredUsers = users.filter(u => !usersFollowedByMe.following.includes(u._id.toString()));
    const suggestedUsers = filteredUsers.slice(0,4); // Limit to 4 suggested users

    suggestedUsers.forEach(user => user.password = null); // Remove password from suggested users

    if(suggestedUsers.length === 0) {
      return res.status(404).json({message: 'No suggested users found'});
    }

    res.status(200).json({message: 'Suggested users fetched successfully', data: suggestedUsers});

  } catch (error) {
    console.error(`Error occured in getting suggested users: ${error.message}`);
    return res.status(500).json({error: error.message});
  }
}