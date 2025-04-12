
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import UploadMaterialForm from '@/components/Materials/UploadMaterialForm';
import { useAuth } from '@/contexts/AuthContext';

const Upload = () => {
  const { isAuthenticated } = useAuth();

  // Protected route - redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <UploadMaterialForm />
      </div>
    </Layout>
  );
};

export default Upload;
