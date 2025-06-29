import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './signin';
import SignUp from './signup';

const AuthPages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default AuthPages; 