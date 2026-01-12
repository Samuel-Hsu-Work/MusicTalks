"use client";
import { useState, useEffect } from "react";

import LoginForm from "../components/account/loginForm";
import RegisterForm from "../components/account/registerForm";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in when component loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // If user is logged in, show user info
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Account</h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-lg text-gray-900">{user.username}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="text-sm text-gray-600 font-mono">{user.id}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login/register forms
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              !isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}