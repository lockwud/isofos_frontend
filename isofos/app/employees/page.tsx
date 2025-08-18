'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Employee {
  em_id: string;
  em_name: string;
  em_roll: string;
  em_salary: number;
  mng_id: string;
  email?: string;
  phone?: string;
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
    if (Array.isArray(employees)) {
      const filtered = employees.filter((employee) =>
        employee.em_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        employee.em_roll.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
      setFilteredEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load employees');
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (em_id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await apiService.deleteEmployee(em_id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employees Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.em_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {employee.em_name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{employee.em_roll}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employee.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {employee.email}
                      </div>
                    )}
                    {employee.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {employee.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${employee.em_salary.toLocaleString()}/year
                    </div>
                    {employee.hire_date && (
                      <div className="text-xs text-gray-500">
                        Hired: {new Date(employee.hire_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Link href={`/employees/${employee.em_id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/employees/${employee.em_id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteEmployee(employee.em_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No employees found</p>
              <Link href="/employees/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Employee
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}