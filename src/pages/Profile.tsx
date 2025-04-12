
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import MaterialCard from '@/components/Materials/MaterialCard';
import { useAuth } from '@/contexts/AuthContext';
import { materialsService } from '@/services/api';
import { Material } from '@/types';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Profile = () => {
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
  
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
        <ProfileInfo />
        
        <div className="mt-12">
          <Tabs defaultValue="uploads" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="uploads">My Uploads</TabsTrigger>
                <TabsTrigger value="rewards">Rewards & Achievements</TabsTrigger>
              </TabsList>
              
              <Button asChild>
                <Link to="/upload" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Material
                </Link>
              </Button>
            </div>
            
            <TabsContent value="uploads">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-scholar-primary" />
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 p-6 rounded-md">
                  <p className="font-medium">{error}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {materials.map((material) => (
                    <MaterialCard
                      key={material._id}
                      material={material}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rewards">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Your Achievements</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Points & Level</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span>Total Points:</span>
                        <span className="font-semibold">{user?.points || 0}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-scholar-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, ((user?.points || 0) / 100) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Badges Earned</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {user?.points && user.points >= 20 ? (
                        <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center">
                          <span className="text-2xl mb-1">📚</span>
                          <h5 className="font-medium">Contributor</h5>
                          <p className="text-xs text-gray-500">Earned 20+ points</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center opacity-50">
                          <span className="text-2xl mb-1">📚</span>
                          <h5 className="font-medium">Contributor</h5>
                          <p className="text-xs text-gray-500">Earn 20+ points</p>
                        </div>
                      )}
                      
                      {user?.points && user.points >= 50 ? (
                        <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center">
                          <span className="text-2xl mb-1">⭐</span>
                          <h5 className="font-medium">Expert</h5>
                          <p className="text-xs text-gray-500">Earned 50+ points</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center opacity-50">
                          <span className="text-2xl mb-1">⭐</span>
                          <h5 className="font-medium">Expert</h5>
                          <p className="text-xs text-gray-500">Earn 50+ points</p>
                        </div>
                      )}
                      
                      {user?.points && user.points >= 100 ? (
                        <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center">
                          <span className="text-2xl mb-1">🎓</span>
                          <h5 className="font-medium">Scholar</h5>
                          <p className="text-xs text-gray-500">Earned 100+ points</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center opacity-50">
                          <span className="text-2xl mb-1">🎓</span>
                          <h5 className="font-medium">Scholar</h5>
                          <p className="text-xs text-gray-500">Earn 100+ points</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
