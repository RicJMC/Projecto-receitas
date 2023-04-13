import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from '../models/recipes.js';
import { UserModel } from '../models/Users.js';

const router = express.Router();

// Rota para buscar todas as receitas cadastradas
router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve recipes', error });
  }
});

// Rota para criar uma nova receita
router.post('/', async (req, res) => {
  const { name, ingredients, instructions, imageURL, cookingTime, userOwner } = req.body;

  // Verifica se todos os campos obrigatórios foram preenchidos
  if (!name) {
    return res.status(400).json({ message: 'Missing required field: name' });
  }
  if (!ingredients) {
    return res.status(400).json({ message: 'Missing required field: ingredients' });
  }
  if (!instructions) {
    return res.status(400).json({ message: 'Missing required field: instructions' });
  }
  if (!imageURL) {
    return res.status(400).json({ message: 'Missing required field: imageURL' });
  }
  if (!cookingTime) {
    return res.status(400).json({ message: 'Missing required field: cookingTime' });
  }
  if (!userOwner) {
    return res.status(400).json({ message: 'Missing required field: userOwner' });
  }

  // Cria a nova receita a partir dos dados enviados na requisição
  const recipe = new RecipeModel({
    name,
    ingredients,
    instructions,
    imageURL,
    cookingTime,
    userOwner,
  });

  try {
    // Salva a receita no banco de dados e retorna os dados da receita salva
    const savedRecipe = await recipe.save();
    res.json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save recipe', error });
  }
});

// Rota para atualizar uma receita existente
router.put("/:recipeId", async (req, res) => {
  const { name, ingredients, instructions, imageURL, cookingTime } = req.body;
  const { recipeId } = req.params;

  try {
    // Busca a receita pelo ID e atualiza os dados
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(recipeId, {
      name,
      ingredients,
      instructions,
      imageURL,
      cookingTime
    }, { new: true });

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recipe', error });
  }
});

// Rota para buscar os IDs das receitas salvas pelo usuário
router.get("/savedRecipes/ids", async (req, res) => {
  try {
    // Busca o usuário pelo ID e retorna os IDs das receitas salvas
    const user = await UserModel.findById(req.query.userId)
    res.json({savedRecipes: user?.savedRecipes})
  } catch (error) {
    res.json(error)
  }
})
// Rota para buscar as receitas salvas pelo usuário
router.get("/savedRecipes", async (req, res) => {
  try {
    // Busca o usuário pelo ID e busca todas as receitas que possuem ID salvo na lista de receitas salvas do usuário
    const user = await UserModel.findById(req.query.userId)
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes}
    })
    res.json({savedRecipes})
  } catch (error) {
    res.json(error)
  }
})

export { router as recipesRouter };

