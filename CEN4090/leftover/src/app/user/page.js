
// pages/welcome.js
'use client';
import React, { useEffect, useState, useCallback } from 'react';

const UserPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pantryItems, setPantryItems] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPantryItems = useCallback(async () => {
    const response = await fetch('http://localhost:8080/pantry/items', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setPantryItems(data);
    } else {
      console.error('Failed to fetch pantry items');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const response = await fetch('http://localhost:8080/food_category', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    } else {
      console.error('Failed to fetch categories');
    }
  }, []);

  const fetchAvailableRecipes = useCallback(async () => {
    const response = await fetch('http://localhost:8080/recipes/available', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setAvailableRecipes(data);
    } else {
      console.error('Failed to fetch available recipes');
    }
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await fetch('http://localhost:8080/foods', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setFoods(data);
      } else {
        console.error('Failed to fetch foods');
      }
    };

    fetchFoods();
    fetchCategories();
    fetchPantryItems();
    fetchAvailableRecipes(); 
  }, [fetchPantryItems, fetchAvailableRecipes]);
  
  function selectRecipe(recipeId) {
    fetch(`http://localhost:8080/select_recipe/${recipeId}`, {
      method: 'POST', // Assuming you're updating to use POST to match session handling
      credentials: 'include', // Important for sessions
    })
    .then(response => {
      if(response.ok) {
        // Navigate to the generic /recipe URL after successful selection
        window.location.href = '/recipe';
      } else {
        alert("Failed to select recipe");
      }
    });
  }

  const addToPantry = async (foodName) => {
    const response = await fetch('http://localhost:8080/pantry/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ food_name: foodName }),
    });

    if (response.ok) {
      fetchPantryItems();
      fetchAvailableRecipes();
    } else {
      console.error('Failed to add food to pantry');
    }
  };

  const removeFromPantry = async (foodName) => {
    const response = await fetch('http://localhost:8080/pantry/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ food_name: foodName }),
    });

    if (response.ok) {
      fetchPantryItems();
      fetchAvailableRecipes();
    } else {
      console.error('Failed to remove food from pantry');
    }
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFoods = foods.filter(food => 
    food.food_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? food.food_type === selectedCategory : true)
  );

  const sectionContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '100px',
    marginTop: '20px',
    width: '100%',
    flexWrap: 'wrap',
  };

  const sectionStyle = {
    maxWidth: '300px',
    width: '100%',
    height: '700px', 
    overflowY: 'auto', 
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
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

  const buttonStyle = {
    padding: '5px 10px',
    fontSize: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
      <div style={sectionContainerStyle}>
        <div style={sectionStyle}>
          <h2>Ingredients</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={inputStyle}
            />
            <select
              onChange={handleCategoryChange}
              value={selectedCategory}
              style={{
                flex: 1,
                width: '100px',
                height: '47px',
                padding: '0px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {filteredFoods.map((food, index) => (
              <div key={index} style={itemStyle}>
                {food.food_name}
                <button onClick={() => addToPantry(food.food_name)} style={buttonStyle}>Add to Pantry</button>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>My Pantry</h2>
          <div style={{ overflowY: 'auto' }}>
            {pantryItems.map((item, index) => (
              <div key={index} style={itemStyle}>
                {item.food_name}
                <button onClick={() => removeFromPantry(item.food_name)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>Available Recipes</h2>
          <div style={{ overflowY: 'auto' }}>
            {availableRecipes.map((recipe, index) => (
              <div key={index} style={{ ...itemStyle, cursor: 'pointer', color: 'blue' }} onClick={() => selectRecipe(recipe.recipe_id)}>
                {recipe.recipe_name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;