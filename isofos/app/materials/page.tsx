'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Box, DollarSign, Ruler } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMaterials();
      // Handle nested response (e.g., { materials: [...] }) from backend
      const materialList = Array.isArray(data)
        ? data
        : Array.isArray(data?.materials)
        ? data.materials
        : [];
      setMaterials(materialList);
    } catch (error) {
      toast.error('Failed to load materials');
      setMaterials([]);
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

  const filteredMaterials = materials.filter((material) =>
    material?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    material?.description?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

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

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Unit</TableHead>
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
              ) : filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No materials found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Box className="h-4 w-4 mr-2" />
                        {material.name}
                      </div>
                      {material.description && (
                        <div className="text-sm text-gray-500">{material.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {material.supplier?.name || 'No supplier'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {material.unit_price ? Number(material.unit_price).toFixed(2) : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1" />
                        {material.unit_of_measure || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
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
