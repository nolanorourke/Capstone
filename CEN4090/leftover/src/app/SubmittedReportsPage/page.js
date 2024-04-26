'use client';
import React, { useEffect, useState } from 'react';

const SubmittedReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        const response = await fetch('http://localhost:8080/SubmittedReportsPage', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            setReports(data);
            setLoading(false);
        } else {
            console.error('Failed to fetch reports');
            setLoading(false);
        }
    };

    const handleDeleteReport = async (reportId) => {
        const response = await fetch(`http://localhost:8080/delete_report/${reportId}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
            fetchReports();  // Refresh the list after deleting
        } else {
            alert("Failed to delete report.");
        }
    };

    const handleDeleteRecipe = async (recipeTitle) => {
        const response = await fetch(`http://localhost:8080/delete_recipe/${recipeTitle}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
            fetchReports();  // Refresh the list after deleting the recipe and its associated reports
        } else {
            alert("Failed to delete recipe and related reports.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!reports.length) return <p>No reports found for the selected recipe title.</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '100px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center' }}><strong>Reports</strong></h2>
            {reports.map((report, index) => (
                <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', textAlign: 'center' }}>
                    <h3><strong>Title: </strong>{report.title}</h3>
                    <p><strong>Report ID:</strong> {report.report_id}</p>
                    <p><strong>Recipe Name:</strong> {report.recipe_title}</p>
                    <p><strong>Reporter:</strong> {report.reporter}</p>
                    <p><strong>Details:</strong> {report.report}</p>
                    <div style={{ marginTop: '10px' }}>
                        <button onClick={() => handleDeleteReport(report.report_id)} style={{ marginRight: '10px', padding: '5px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}>Appeal</button>
                        <button onClick={() => handleDeleteRecipe(report.recipe_title)} style={{ padding: '5px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Remove</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubmittedReportsPage;