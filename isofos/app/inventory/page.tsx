'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter((item: any) =>
      item.material?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rack?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [inventory, searchTerm]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await apiService.getInventory();
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const deleteInventoryItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;

    try {
      await apiService.deleteInventoryItem(id);
      toast.success('Inventory item deleted successfully');
      fetchInventory();
    } catch (error) {
      toast.error('Failed to delete inventory item');
    }
  };

  const getStockLevel = (quantity: number) => {
    if (quantity < 10) return { color: 'bg-red-100 text-red-800', label: 'Low Stock' };
    if (quantity < 50) return { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Stock' };
    return { color: 'bg-green-100 text-green-800', label: 'Good Stock' };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="mt-2 text-gray-600">Track your material stock levels</p>
          </div>
          <Link href="/inventory/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Inventory Item
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Inventory Grid */}
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
            {filteredInventory.map((item: any) => {
              const stockLevel = getStockLevel(item.quantity);
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {item.material?.name || 'Unknown Material'}
                      </CardTitle>
                      {item.quantity < 10 && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <Badge className={stockLevel.color}>
                          {item.quantity} {item.material?.unit_of_measure || 'units'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm font-medium">
                          {item.rack?.name || 'Unknown'} - {item.rack?.location || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stock Level:</span>
                        <Badge className={stockLevel.color}>
                          {stockLevel.label}
                        </Badge>
                      </div>

                      {item.last_restocked && (
                        <div className="text-xs text-gray-500">
                          Last restocked: {new Date(item.last_restocked).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Link href={`/inventory/${item.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/inventory/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteInventoryItem(item.id)}
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

        {!loading && filteredInventory.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No inventory items found</p>
              <Link href="/inventory/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Inventory Item
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}