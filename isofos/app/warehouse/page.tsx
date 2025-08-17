'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WarehousePage() {
  const [racks, setRacks] = useState<any[]>([]);
  const [filteredRacks, setFilteredRacks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRacks();
  }, []);

  useEffect(() => {
    const filtered = racks.filter((rack: any) =>
      rack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rack.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRacks(filtered);
  }, [racks, searchTerm]);

  const fetchRacks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWarehouseRacks();
      setRacks(data);
      setFilteredRacks(data);
    } catch (error) {
      toast.error('Failed to load warehouse racks');
    } finally {
      setLoading(false);
    }
  };

  const deleteRack = async (id: number) => {
    if (!confirm('Are you sure you want to delete this warehouse rack?')) return;

    try {
      await apiService.deleteWarehouseRack(id);
      toast.success('Warehouse rack deleted successfully');
      fetchRacks();
    } catch (error) {
      toast.error('Failed to delete warehouse rack');
    }
  };

  const getCapacityColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouse</h1>
            <p className="mt-2 text-gray-600">Manage your warehouse storage racks</p>
          </div>
          <Link href="/warehouse/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Rack
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search racks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Racks Grid */}
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
            {filteredRacks.map((rack: any) => {
              // Mock usage for demonstration (you'd calculate this from inventory data)
              const mockUsage = Math.floor(Math.random() * 100);
              
              return (
                <Card key={rack.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                      {rack.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        {/* Removed MapPin component to test if it's causing the build error */}
                        {rack.location}
                      </div>

                      {rack.capacity && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Capacity Usage</span>
                            <span className="font-medium">{mockUsage}%</span>
                          </div>
                          <Progress 
                            value={mockUsage} 
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500">
                            Capacity: {rack.capacity} units
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Created: {new Date(rack.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Link href={`/warehouse/${rack.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/warehouse/${rack.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteRack(rack.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredRacks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No warehouse racks found</p>
              <Link href="/warehouse/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Rack
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}