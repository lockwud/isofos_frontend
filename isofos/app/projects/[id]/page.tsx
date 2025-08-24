'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/lib/api';
import { ArrowLeft, Edit, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Project, ProjectEmployee } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [projectEmployees, setProjectEmployees] = useState<ProjectEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const projectData = await apiService.getProject(Number(params.id));
      const proj = projectData.project || projectData;
      setProject(proj);

      const employees = await apiService.getProjectEmployees(proj.id);

// ✅ Normalize correctly
const normalizedEmployees = Array.isArray(employees)
  ? employees
  : employees?.employees
  ? employees.employees
  : employees?.assignment
  ? [employees.assignment]
  : [];

console.log("📌 Employees fetched for project:", normalizedEmployees);

setProjectEmployees(normalizedEmployees);
    } catch (error: any) {
      console.error('Failed to load project details:', error);
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

  if (loading) return (
    <Layout>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </Layout>
  );

  if (!project) return (
    <Layout>
      <div className="text-center">
        <p className="text-gray-500">Project not found</p>
        <Link href="/projects"><Button className="mt-4">Back to Projects</Button></Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">Project Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status || '')}>
              {project.status?.replace('_', ' ').toUpperCase() || 'N/A'}
            </Badge>
            <Link href={`/projects/${project.id}/edit`}>
              <Button><Edit className="h-4 w-4 mr-2" />Edit Project</Button>
            </Link>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {project.client_name || 'N/A'}</p>
              <p><strong>Email:</strong> {project.client_email || 'N/A'}</p>
              <p><strong>Phone:</strong> {project.client_phone || 'N/A'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
            <CardContent>
              <p><strong>Type:</strong> {project.project_type || 'N/A'}</p>
              <p><strong>Status:</strong> {project.status?.replace('_', ' ') || 'N/A'}</p>
              {project.start_date && <p><strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}</p>}
              {project.end_date && <p><strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}</p>}
              <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Financial</CardTitle></CardHeader>
            <CardContent>
              {project.budget ? <p><strong>Budget:</strong> ${Number(project.budget).toLocaleString()}</p> : <p className="text-gray-500">No budget set</p>}
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {project.description && (
          <Card>
            <CardHeader><CardTitle>Project Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Employees Tab */}
        <Tabs defaultValue="employees" className="w-full">
          <TabsList>
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />Team Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Assigned Employees</CardTitle></CardHeader>
              <CardContent>
                {projectEmployees.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {projectEmployees.map((emp) => (
                      <li key={emp.id}>
                        {emp.first_name} {emp.last_name} - {emp.position}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No team members assigned yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
