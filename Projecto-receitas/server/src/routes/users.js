import express from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from "../models/Users.js";
import bodyParser from 'body-parser';

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post("/register", async (req, res) => {
  
  const{ username, password } = req.body;
  const user = await UserModel.findOne({ username: username })
  
  if (user) {
  return res.json({message: "user already exists!"})
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  

  const newUser = new UserModel({ username, password: hashedPassword })
  newUser.save();

  

  res.json({ message: "user registered sucessfully!"});

})

router.post("/login", async (req, res) => {
  const{ username, password } = req.body;
  const user = await UserModel.findOne({ username: username })

  if (!user) {
    return res.json({message: "user does not exist!"})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "username or password is incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, "secret")
  res.json({token, userID: user._id})
  
})


export { router as userRouter }

