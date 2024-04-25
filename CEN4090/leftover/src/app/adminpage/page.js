'use client';
import React, { useEffect, useState, useCallback } from 'react';

const AdminPage = () => {
  const [foods, setFoods] = useState([]);
  const [addfoods, setaddFoods] = useState({
    food_name: '',
    category: '',
  });
  const [recipes, setRecipes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [reports, setReports] = useState([]);
  const [ingredientsearchTerm, setingredientsearchTerm] = useState('');
  const [recipesearchTerm, setrecipesearchTerm] = useState('');
  const [usersearchTerm, setusersearchTerm] = useState('');
  const [chefsearchTerm, setchefsearchTerm] = useState('');
  const [reportsearchTerm, setreportsearchTerm] = useState('');
  //const [availableReports, setAvailableReports] = useState('');

  const handlefoodChange = (event) => {
    const { name, value } = event.target;
    setaddFoods({ ...addfoods, [name]: value });
   };

  const handlerecipeChange = (event) => {
    const { value } = event.target;
    setrecipesearchTerm(value);
  };
  
  const handleuserChange = (event) => {
    const { value } = event.target;
    setusersearchTerm(value);
  };
  
  const handlechefChange = (event) => {
    const { value } = event.target;
    setchefsearchTerm(value);
  };
  
  const handleingredientChange = (event) => {
    const { value } = event.target;
    setingredientsearchTerm(value);
  };  
  const handleReportChange = (event) =>{
    const {value} = event.target;
    setreportsearchTerm(value);
  }

   const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(addfoods);
    const response = await fetch('http://localhost:8080/addingredient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(addfoods),
    });

    if (response.ok) {
      fetchFoods();
    } else {
      console.error('Failed to Add New Ingredient');
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

  const fetchRecipes = async () => {
    const response = await fetch('http://localhost:8080/recipes', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setRecipes(data);
    } else {
      console.error('Failed to Fetch Recipes');
    }
  };

  useEffect (() => {
    fetchRecipes();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch('http://localhost:8080/getcustomers', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setCustomers(data);
    } else {
      console.error('Failed to Fetch Customers');
    }
    };

  useEffect (() => {
    fetchCustomers();
  }, []);  

  const fetchChefs = async () => {
    const response = await fetch('http://localhost:8080/getchefs', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setChefs(data);
    } else {
      console.error('Failed to Fetch Chefs');
    }
    };

  useEffect (() => {
    fetchChefs();
  }, []);

  const fetchReports = async() =>{
    const response = await fetch('http://localhose:8080', {
      credentials: 'include',
    });
    if (response.ok){
      const data = await response.json();
      setReports(data);
    }
    else
    {
      console.error('Failed to fetch Reports')
    }
  }
  useEffect(() =>{
    fetchReports();
}, []);

  const deleteFromFoods = async(foodName) => {
    const response = await fetch('http://localhost:8080/deleteingredient', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({food_name: foodName})
    });

    if (response.ok) {
      fetchFoods();
    } else {
      console.error('Failed to Remove Ingredient');
    }
  };

  const deleteChefRecipe = async(recipeName) => {
    const response = await fetch('http://localhost:8080/deletechefrecipe', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({recipe_name: recipeName})
    });

    if (response.ok) {
      fetchRecipes();
    } else {
      console.error('Failed to Remove Recipe');
    }
  };

  const deleteChefRole = async(chefName) => {
    const response = await fetch('http://localhost:8080/deletechefrole', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({chef_name: chefName})
    });

    if (response.ok) {
      fetchChefs();
      fetchCustomers();
      fetchRecipes();
      fetchReports();
    } else {
      console.error('Failed to Remove Chef');
    }
  };

  // NOT STARTED YET
  const deleteUser = async(username) => {
    const response = await fetch('http://localhost:8080/deleteuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({user_name: username})
    });

    if(response.ok) {
      fetchCustomers();
    } else {
      console.error('Failed to Remove User')
    }
  };

  function selectReport(reportID) { //this has to be gotten in server.py
    fetch(`http://localhost:8080/select_report/${reportID}`, {
      method: 'POST', // Assuming you're updating to use POST to match session handling
      credentials: 'include', // Important for sessions
    })
    .then(response => {
      if(response.ok) {
        // Navigate to the generic /recipe URL after successful selection
        window.location.href = '/SubmittedReportsPage';
      } else {
        alert("Failed to select report");
      }
    });
  }

  const filteredFoods = foods.filter(food =>
    food.food_name.toLowerCase().includes(ingredientsearchTerm.toLowerCase())
  );

  const filteredRecipes = recipes.filter(recipe =>
    recipe.recipe_name.toLowerCase().includes(recipesearchTerm.toLowerCase())
  );
  
  const filteredUsers = customers.filter(user =>
    user.user_name.toLowerCase().includes(usersearchTerm.toLowerCase())
  );
  
  const filteredChefs = chefs.filter(chef =>
    chef.user_name.toLowerCase().includes(chefsearchTerm.toLowerCase())
  );

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(reportsearchTerm.toLowerCase())
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
    maxWidth: '250px',
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
          <h2 align="center">Add Ingredient</h2>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-primary flex flex-col rounded-lg shadow-2xl space-y-1 text-left p-4">
            <input
              className="border border-accent rounded-lg px-1 py-1"
              type="text"
              name="food_name"
              placeholder="Food Name"
              value={addfoods.food_name}
              onChange={handlefoodChange}
            />
            <input
              className="border border-accent rounded-lg px-1 py-1"
              type="text"
              name="category"
              placeholder="Food Category"
              value={addfoods.category} // Corrected to use formData
              onChange={handlefoodChange}
            />
            <button type="submit" className="bg-secondary hover:bg-muted text-white hover:text-secondary rounded-lg py-2">
              Add
            </button>
          </form>  
          <h2 align="center">All Ingredients</h2>
          <input
            type="text"
            placeholder="Search Foods..."
            value={ingredientsearchTerm}
            onChange={handleingredientChange}
            style={inputStyle}
          />
          <div style={{ overflowY: 'auto' }}>
            {filteredFoods.map((food, index) => (
              <div key={index} style={itemStyle}>
                {food.food_name}
                <button onClick={() => deleteFromFoods(food.food_name)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 align="center">All Recipes</h2>
          <input
            type="text"
            placeholder="Search Recipes..."
            value={recipesearchTerm}
            onChange={handlerecipeChange}
            style={inputStyle}
          />
          <div style={{ overflowY: 'auto' }}>
            {filteredRecipes.map((recipe, index) => (
              <div key={index} style={itemStyle}>
                {recipe.recipe_name}
                <button onClick={() => deleteChefRecipe(recipe.recipe_name)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 align="center">All Users</h2>
          <input
            type="text"
            placeholder="Search Users..."
            value={usersearchTerm}
            onChange={handleuserChange}
            style={inputStyle}
          />
          <div style={{ overflowY: 'auto' }}>
            {filteredUsers.map((user, index) => (
              <div key={index} style={itemStyle}>
                {user.user_name}
                <button onClick={() => deleteUser(user.user_name)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 align="center">All Chefs</h2>
          <input
            type="text"
            placeholder="Search Chefs..."
            value={chefsearchTerm}
            onChange={handlechefChange}
            style={inputStyle}
          />
          <div style={{ overflowY: 'auto' }}>
            {filteredChefs.map((chef, index) => (
              <div key={index} style={itemStyle}>
                {chef.user_name}
                <button onClick={() => deleteChefRole(chef.user_name)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Revoke Chef</button>
              </div>
            ))}
          </div>
        </div>
        <div style={sectionStyle}>
            <h2 align="center">Reports</h2>
            <input
            type="text"
            placeholder = "Search Reports..."
            value={reportsearchTerm}
            onChange = {handleReportChange}
            style={inputStyle}
            />
            <div style={{overflowY: 'auto'}}>
              {filteredReports.map((report, index) =>(
                <div key = {index} style = {itemStyle} onClick={() => selectReport(report.title)}>
                  {report.title}
                </div>
              ))}
            </div>
        </div>

      </div>
    </div>  
  )
}

export default AdminPage    
