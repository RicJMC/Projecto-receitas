import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js";
import bodyParser from 'body-parser';
import Joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Add body-parser to read client-sent information
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Validation schema for registration
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

// Route to register a new user
router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully!" });
});

// Validation schema for login
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

// Route to log in
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "User does not exist!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Username or password is incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: '1h' }); // Optionally, add an expiration time
  res.json({ token, userID: user._id });
});

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export { router as userRouter };
