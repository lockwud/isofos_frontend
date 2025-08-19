'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

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
  const [suppliers, setSuppliers] = useState<any[]>([]);

useEffect(() => {
  const fetchSuppliers = async () => {
    try {
      const data = await apiService.getSuppliers();
      console.log('Suppliers loaded:', data);

      // ✅ FIX: Extract the array from the object
      setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
    } catch (error) {
      toast.error('Failed to load suppliers');
      setSuppliers([]);
    }
  };
  fetchSuppliers();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.createMaterial({
        ...formData,
        supplier_id: Number(formData.supplier_id),
        unit_price: Number(formData.unit_price)
      });
      toast.success('Material created successfully');
      router.push('/materials');
    } catch (error) {
      toast.error('Failed to create material');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add New Material</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Material Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_id">Supplier *</Label>
              <Select
                name="supplier_id"
                value={formData.supplier_id}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, supplier_id: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={String(supplier.id)}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price *</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_of_measure">Unit of Measure</Label>
              <Select
                name="unit_of_measure"
                value={formData.unit_of_measure}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, unit_of_measure: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="litre">litre</SelectItem>
                  <SelectItem value="piece">piece</SelectItem>
                  <SelectItem value="meter">meter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/materials')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Material'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
