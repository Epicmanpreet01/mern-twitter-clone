import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signUp = async function (req,res) {

  try {
    const {name,userName,email,password} = req.body;

    const existingUser = await User.findOne( {userName} ).select('-password');

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = regex.test(email);

    const existingEmail = await User.findOne( {email} ).select('-password');
    regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    const validPassword = regex.test(password);

    if(existingEmail || existingUser) {
      return res.status(400).json({message: 'User alreadyy exists'})
    }

    if(!validEmail || !validPassword) {
      return res.status(400).json({message: 'Invalid email or password'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //create valid newUser element
    const newUser = new User({
      userName,
      name,
      email,
      password: hashedPassword
    });

    if(newUser) {
      generateTokenAndSetCookie(newUser._id,res);
      await newUser.save();

      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        userName: newUser.userName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImage: newUser.profileImage,
        bannerImage: newUser.bannerImage,
      })
    } else {
      res.status(400).json({message: 'Invalid user data'});
    }
  } catch (error) {
    console.error(`Error occured in signUp: ${error.message}`);
    res.status(500).json({message: 'Server error'});
  }

}

export const logIn = async function (req,res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne( {email} );
    if(user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if(checkPassword) {
        generateTokenAndSetCookie(user._id, res);
        return res.status(201).json({
          _id: user.id,
          name: user.name,
          userName: user.userName,
          email: user.email,
          followers: user.followers,
          following: user.following,
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
        });
      } else {
        return res.status(400).json({message: 'Invalid credentials'});
      }
    } else {
      return res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    console.error(`Error occured in oauth login: ${error.message}}`);
    return res.status(500).json({message: 'Server error'});
  }
}

export const logOut = async function (req,res) {
  try {
    res.cookie('jwt','', {
      maxAge: 0
    })
    return res.status(200).json({message: 'Logged out successfully'});
  } catch (error) {
    console.error(`Error occured in logOut: ${error.message}`);
  }
}

export const getCurrUser = function (req,res) {
  try {

    const user = req.user;

    if(!user) {
      return res.status(401).json({message: "Unautharized Access"});
    }

    return res.status(200).json({
      _id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      bannerImage: user.bannerImage,
    })

  } catch (error) {
    console.error(`Error occured while fetching current user: ${error.message}`);
    return res.status(500).json({message: 'Server Error'});
  }
}