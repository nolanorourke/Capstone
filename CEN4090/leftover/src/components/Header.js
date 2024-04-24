'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback} from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const Header = () => {
  const [nav, setNav] = useState(false);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  
  const handleResize = () => {
      if (window.innerWidth >= 768) { // Assuming 768px is your md breakpoint
          setNav(false);
      }
  };

async function logoutUser() {
  const response = await fetch('http://localhost:8080/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if (response.ok) {
    console.log('User logged out');
    setUser(null);
    if(setNav) setNav(false);
    router.push('/login');
  } else {
    console.error('Failed to log out user');
  }
}

  const fetchUsersRole = useCallback(async () => {
    const response = await fetch('http://localhost:8080/check_session', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if(data.username){
        setUser(data);
      }else{
        setUser(null);
      }
      setLoading(false);
    } else {
      console.error('Failed to fetch user role');
    }
  }, []);

  // Set up event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Fetch the user's information
    fetchUsersRole();
      // Clean up the event listener
    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);
 return (
    <div className="flex fixed top-0 justify-between items-center bg-primary text-muted w-full h-20 px-4 nav">
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <a
            className="link-underline link-underline-black"
            href="/"
          >
            <Image src="/logo.png" alt="Logo" width={250} height={0}/>
          </a>
        </h1>
      </div>
      <ul className="hidden md:flex">
        {!user ? (
          <>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <>
                <li key='11' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/login">Login</Link>
                </li>
                <li key='12' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </>
        ) : (
          <>
            {user.role === 'admin' && (
              <>
                <li key='13' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/Recipespage">Recipes</Link>
                </li>
                <li key='3' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/adminpage">Admin</Link>
                </li>
                <li key='4' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/user">{user.username}</Link>
                </li>
                <li key='5' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <button onClick={logoutUser}>Logout</button>
                </li>
              </>
            )}
            {user.role === 'chef' && (
              <>
                <li key='14' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/Recipespage">Recipes</Link>
                </li>
                <li key='6' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/chef">Chef</Link>
                </li>
                <li key='7' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/user">{user.username}</Link>
                </li>
                <li key='8' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <button onClick={logoutUser}>Logout</button>
                </li>
              </>
            )}
            {user.role === 'customer' && (
              <>
                <li key='9' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/Recipespage">Recipes</Link>
                </li>
                <li key='10' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/user">{user.username}</Link>
                </li>
                <li key='11' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <button onClick={logoutUser}>Logout</button>
                </li>
              </>
            )}
          </>
        )}
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-primary text-gray-500">
          {!user ? (
            <>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <>
                  <li key='11' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/login" onClick={() => setNav(false)}>Login</Link>
                  </li>
                  <li key='12' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/register" onClick={() => setNav(false)}>Register</Link>
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <>
                  <li key='13' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/Recipespage" onClick={() => setNav(false)}>Recipes</Link>
                  </li>
                  <li key='3' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/adminpage" onClick={() => setNav(false)}>Admin</Link>
                  </li>
                  <li key='4' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/user" onClick={() => setNav(false)}>{user.username}</Link>
                  </li>
                  <li key='5' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <button onClick={logoutUser}>Logout</button>
                  </li>
                </>
              )}
              {user.role === 'chef' && (
                <>
                  <li key='14' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                  <Link href="/Recipespage" onClick={() => setNav(false)}>Recipes</Link>
                  </li>
                  <li key='6' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/chef" onClick={() => setNav(false)}>Chef</Link>
                  </li>
                  <li key='7' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/user" onClick={() => setNav(false)}>{user.username}</Link>
                  </li>
                  <li key='8' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <button onClick={logoutUser}>Logout</button>
                  </li>
                </>
              )}
              {user.role === 'customer' && (
                <>
                <li key='9' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                <Link href="/Recipespage" onClick={() => setNav(false)}>Recipes</Link>
                  </li>
                  <li key='10' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <Link href="/user" onClick={() => setNav(false)}>{user.username}</Link>
                  </li>
                  <li key='11' className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                    <button onClick={logoutUser}>Logout</button>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      )}
    </div>
 );
};

export default Header;
