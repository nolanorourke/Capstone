'use client';
import React, { useEffect, useState, useCallback } from 'react';

const UserPage = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = useCallback(async () => {
    const response = await fetch('http://localhost:8080/recipes/all', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setRecipes(data);
    } else {
      console.error('Failed to fetch recipes');
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const selectRecipe = async (recipeId) => {
    const response = await fetch(`http://localhost:8080/select_recipe/${recipeId}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      window.location.href = '/recipe'; 
    } else {
      alert("Failed to select recipe");
    }
  };

  const recipeStyle = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    height: '100vh', 
    paddingTop: '100px',
  };

  const sectionStyle = {
    width: '100%',
    maxWidth: '600px', 
    height: '700px',
    overflowY: 'auto',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h2>All Recipes</h2>
        <div style={{ overflowY: 'auto' }}>
          {recipes.map((recipe, index) => (
            <div key={index} style={recipeStyle} onClick={() => selectRecipe(recipe.recipe_id)}>
              {recipe.recipe_name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;