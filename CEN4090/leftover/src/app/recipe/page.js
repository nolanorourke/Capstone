'use client';
import React, { useEffect, useState } from 'react';

const RecipePage = () => {
  const [recipeDetails, setRecipeDetails] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const response = await fetch(`http://localhost:8080/recipe`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRecipeDetails(data);
      } else {
        console.error('Failed to fetch recipe details');
      }
    };

    fetchRecipeDetails();
  }, []);

  if (!recipeDetails) {
    return <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '150px auto', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>{recipeDetails.recipe_name}</h2>
      <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
        {recipeDetails.ingredients.map((ingredient, index) => (
          <li key={index} style={{ marginBottom: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
            <strong>{ingredient.food_name}:</strong> {ingredient.quantity} {ingredient.measurement}
          </li>
        ))}
      </ul>
      {recipeDetails.steps && (
          <ol>
            {recipeDetails.steps.map((step, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {`Step ${index + 1}: ${step.description}`}
            </li>
            ))}
          </ol>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center', paddingTop: '10px', borderTop: '2px solid #eee' }}>
        <p>Recipe by: <strong>{recipeDetails.author}</strong></p>
      </div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center' }}>
        <img src="./warning.png" alt="Report" style={{ width: '20px', marginRight: '5px' }} />
        <button onClick = {()=> reportRecipe(recipeDetails.recipe_id, recipeDetails.author, )}>Report this recipe</button>
      </div>
    </div>
  );
};

export default RecipePage;
