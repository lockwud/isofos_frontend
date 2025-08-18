'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WarehouseTablePage() {
  const [racks, setRacks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWarehouseRacks();
      setRacks(data);
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

  const filteredRacks = racks.filter(rack =>
    rack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouse</h1>
            <p className="mt-2 text-gray-600">Manage your warehouse storage racks</p>
          </div>
          <Link href="/dashboard/warehouse/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Rack
            </Button>
          </Link>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search racks..."
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
                <TableHead>Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No warehouse racks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRacks.map((rack) => {
                  // Mock usage for demonstration (calculate from inventory in real app)
                  const mockUsage = Math.floor(Math.random() * 100);
                  const usageColor = mockUsage >= 90 ? 'bg-red-500' : 
                                    mockUsage >= 70 ? 'bg-yellow-500' : 'bg-green-500';
                  
                  return (
                    <TableRow key={rack.id}>
                      <TableCell className="font-medium flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                        {rack.name}
                      </TableCell>
                      <TableCell>{rack.location}</TableCell>
                      <TableCell>
                        {rack.capacity ? `${rack.capacity} units` : 'No capacity set'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={mockUsage} 
                            className={`h-2 ${usageColor}`}
                          />
                          <span className="text-sm">{mockUsage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Link href={`/dashboard/warehouse/${rack.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/warehouse/${rack.id}/edit`}>
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
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}