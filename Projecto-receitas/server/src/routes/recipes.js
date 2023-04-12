import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from '../models/recipes.js';
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve recipes', error });
  }
});

router.post('/', async (req, res) => {
  const { name, ingredients, instructions, imageURL, cookingTime, userOwner } = req.body;

  if (!name || !ingredients || !instructions || !imageURL || !cookingTime || !userOwner) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const recipe = new RecipeModel({
    name,
    ingredients,
    instructions,
    imageURL,
    cookingTime,
    userOwner,
  });

  try {
    const savedRecipe = await recipe.save();
    res.json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save recipe', error });
  }
});

router.put("/:recipeId", async (req, res) => {
  const { name, ingredients, instructions, imageURL, cookingTime } = req.body;
  const { recipeId } = req.params;

  try {
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


export { router as recipesRouter };
