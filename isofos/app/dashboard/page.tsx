'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { Briefcase, Users, Package, Truck, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/types';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  totalEmployees: number;
  totalSuppliers: number;
  lowStockItems: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    totalEmployees: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);

    const [
      projectsResponse,
      clientsResponse,
      employeesResponse,
      suppliersResponse,
      inventoryResponse,
      projectsData,
    ] = await Promise.all([
      apiService.totalProjects(),
      apiService.totalClients(),
      apiService.totalEmployees(),
      apiService.totalSuppliers(),
      apiService.getInventory(),
      apiService.getProjects(),
    ]);

    // Log to verify actual data structure
    console.log('projectsData:', projectsData);
    console.log('inventoryResponse:', inventoryResponse);

    // Safely get project list and inventory list with fallback to empty arrays
    const projectsList = Array.isArray(projectsData)
      ? projectsData
      : projectsData?.projects ?? [];

    const inventoryList = Array.isArray(inventoryResponse)
      ? inventoryResponse
      : inventoryResponse?.inventory ?? [];

    // Calculate stats
    const activeProjects = projectsList.filter((p: Project) => p.status === 'in_progress').length;
    const lowStockItems = inventoryList.filter((item: any) => item.quantity < 10).length;

    setStats({
      totalProjects: projectsResponse.total || 0,
      activeProjects,
      totalClients: clientsResponse.total || 0,
      totalEmployees: employeesResponse.total || 0,
      totalSuppliers: suppliersResponse.total || 0,
      lowStockItems,
    });

    // Sort and slice recent projects
    const recent = [...projectsList]
      .sort((a: Project, b: Project) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    setRecentProjects(recent);
  } catch (error: any) {
    console.error('Dashboard error:', error);
    toast.error(error.message || 'Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};


  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'text-blue-600',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'text-orange-600',
    },
    {
      title: 'Suppliers',
      value: stats.totalSuppliers,
      icon: Truck,
      color: 'text-indigo-600',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your construction business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">
                        {project.client?.name} • {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {project.budget && (
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ${project.budget.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No projects found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}