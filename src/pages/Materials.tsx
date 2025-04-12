
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import MaterialCard from '@/components/Materials/MaterialCard';
import MaterialFilters, { MaterialFiltersState } from '@/components/Materials/MaterialFilters';
import { materialsService } from '@/services/api';
import { Material } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MaterialFiltersState>({
    search: '',
    category: '',
    year: '',
    sort: 'newest',
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await materialsService.getAll();
        console.log('Fetched materials:', response);
        setMaterials(response);
        setFilteredMaterials(response);
      } catch (err: any) {
        console.error('Error fetching materials:', err);
        setError('Failed to load materials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (!materials.length) return;
    
    // Apply filters
    let result = [...materials];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (material) =>
          material.title.toLowerCase().includes(searchTerm) ||
          material.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (filters.category) {
      result = result.filter((material) => material.category === filters.category);
    }
    
    // Filter by year
    if (filters.year) {
      result = result.filter((material) => material.year === filters.year);
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      default:
        break;
    }
    
    setFilteredMaterials(result);
  }, [filters, materials]);

  const handleFilterChange = (newFilters: MaterialFiltersState) => {
    setFilters(newFilters);
  };

  const handleVote = (materialId: string, newVoteCount: number) => {
    // Update the material in both arrays
    const updateMaterial = (material: Material) => {
      if (material._id === materialId) {
        return {
          ...material,
          upvotes: newVoteCount,
          voted: [...material.voted, 'user-voted'], // Add user ID to voted array
        };
      }
      return material;
    };
    
    setMaterials(materials.map(updateMaterial));
    setFilteredMaterials(filteredMaterials.map(updateMaterial));
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
            <p className="text-gray-600">Explore and download study resources shared by fellow students</p>
          </div>
        </div>

        <div className="mb-8">
          <MaterialFilters onFilterChange={handleFilterChange} />
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
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-10 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">No materials found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
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

export default Materials;
