import User from '../models/user.model.js';

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
  const otherUser  = await User.findById(id);
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
  const user = req.user;
  const newUser = req.body;

  if(!user) {
    return res.status(401).json({error: 'User unauthorized'});
  }

  if(!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({error: 'No data provided to update'});
  }

  const doesExist = await User.findOne({userName: newUser.userName});
  if(doesExist && doesExist._id.toString() !== user._id.toString()) {
    return res.status(400).json({error: 'Username already exists'});
  }

  const userId = user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, newUser, {new: true}).select('-password');

    res.status(200).json({message: 'Profile updated successfully', data: updatedUser});
    
  } catch (error) {
    console.error(`Error occured in updating profile: ${error.message}`);
    return res.status(500).json({error: error.message});
  }
}

export const getSuggestedUsers = async function(req,res) {

  try {
    const user = req.user;
    const followedUserIds = (await User.find( {_id: {$in: user.following}} ).select('_id')).map(user => user._id.toString());
    const suggestedUsers = await User.find({
      _id: { $nin: [...followedUserIds, user._id.toString()] }
    }).select('-password').limit(10);

    res.status(200).json({message: 'Suggested users fetched successfully', data: suggestedUsers});

  } catch (error) {
    console.error(`Error occured in getting suggested users: ${error.message}`);
    return res.status(500).json({error: error.message});
  }
}