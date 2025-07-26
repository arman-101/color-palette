// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase'; // Import the Firebase auth instance and Google Provider
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Signed up successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign up. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed up with Google successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign up with Google. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <Toaster />
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </button>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="text-gray-700">or sign up with</span>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FaGoogle className="text-red-500 mr-2" />
              Google
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-700">Already have an account?</p>
            <a
              href="/sign-in"
              className="text-blue-500 hover:underline"
            >
              Sign In here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
