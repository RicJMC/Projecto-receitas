import { useEffect, useState } from 'react';
import axios from "axios";
import { useGetUserID } from '../hooks/useGetUserID';

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState({})
  const [errorMessage, setErrorMessage] = useState(null);
  const userID = useGetUserID();

  useEffect(() => {

    const fetchRecipe = async () => {
      try {
         const response = await axios.get(
           "http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch recipes.");
      }
    }

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
        const savedRecipeIds = response.data.savedRecipes;
        const savedRecipeObj = {};
        savedRecipeIds.forEach((id) => (savedRecipeObj[id] = true)); // create object with recipe IDs as keys and true as values
        setSavedRecipes(savedRecipeObj);
      } catch (error) {
        console.log(error);
        setErrorMessage("Failed to fetch saved recipes.");
      }
    }

    fetchRecipe();
    fetchSavedRecipes();

  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {
          recipeID,
          userID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setSavedRecipes({ ...savedRecipes, [recipeID]: true }); // update savedRecipes state with new recipe ID
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to save recipe.");
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);
  return (
    <div>
      <h1>Recipes</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
        
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)} disabled={savedRecipes[recipe._id]}>
                {savedRecipes[recipe._id] ? 'Saved!' : 'Save recipe'}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <div>
              <img src={recipe.imageUrl} alt={recipe.name}></img>
              <p> Cooking time: {recipe.cookingTime} (minutes)</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}