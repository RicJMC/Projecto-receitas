import express from 'express';
import { RecipeModel } from '../models/recipes.js';
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';
import Joi from 'joi';

const router = express.Router();

const recipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string()).required(),
  instructions: Joi.string().required(),
  imageUrl: Joi.string().required(),
  cookingTime: Joi.number().required(),
  userOwner: Joi.string().required()
});

router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve recipes', error });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;
  const recipe = new RecipeModel({
    name,
    ingredients,
    instructions,
    imageUrl,
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

router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/", verifyToken, async (req, res) => {
  const recipe = await RecipeModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.put("/:recipeId", async (req, res) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, ingredients, instructions, imageUrl, cookingTime } = req.body;
  const { recipeId } = req.params;

  try {
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

// New DELETE route to remove a recipe from saved recipes
router.delete("/:recipeID", verifyToken, async (req, res) => {
  const { recipeID } = req.params;
  const { userID } = req.body;

  try {
    const user = await UserModel.findById(userID);
    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeID);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove recipe', error });
  }
});

export { router as recipesRouter };
