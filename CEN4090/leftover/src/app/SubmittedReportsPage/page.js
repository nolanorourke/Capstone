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
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h2>All Reports</h2>
        <div style={{ overflowY: 'auto' }}>
          {reports.map((report, index) => (
            <div key={index} style={reportStyle} onClick={() => selectReport(report.report_id)}>
              {report.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;