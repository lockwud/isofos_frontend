'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [suppliers, setSuppliers] = useState<any[]>([]); // Initialize as empty array

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiService.getSuppliers();
        // Ensure data is always an array
        setSuppliers(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to load suppliers');
        setSuppliers([]); // Set to empty array on error
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add null check before mapping */}
                  {Array.isArray(suppliers) && suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={String(supplier.id)}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ... rest of your form ... */}
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