'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

export default function NewInventoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    material_id: '',
    rack_id: '',
    quantity: '0',
    last_restocked: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [racks, setRacks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsData, racksData] = await Promise.all([
          apiService.getMaterials(),
          apiService.getWarehouseRacks()
        ]);
        setMaterials(materialsData);
        setRacks(racksData);
      } catch (error) {
        toast.error('Failed to load required data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiService.createInventoryItem({
        ...formData,
        material_id: Number(formData.material_id),
        rack_id: Number(formData.rack_id),
        quantity: Number(formData.quantity)
      });
      toast.success('Inventory item created successfully');
      router.push('/inventory');
    } catch (error) {
      toast.error('Failed to create inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add New Inventory Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="material_id">Material *</Label>
              <Select
                name="material_id"
                value={formData.material_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, material_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map(material => (
                    <SelectItem key={material.id} value={String(material.id)}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rack_id">Warehouse Rack *</Label>
              <Select
                name="rack_id"
                value={formData.rack_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, rack_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rack" />
                </SelectTrigger>
                <SelectContent>
                  {racks.map(rack => (
                    <SelectItem key={rack.id} value={String(rack.id)}>
                      {rack.name} ({rack.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_restocked">Last Restocked Date</Label>
              <Input
                id="last_restocked"
                name="last_restocked"
                type="date"
                value={formData.last_restocked}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/inventory')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Inventory Item'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}