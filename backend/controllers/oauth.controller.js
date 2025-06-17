import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signUp = async function (req,res) {

  try {
    const {name,userName,email,password} = req.body;

    //check for existing userName

    const existingUser = await User.findOne( {userName} )

    if(existingUser) {
      res.status(400).json({message: 'username already exists'});
    }

    //validate email and check for existing email
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = regex.test(email);
    if(!validEmail) {
      res.status(400).json({message: 'Invalid Email'})
    }

    const existingEmail = await User.findOne( {email} )
    if(existingEmail) {
      res.status(400).json({message: 'username already exists'});
    }

    //validate password and hash
    regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    const validPassword = regex.test(password);

    if(!validPassword) {
      res.status(400).json({message: 'Invalid password'});
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
  const user = req.body;

  try {
    
  } catch (error) {
    console.error(`Error occured in oauth login: ${error.message}}`);
  }
}

export const logOut = async function (req,res) {
  res.json({
    message: 'Reached logOut endpoint'
  })
}

