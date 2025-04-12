
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import RegisterForm from '@/components/Auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
