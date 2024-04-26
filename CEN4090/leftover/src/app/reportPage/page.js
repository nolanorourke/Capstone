'use client';
import React, { useEffect, useState } from 'react';

const ReportPage = () => {
    const[reportTitle, setReportTitle] = useState('');
    const[reportDescription, setReportDescription] = useState('');
 
    useEffect(() => {
        console.log('Recipe ID:', recipe_id);
        console.log('Author:', author);
      }, [recipe_id, author]);
      
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reportTitle.trim() || !reportDescription.trim()) {
      console.error('Report title and descripton cannot be blank');
      return;
    }

    // Constructing the recipe data
    const reportData = {
        report_title: reportTitle,
        description:reportDescription
    };

    try {
        // Sending the recipe data to the backend
        const response = await fetch('http://localhost:8080/addreport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(reportData),
        });

        if (response.ok) {
            fetchChefRecipes();
            // Recipe added successfully
            console.log('Report added successfully');
            // Resetting form fields or any other necessary actions
        } else {
            // Handle error response
            console.error('Failed to add report');
        }
    } catch (error) {
        // Handle fetch error
        console.error('Error adding reoprt:', error);
    }
};


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', marginTop: '20px', width: '100%', flexWrap: 'wrap' }}>
      <div style={{ maxWidth: '600px', width: '100%', height: '700px', overflowY: 'auto', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 align="center">Create Report</h2>
        <input
          type="text"
          placeholder="Title"
          style={{ width: 'calc(100%)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          onChange={(e) => setReportTitle(e.target.value)}
        />
        <h2 align="center">Description</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <textarea style={{ width: 'calc(100%)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder= 'Enter report title and author with report...' onChange={(e) => setReportDescription(e.target.value)}/> 
        </div>
        <button onClick={handleSubmit}  style={{ padding: '10px', border: 'none', marginTop: '50px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', transition: 'background-color 0.3s' }}>Submit Report</button>
      </div>
    </div>
    </div>
);
};

export default ReportPage
