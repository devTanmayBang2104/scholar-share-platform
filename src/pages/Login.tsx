
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import LoginForm from '@/components/Auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
