'use client';
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    isChef: false,
  });



  const handleChange = (event) => {
    const { name, type, checked } = event.target;
    const value = type === "checkbox" ? checked : event.target.value;
    setFormData(prevFormData => ({
       ...prevFormData,
       [name]: value,
    }));
   };
   

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      const data = await response.json();
      // Ensure your app's base URL is correctly prepended if necessary
      window.location.href = '/user';
    } else {
      console.error('Registration failed');
    }
  };
  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-primary flex flex-col rounded-lg shadow-2xl space-y-1 text-left p-4 mt-20">
          <h1 className="text-3xl font-signature mb-6 text-muted">Create your Account</h1>
          <div className="flex row space-x-2">
            <div className="flex-1">
              <label className="font-bold text-lg text-muted">First Name</label>
              <input
                className="border border-accent rounded-lg px-1 py-1"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="font-bold text-lg text-muted">Last Name</label>
              <input
                className="border border-accent rounded-lg px-1 py-1"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName} // Corrected to use formData
                onChange={handleChange}
              />
            </div>
          </div>
          <label className="font-bold text-lg text-muted">Email</label>
          <input
            className="border border-accent rounded-lg px-2 py-1"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email} // Corrected to use formData
            onChange={handleChange}
          />
          <label className="font-bold text-lg text-muted">Username</label>
          <input
            className="border border-accent rounded-lg px-2 py-1"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username} // Corrected to use formData
            onChange={handleChange}
          />
          <label className="font-bold text-lg text-muted">Password</label>
          <input
            className="border border-accent rounded-lg px-2 py-1"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password} // Corrected to use formData
            onChange={handleChange}
          />
          <label className="font-bold text-lg text-muted">Confirm Password</label>
          <input
            className="border border-accent rounded-lg px-2 py-1 mb-4"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword} // Corrected to use formData
            onChange={handleChange}
          />
          <div >
            <label className="font-bold text-lg text-muted mr-4">Are you a chef?</label>
            <input type="checkbox" name="isChef" value={formData.isChef} onChange={handleChange} />
          </div>
          <div className='p-4'/>
          <button type="submit" className="bg-secondary hover:bg-muted text-white hover:text-secondary rounded-lg py-2">
            Create Account
          </button>
          <h4 className="pt-4 text-muted text-center">If you already have an account <Link href="/login" className="hover:text-secondary">click here to login</Link></h4>
        </form>
      </div>
      <Image src="/registration.jpg" alt="Registration" width={500} height={400} className="w-1/2 h-full lg:block hidden"/>
    </div>
  );
}

export default RegisterPage;