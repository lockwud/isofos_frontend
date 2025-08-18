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

export default function NewEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    em_id: '',
    em_name: '',
    em_roll: '',
    em_salary: '',
    mng_id: '',
    email: '',
    phone: '',
    hire_date: ''
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

    // Validate required fields
    if (!formData.em_id || !formData.em_name || !formData.em_roll || !formData.em_salary || !formData.mng_id) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const employeeData = {
        em_id: formData.em_id,
        em_name: formData.em_name,
        em_roll: formData.em_roll,
        em_salary: parseFloat(formData.em_salary),
        mng_id: formData.mng_id,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        hire_date: formData.hire_date || undefined
      };
      
      const response = await apiService.createEmployee(employeeData);
      
      if (response) {
        toast.success('Employee created successfully!');
        router.push('/employees');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Employee</h1>
            <p className="text-gray-600">Add a new employee to your system</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="em_id">Employee ID *</Label>
                  <Input
                    id="em_id"
                    name="em_id"
                    value={formData.em_id}
                    onChange={handleChange}
                    placeholder="EMP-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mng_id">Manager ID *</Label>
                  <Input
                    id="mng_id"
                    name="mng_id"
                    value={formData.mng_id}
                    onChange={handleChange}
                    placeholder="MNG-001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="em_name">Full Name *</Label>
                <Input
                  id="em_name"
                  name="em_name"
                  value={formData.em_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="em_roll">Role *</Label>
                <Input
                  id="em_roll"
                  name="em_roll"
                  value={formData.em_roll}
                  onChange={handleChange}
                  placeholder="e.g., carpenter,painter"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="em_salary">Salary *</Label>
                  <Input
                    id="em_salary"
                    name="em_salary"
                    type="number"
                    value={formData.em_salary}
                    onChange={handleChange}
                    placeholder="5000.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    name="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/employees">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Employee'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}