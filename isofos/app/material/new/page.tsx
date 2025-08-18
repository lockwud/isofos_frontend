'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewMaterialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supplier_id: '',
    unit_price: '',
    unit_of_measure: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const materialData = {
        name: formData.name,
        description: formData.description || undefined,
        supplier_id: parseInt(formData.supplier_id) || undefined,
        unit_price: parseFloat(formData.unit_price),
        unit_of_measure: formData.unit_of_measure || undefined
      };
      
      await apiService.createMaterial(materialData);
      toast.success('Material created successfully!');
      router.push('/dashboard/materials');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/materials">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Material</h1>
            <p className="text-gray-600">Add a new material to your inventory</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Material Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Steel Beam"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Material description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_id">Supplier ID</Label>
                  <Input
                    id="supplier_id"
                    name="supplier_id"
                    type="number"
                    value={formData.supplier_id}
                    onChange={handleChange}
                    placeholder="123"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">Unit Price *</Label>
                  <Input
                    id="unit_price"
                    name="unit_price"
                    type="number"
                    value={formData.unit_price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                <Input
                  id="unit_of_measure"
                  name="unit_of_measure"
                  value={formData.unit_of_measure}
                  onChange={handleChange}
                  placeholder="e.g., kg, lb, piece"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/dashboard/materials">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Material'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}