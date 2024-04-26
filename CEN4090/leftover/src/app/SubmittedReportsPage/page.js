'use client';
import React, { useEffect, useState, useCallback } from 'react';

const UserPage = () => {
  const [reports, setReport] = useState([]);

  const fetchReports = useCallback(async () => {
    const response = await fetch('http://localhost:8080/reports/all', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setReport(data);
    } else {
      console.error('Failed to fetch reports');
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const selectReport = async (reportID) => {
    const response = await fetch(`http://localhost:8080/select_report/${reportID}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      window.location.href = '/report'; 
    } else {
      alert("Failed to select report");
    }
  };

  const reportStyle = {
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
        {/* <img src="/warning.png" alt="Report" style={{ width: '20px', marginRight: '5px' }} /> */}
        {/* <button onclick = "window.location.href='/ReportPage'">Report this Recipe</button> */}
        {/* <button onClick = {()=> reportRecipe(recipeDetails.recipe_id)}>Report this recipe</button> */}
        {/* <li><Link to={{pathname: '/ReportPage', state: { recipeId: recipeDetails.recipe_id, author: recipeDetails.author }}}>Report this Recipe</Link></li> */}
        <Image
          src="/warning.png"
          width = {20}
          height = {20}
          />
        <Link style = {{backgroundColor: '#F0F0F0', color: 'red'}}href="/ReportPage">Report this Recipe</Link>

      </div>
    </div>
  );
};


export default UserPage;