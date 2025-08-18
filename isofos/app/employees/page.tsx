'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  base_salary: number;
  hire_date?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = employees.filter((emp) =>
      emp.first_name.toLowerCase().includes(term) ||
      emp.last_name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      (emp.position?.toLowerCase().includes(term) ?? false)
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await apiService.getEmployees();
      if (Array.isArray(res.employees)) {
        setEmployees(res.employees);
        setFilteredEmployees(res.employees);
      } else {
        setEmployees([]);
        setFilteredEmployees([]);
      }
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await apiService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="mt-2 text-gray-600">Manage your workforce</p>
          </div>
          <Link href="/employees/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Employee
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid Listing */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <CardContent className="p-6 h-48 bg-gray-100 rounded"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((emp) => (
              <Card key={emp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{emp.first_name} {emp.last_name}</CardTitle>
                  <p className="text-sm text-gray-600">{emp.position ?? '—'}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" /> {emp.email}
                    </div>
                    {/* Phone */}
                    {emp.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" /> {emp.phone}
                      </div>
                    )}
                    {/* Address */}
                    {emp.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" /> {emp.address}
                      </div>
                    )}
                    {/* Salary */}
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" /> ${emp.base_salary.toLocaleString()}
                    </div>
                    {/* Hire Date */}
                    {emp.hire_date && (
                      <div className="text-xs text-gray-500">
                        Hired: {new Date(emp.hire_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-4">
                    <Link href={`/employees/${emp.id}`}>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/employees/${emp.id}/edit`}>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No employees found</p>
              <Link href="/employees/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Employee
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
