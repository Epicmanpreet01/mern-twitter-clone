import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectedRoutes = async function (req,res,next) {
  try {
    const token = req.cookies.jwt;
    if(!token) {
      req.user = null
      return res.status(401).json({error: 'Unauthorized access, please login to continue'});
      // return res.redirect('/login');
    }
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
    if(isTokenValid) {
      const user = await User.findById(isTokenValid.userId).select('-password');
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(`Error occured while routing protected routes: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}