import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';

import { userRouter } from './routes/users.js';
import { recipesRouter } from "./routes/recipes.js";

const app = express();

// Middleware para permitir o uso do formato JSON nas requisições
app.use(express.json());

// Middleware para permitir o acesso à API de outros domínios (CORS)
app.use(cors());

// Middleware para as rotas do endpoint de autenticação
app.use("/auth", userRouter);

// Middleware para as rotas do endpoint de receitas
app.use("/recipes", recipesRouter);

// Conexão com o MongoDB Atlas
mongoose.connect("mongodb+srv://receitasapp:FPEZnjRImn5diruo@recipes.nz4fv7v.mongodb.net/recipes?retryWrites=true&w=majority");

// Inicia o servidor na porta 3001
app.listen(3001, () => console.log("Servidor iniciado na porta 3001"));

