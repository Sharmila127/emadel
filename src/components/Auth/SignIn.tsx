/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signin } from "@/features/SignIn/service";
import React, { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import flow from '../../assets/eflowdot-high-resolution-logo-transparent_.png';

const SignIn = () => {
  const [email, setEmail] = useState("mernstackdev@gmail.com");
  const [password, setPassword] = useState("Wecandoit@2024");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth()



  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter valid email and password");
      return;
    }

    const params = { email, password };

    try {
      const response = await Signin(params);


      const token = response?.data?.data?.token;

      if (token) {
        login(token)
        localStorage.setItem("isAuthenticated", "true");

        navigate("/");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      const errorMessage = error?.response?.status === 500 
        ? "Server is temporarily unavailable. Please try again."
        : "Login failed. Please check your credentials.";
      alert(errorMessage);
    }
  };


  return (
    <div className="flex h-screen">

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-6">
    <img src={flow} alt="E-Flow" className="max-w-md h-auto mb-6" />

        <form onSubmit={handleSignIn} className="mt-8 p-5 w-full">
          <h2 className="text-2xl font-bold text-[#68B39F]">
            Hi, Welcome Back
          </h2>
          <p className="text-lg mt-2 text-[#999999]">
            Enter your Credentials to continue
          </p>


          <div className="mt-6">
            <label className="block text-md font-medium text-gray-700">
              User Name
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full h-14 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#68B39F]"
              required
            />
          </div>


          <div className="mt-4">
            <label className="block text-md font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full h-14 rounded-md border border-gray-300 px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#68B39F]"
                required
              />
              <div
                className="absolute right-3 top-4 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </div>
            </div>
          </div>


          <div className="mt-3 flex items-center justify-between">

            <a href="#" className="text-sm ml-auto text-gray-500 hover:text-[#68B39F]" onClick={() => navigate('/send-otp')}>
              Forgot Password?
            </a>
          </div>


          <button
            type="submit"
            className="mt-6 w-full h-14 bg-[#68B39F]  text-white py-2 rounded-md text-xl font-medium"
          >
            Sign In
          </button>


          <p className="mt-4 text-xs text-center text-[#999999]">
            Enter the mail ID & Password given by eflow
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 h-screen bg-[#68B39F]"></div>
    </div>
  );
};

export default SignIn;
