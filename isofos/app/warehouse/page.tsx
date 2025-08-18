'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Warehouse, MapPin } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWarehouseRacks();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load warehouses');
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteWarehouse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return;
    try {
      await apiService.deleteWarehouseRack(id);
      toast.success('Warehouse deleted successfully');
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to delete warehouse');
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    warehouse?.location?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
            <p className="mt-2 text-gray-600">Manage your warehouse locations</p>
          </div>
          <Link href="/warehouse/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Warehouse
            </Button>
          </Link>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredWarehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No warehouses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Warehouse className="h-4 w-4 mr-2" />
                        {warehouse.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {warehouse.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {warehouse.capacity || 'Not specified'}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`/warehouses/${warehouse.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/warehouses/${warehouse.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWarehouse(warehouse.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}