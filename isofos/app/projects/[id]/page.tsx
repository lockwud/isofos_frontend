'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/lib/api';
import { ArrowLeft, Edit, Users, Package } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Project, ProjectEmployee, ProjectMaterial } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [projectEmployees, setProjectEmployees] = useState<ProjectEmployee[]>([]);
  const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectData = await apiService.getProject(Number(params.id));
      setProject(projectData);
      
      // Fetch project employees and materials
      try {
        const employees = await apiService.getProjectEmployees(Number(params.id));
        const materials = await apiService.getProjectMaterials(Number(params.id));
        setProjectEmployees(employees);
        setProjectMaterials(materials);
      } catch (error) {
        console.log('Failed to fetch project resources:', error);
      }
      
    } catch (error) {
      toast.error('Failed to load project details');
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-gray-500">Project not found</p>
          <Link href="/projects">
            <Button className="mt-4">Back to Projects</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">Project Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Link href={`/projects/${project.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {project.client?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {project.client?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {project.client?.phone || 'N/A'}</p>
                {project.client?.address && (
                  <p><strong>Address:</strong> {project.client.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Type:</strong> {project.project_type?.type_name || 'N/A'}</p>
                <p><strong>Status:</strong> {project.status.replace('_', ' ')}</p>
                {project.start_date && (
                  <p><strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
                )}
                {project.end_date && (
                  <p><strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}</p>
                )}
                <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.budget ? (
                  <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
                ) : (
                  <p className="text-gray-500">No budget set</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Resources */}
        <Tabs defaultValue="employees" className="w-full">
          <TabsList>
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="materials">
              <Package className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Employees</CardTitle>
              </CardHeader>
              <CardContent>
                {projectEmployees.length > 0 ? (
                  <div className="space-y-2">
                    {projectEmployees.map((pe: any) => (
                      <div key={pe.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{pe.employee?.first_name} {pe.employee?.last_name}</p>
                          <p className="text-sm text-gray-600">{pe.role || pe.employee?.position}</p>
                        </div>
                        {pe.salary_allocation && (
                          <p className="text-sm font-medium">${pe.salary_allocation.toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No team members assigned yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Allocated Materials</CardTitle>
              </CardHeader>
              <CardContent>
                {projectMaterials.length > 0 ? (
                  <div className="space-y-2">
                    {projectMaterials.map((pm: any) => (
                      <div key={pm.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{pm.material?.name}</p>
                          <p className="text-sm text-gray-600">{pm.material?.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Qty: {pm.quantity}</p>
                          {pm.allocated_date && (
                            <p className="text-xs text-gray-500">{new Date(pm.allocated_date).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No materials allocated yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}