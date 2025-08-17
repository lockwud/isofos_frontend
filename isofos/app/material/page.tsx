'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Package, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = materials.filter((material: any) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [materials, searchTerm]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    } catch (error) {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await apiService.deleteMaterial(id);
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Materials</h1>
            <p className="mt-2 text-gray-600">Manage your construction materials</p>
          </div>
          <Link href="/materials/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Material
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material: any) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  {material.supplier?.name && (
                    <Badge variant="secondary">{material.supplier.name}</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {material.description && (
                      <p className="text-sm text-gray-600">{material.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${material.unit_price.toFixed(2)}
                      {material.unit_of_measure && ` per ${material.unit_of_measure}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Added: {new Date(material.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Link href={`/materials/${material.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/materials/${material.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMaterial(material.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No materials found</p>
              <Link href="/materials/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Material
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}