'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState(''); // State for storing the error message

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for sessions
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      // Successful login
      window.location.href = `/user`; // Redirect to user page
    } else {
      const errorData = await response.json(); // Assuming the server sends back a JSON payload with an error message
      // Handle specific error responses
      if (response.status === 401) {
        setErrorMsg('Incorrect Username or Password. Please try again.');
      } else if (response.status === 404) {
        setErrorMsg('User not found. Please register an account.');
      } else {
        setErrorMsg('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto bg-primary flex flex-col rounded-lg shadow-2xl space-y-1 text-left p-4 mt-20"
        >
          <h1 className="text-3xl font-signature mb-6 text-muted">
            Login to your Account
          </h1>
          <label className="font-bold text-lg text-muted">Username</label>
          <input
            className="border border-accent rounded-lg px-2 py-2"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <label className="font-bold text-lg text-muted">Password</label>
          <input
            className="border border-accent rounded-lg px-2 py-1"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="p-4" />
          <button
            type="submit"
            className="bg-secondary hover:bg-muted text-white hover:text-secondary rounded-lg py-1"
          >
            Login
          </button>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>} {}
          <h4 className="pt-4 text-muted text-center">
            If you need an account{' '}
            <Link href="/register" className="hover:text-secondary">
              click here to register
            </Link>
          </h4>
        </form>
      </div>
      <Image
        src="/login.jpg"
        width={500}
        height={400}
        className="w-1/2 h-full lg:block hidden"
      />
    </div>
  );
}

export default LoginPage;
