import { useEffect, useState } from 'react';
import axios from "axios";
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    console.log("Current userID:", userID); // Add this line
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch recipes.");
      }
    };

    const fetchSavedRecipes = async () => {
      if (!userID) {
        console.error("User ID is missing");
        setErrorMessage("User ID is missing");
        return;
      }
      if (!cookies.access_token) {
        console.error("Access token is missing");
        setErrorMessage("Access token is missing");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        const savedRecipeIds = response.data.savedRecipes;
        const savedRecipeObj = {};
        savedRecipeIds.forEach((id) => (savedRecipeObj[id] = true));
        setSavedRecipes(savedRecipeObj);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch saved recipes.");
      }
    };

    fetchRecipes();
    if (userID) {
      fetchSavedRecipes();
    }
  }, [userID, cookies.access_token]);

  const saveRecipe = async (recipeID) => {
    if (!userID) {
      console.error("User ID is missing");
      setErrorMessage("User ID is missing");
      return;
    }
    if (!cookies.access_token) {
      console.error("Access token is missing");
      setErrorMessage("Access token is missing");
      return;
    }

    try {
      await axios.put(
        "http://localhost:3001/recipes",
        { recipeID, userID },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      setSavedRecipes({ ...savedRecipes, [recipeID]: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save recipe.");
    }
  };

  const removeRecipe = async (recipeID) => {
    if (!userID) {
      console.error("User ID is missing");
      setErrorMessage("User ID is missing");
      return;
    }
    if (!cookies.access_token) {
      console.error("Access token is missing");
      setErrorMessage("Access token is missing");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3001/recipes/${recipeID}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
          data: { userID }
        }
      );
      const newSavedRecipes = { ...savedRecipes };
      delete newSavedRecipes[recipeID];
      setSavedRecipes(newSavedRecipes);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to remove recipe.");
    }
  };

  return (
    <div>
      <h1>Recipes</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              {savedRecipes[recipe._id] ? (
                <button onClick={() => removeRecipe(recipe._id)}>Remove from saved</button>
              ) : (
                <button onClick={() => saveRecipe(recipe._id)}>Save recipe</button>
              )}
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <div>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <p>Cooking time: {recipe.cookingTime} minutes</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};