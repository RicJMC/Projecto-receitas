import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from '../models/recipes.js';
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';

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
router.post('/', verifyToken, async (req, res) => {
  const { name, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;

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
  if (!imageUrl) {
    return res.status(400).json({ message: 'Missing required field: imageUrl' });
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
    imageUrl,
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


// Rota para buscar os IDs das receitas salvas pelo usuário
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    // Busca o usuário pelo ID e retorna os IDs das receitas salvas
    const user = await UserModel.findById(req.params.userID)
    res.json({ savedRecipes: user?.savedRecipes })
    

  } catch (error) {
    res.json(error)
  }
})
// // Rota para buscar as receitas salvas pelo usuário
// router.get("/savedRecipes/:userID", async (req, res) => {
//   try {
//   const user = await UserModel.findById(req.params.userID);
//   const savedRecipes = await RecipeModel.find({
//   _id: { $in: user.savedRecipes }
//   });
//     res.json({ savedRecipes });
//   } catch (error) {
//   res.status(500).json({ error: error.message });
//   }
//   });
//save a recipe

// router.put("/:recipeId", async (req, res) => {
//   const { name, ingredients, instructions, imageUrl, cookingTime } = req.body;
//   const { recipeId } = req.params;

//   try {
//     // Busca a receita pelo ID e atualiza os dados
//     const updatedRecipe = await RecipeModel.findByIdAndUpdate(recipeId, {
//       name,
//       ingredients,
//       instructions,
//       imageUrl,
//       cookingTime
//     }, { new: true });

//     res.json(updatedRecipe);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update recipe', error });
//   }
// });


router.put("/", verifyToken, async (req, res) => {
  const recipe = await RecipeModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    console.log("Saved recipe: ", recipe);
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.log("Error saving recipe: ", err);
    res.status(500).json(err);
  }
});


// Rota para buscar as receitas salvas pelo usuário
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes }
    });
    res.json({ savedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar uma receita
router.put("/:recipeId", async (req, res) => {
  const { name, ingredients, instructions, imageUrl, cookingTime } = req.body;
  const { recipeId } = req.params;

  try {
    // Busca a receita pelo ID e atualiza os dados
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(recipeId, {
      name,
      ingredients,
      instructions,
      imageUrl,
      cookingTime
    }, { new: true });

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recipe', error });
  }
});
export { router as recipesRouter };