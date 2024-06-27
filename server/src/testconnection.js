import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Obter o caminho atual do módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolver o caminho para o arquivo .env
const envPath = path.resolve(__dirname, '../.env');

// Verificar o diretório atual
console.log(`Current directory: ${process.cwd()}`);
console.log(`.env path: ${envPath}`);

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config({ path: envPath });

// Verificar se as variáveis de ambiente foram carregadas
console.log('Environment Variables:', process.env);

const mongoUri = process.env.MONGODB_URI;
console.log(`Tentando conectar ao MongoDB com a URI: ${mongoUri}`);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });
