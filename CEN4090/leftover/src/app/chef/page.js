'use client';
import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // use npm install react-select

const ChefPage = () => {
  const [recipeTitle, setRecipeTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [quantity, setQuantity] = useState('');
  const [steps, setSteps] = useState(['']);
  const [chefRecipes, setChefRecipes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    fetchChefRecipes();
    fetchFoods();
  }, []);
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recipeTitle.trim() || ingredients.length === 0 || steps.some(step => !step.trim())) {
      console.error('Recipe title, ingredients, or steps cannot be blank');
      
      return;
    }

    const author = sessionStorage.getItem('username');
    // Constructing the recipe data
    const recipeData = {
        recipe_name: recipeTitle,
        author: author,
        ingredients: ingredients,
        steps: steps.map((step, index) => ({
            step_number: index, 
            step_description: step
        }))
    };

    try {
        // Sending the recipe data to the backend
        const response = await fetch('http://localhost:8080/addrecipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(recipeData),
        });

        if (response.ok) {
            fetchChefRecipes();
            // Recipe added successfully
            console.log('Recipe added successfully');
            // Resetting form fields or any other necessary actions
        } else {
            // Handle error response
            console.error('Failed to add recipe');
        }
    } catch (error) {
        // Handle fetch error
        console.error('Error adding recipe:', error);
    }
};
const fetchChefRecipes = async () => {
  try {
    const response = await fetch('http://localhost:8080/getchefrecipes', { method: 'GET', credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setChefRecipes(data);
    } else {
      console.error('Failed to fetch chef recipes');
    }
  } catch (error) {
    console.error('Error fetching chef recipes:', error);
  }
};


  const deleteRecipe = async (recipeID, event) => {
    try {
      const response = await fetch('http://localhost:8080/deleterecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipe_id: recipeID })
      });
      if (response.ok) {
        fetchChefRecipes();
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  
  const fetchFoods = async () => {
    const response = await fetch('http://localhost:8080/foods', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setFoods(data);
    } else {
      console.error('Failed to Fetch Foods');
    }
  };

  useEffect (() => {
    fetchFoods();
  }, []);
  
  const filteredFoods = foods.filter(food =>
    food.food_name.toLowerCase().includes(ingredientSearchTerm.toLowerCase())
  );

  const handlefoodChange = (selectedOption) => {
    setSelectedIngredient(selectedOption); 
    if (!selectedOption) {
      setIngredientSearchTerm('');
      return;
    }
    setIngredientSearchTerm(selectedOption.value);
  };

  const handleMeasurementChange = (event) => {
    setMeasurement(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const addIngredient = () => {
    // Check if all fields are filled out
    if (ingredientSearchTerm && measurement && quantity) {
      const newIngredient = {
        ing_name: ingredientSearchTerm,
        measurement: measurement,
        quantity: quantity,
      };
      setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
      setIngredientSearchTerm('');
      setMeasurement('');
      setQuantity('');
    } else {
      // Show an error message or handle the empty fields scenario
      console.error('All fields are required');
    }
  };

  function selectRecipe(recipeId) {
    fetch(`http://localhost:8080/select_recipe/${recipeId}`, {
      method: 'POST', 
      credentials: 'include', 
    })
    .then(response => {
      if(response.ok) {
        window.location.href = '/recipe';
      } else {
        alert("Failed to select recipe");
      }
    });
  }

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const handleRecipeSearchChange = (event) => {
    setRecipeSearchTerm(event.target.value);
  };

  const itemStyle = {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px', 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', marginTop: '20px', width: '100%', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '600px', width: '100%', height: '700px', overflowY: 'auto', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2 align="center">Create Recipe</h2>
          <input
            type="text"
            placeholder="Title"
            style={{ width: 'calc(100%)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Select
              placeholder={selectedIngredient ? selectedIngredient.value : "Type Ingredient..."}
              value={ingredientSearchTerm}
              onChange={handlefoodChange}
              options={filteredFoods.map((food, index) => ({
                value: food.food_name,
                label: food.food_name,
              }))}
              isSearchable
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  width: 'calc(107% - 3px)',
                  padding: '4px',
                  marginBottom: '20px',
                  marginRight: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  boxShadow: state.isFocused ? '0 0 0 1px #4CAF50' : 'none', // Custom border color when focused
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black', // Custom placeholder color
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#f0f0f0' : 'white', // Custom background color when selected
                  '&:hover': {
                    backgroundColor: '#f0f0f0', // Custom background color on hover
                  },
                }),
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              style={{ width: 'calc(20% - 3px)', padding: '10px', marginLeft:'25px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={quantity}
              onChange={handleQuantityChange}
              min="0" 
            />
            <select
              style={{ width: 'calc(27% - 1px)', padding: '12px', marginLeft: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
              value={measurement}
              onChange={handleMeasurementChange}
            >
              <option value=""disabled hidden>Measurement</option>
              <option value="Cups">Cups</option>
              <option value="Teaspoons">Tsp</option>
              <option value="Tablespoons">Tbsp</option>
              <option value="Ounces">Ounces</option>
              <option value="Pounds">Pounds</option>
            </select>
            <button onClick={addIngredient} style={{ padding: '10px', marginLeft: '30px', marginBottom: '20px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', transition: 'background-color 0.3s' }}>Add</button>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {ingredients.map((ingredient, index) => (
              <div key={index} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <div>{ingredient.ing_name}</div>
                <div>{ingredient.quantity}</div>
                <div>{ingredient.measurement}</div>
              </div>
            ))}
          </div>
          <h3 align="center">Steps</h3>
          {steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ marginRight: '10px' }}>{index + 1}.</div>
             <textarea value={step} onChange={(e) => handleStepChange(index, e.target.value)} rows="4" style={{ width: 'calc(100% - 30px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          ))}
          <button onClick={addStep} style={{ padding: '10px', marginBottom: '20px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', transition: 'background-color 0.3s' }}>Add Step</button>
          <button onClick={handleSubmit}style={{ padding: '10px', marginBottom: '20px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', transition: 'background-color 0.3s' }}>Save Recipe</button>
        </div>
        <div style={{ maxWidth: '600px', width: '100%', height: '700px', overflowY: 'auto', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2 align="center">My Recipes</h2>
          <input
            type="text"
            placeholder="Search Recipes..."
            style={{ width: 'calc(100% - 20px)', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
            value={recipeSearchTerm}
            onChange={handleRecipeSearchChange}
          />
        <div style={{ overflowY: 'auto' }}>
  {chefRecipes
    .filter(recipe => recipe.recipe_name.toLowerCase().includes(recipeSearchTerm.toLowerCase()))
    .map((recipe, index) => (
      <div key={index} style={{ ...itemStyle, cursor: 'pointer', color: 'blue' }} onClick={() => selectRecipe(recipe.recipe_id)}>
        {recipe.recipe_name}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={(event) => {
              event.stopPropagation(); // Stop event propagation
              deleteRecipe(recipe.recipe_id);
            }}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#f44336',
              color: 'white',
              transition: 'background-color 0.3s'
            }}
          >
            Remove
          </button>
        </div>
      </div>
    ))}
</div>
        </div>
      </div>
    </div>
  );
};

export default ChefPage;
