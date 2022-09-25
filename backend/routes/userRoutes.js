import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, generateToken } from '../utils.js';

const userRouter = express.Router()

// when there is an error in async function, handle it in server.js 
userRouter.post(
    '/signin', expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        
        //if user exists check the password matches.  Use bcrypt package to decrypt the password. bcrypt.compareSync takes two 
        //parameters to compare the password (req.body.password -plain password as user entered, user.password - encryped password from user model)
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
              // Now send the data to the frontend. You need to install jsonwebtoken which is to be send along with following data.
              res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
              });
              return;
            }
          }
          res.status(401).send({ message: 'Invalid email or password' });
        })
      );

//Create an API for signup

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);
  
//API for user profile

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter;

// use this data utils.js

