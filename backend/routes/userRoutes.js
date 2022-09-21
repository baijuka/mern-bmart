import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils.js';

const userRouter = express.Router()

// when there is an error in async function, handle it in server.js 
userRouter.post(
    '/signin', expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        
        //if user exists check the password matches.  Use bcrypt package to decrypt the password. bcrypt.compareSync takes two 
        //parameters to compare the password (req.body.password -plain password as user entered, user.password - encryped password from user model)
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // you need to install jsonwebtoken which is to be send along with following data.
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
      
      export default userRouter;

      // use this data utils.js

