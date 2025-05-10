import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogOutpage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Logging out...</h1>
    </div>
  );
};

export default LogOutpage;
