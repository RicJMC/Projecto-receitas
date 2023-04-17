import express from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from "../models/Users.js";
import bodyParser from 'body-parser';

const router = express.Router()

// Adicionado body-parser para poder ler as informações enviadas pelo cliente
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// Rota para registar novo usuário
router.post("/register", async (req, res) => {
  
  const{ username, password } = req.body;
  const user = await UserModel.findOne({ username: username })
  
  // Verificar se o usuário já existe
  if (user) {
    return res.json({message: "user already exists!"})
  }
  
  // Hash da password antes de salvar no banco de dados
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Criar novo usuário e salvar no banco de dados
  const newUser = new UserModel({ username, password: hashedPassword })
  newUser.save();

  res.json({ message: "user registered sucessfully!"});

})

// Rota para fazer login
router.post("/login", async (req, res) => {
  const{ username, password } = req.body;
  const user = await UserModel.findOne({ username: username })

  // Verificar se o usuário existe
  if (!user) {
    return res.json({message: "user does not exist!"})
  }

  // Verificar se a password está correta
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "username or password is incorrect!" });
  }

  // Criar token de autenticação para o usuário
  const token = jwt.sign({ id: user._id }, "secret")

  // Enviar o token e o ID do usuário no response
  res.json({token, userID: user._id})
  
})

export { router as userRouter }

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

