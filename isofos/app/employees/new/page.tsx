'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewEmployeePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    base_salary: '',
    hire_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createEmployee({
        ...formData,
        base_salary: Number(formData.base_salary),
      });
      toast.success('Employee registered successfully');
      router.push('/employees');
    } catch {
      toast.error('Failed to register employee');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <Input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {/* Last Name */}
              <Input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              {/* Email */}
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {/* Phone */}
              <Input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {/* Address */}
              <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              {/* Position */}
              <Input
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
              />
              {/* Base Salary */}
              <Input
                type="number"
                name="base_salary"
                placeholder="Base Salary"
                value={formData.base_salary}
                onChange={handleChange}
                required
              />
              {/* Hire Date */}
              <Input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
              />

              <Button type="submit" className="w-full">
                Register Employee
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
