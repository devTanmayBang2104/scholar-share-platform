
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import MaterialCard from '@/components/Materials/MaterialCard';
import { useAuth } from '@/contexts/AuthContext';
import { materialsService } from '@/services/api';
import { Material } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const MyMaterials = () => {
  const { user, isAuthenticated } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Protected route - redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchUserMaterials = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await materialsService.getUserMaterials(user._id);
        setMaterials(response);
      } catch (err: any) {
        setError('Failed to load your materials. Please try again later.');
        console.error('Error fetching user materials:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserMaterials();
  }, [user]);

  const handleVote = (materialId: string, newVoteCount: number) => {
    // Update the material in the materials array
    setMaterials(materials.map(material => {
      if (material._id === materialId) {
        return {
          ...material,
          upvotes: newVoteCount,
          voted: [...material.voted, user?._id || ''],
        };
      }
      return material;
    }));
  };

  const handleDelete = async (materialId: string) => {
    try {
      await materialsService.delete(materialId);
      setMaterials(materials.filter(material => material._id !== materialId));
      toast.success('Material deleted successfully');
    } catch (error) {
      toast.error('Failed to delete material');
      console.error('Error deleting material:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Materials</h1>
            <p className="text-gray-600">Manage your uploaded study materials</p>
          </div>
          <Button asChild>
            <Link to="/upload" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Material
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-scholar-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="bg-gray-50 p-10 text-center rounded-lg">
            <h3 className="text-xl font-semibold mb-3">You haven't uploaded any materials yet</h3>
            <p className="text-gray-600 mb-6">Share your study materials with other students to earn points and recognition.</p>
            <Button asChild>
              <Link to="/upload" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Material
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyMaterials;
