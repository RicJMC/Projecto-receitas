import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { userRouter } from './routes/users.js';
import { recipesRouter } from "./routes/recipes.js";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para permitir o uso do formato JSON nas requisições
app.use(express.json());

// Middleware para permitir o acesso à API de outros domínios (CORS)
app.use(cors());

// Middleware para as rotas do endpoint de autenticação
app.use("/auth", userRouter);

// Middleware para as rotas do endpoint de receitas
app.use("/recipes", recipesRouter);

// Configurar para servir os arquivos estáticos do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Conexão com o MongoDB Atlas
const mongoUri = process.env.MONGODB_URI;
console.log(`Tentando conectar ao MongoDB com a URI: ${mongoUri}`);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Inicia o servidor na porta 3001
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));