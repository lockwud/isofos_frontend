'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

interface Project {
  id: number;
  name: string;
  project_type: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
}

interface Assignment {
  id: number;
  project_id: number;
  employee_id: number;
  project_name: string;
  first_name: string;
  last_name: string;
  position: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    fetchAssignments();
  }, []);

  async function fetchProjects() {
    try {
      const res = await apiService.getProjects();
      setProjects(res.projects || []);
    } catch {
      toast.error('Failed to load projects');
    }
  }

  async function fetchEmployees() {
    try {
      const res = await apiService.getEmployees();
      setEmployees(res.employees || []);
    } catch {
      toast.error('Failed to load employees');
    }
  }

  async function fetchAssignments() {
    try {
      const res = await apiService.getAllAssignedEmployees();
      setAssignments(res.employees || []); // Use API response directly
    } catch {
      toast.error('Failed to load assignments');
    }
  }

  function toggleEmployee(id: number) {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  async function handleAssign() {
    if (!selectedProject || selectedEmployees.length === 0) {
      toast.error('Please select a project and at least one employee');
      return;
    }

    try {
      for (const empId of selectedEmployees) {
        await apiService.addProjectEmployee({
          project_id: parseInt(selectedProject),
          employee_id: empId,
        });
      }
      toast.success('Employees assigned successfully');
      setSelectedEmployees([]);
      fetchAssignments();
    } catch {
      toast.error('Failed to assign employees');
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assign Employees to Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Select Project */}
              <Select onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name} ({project.project_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Multi-Select Employees (as dropdown) */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedEmployees.length > 0
                      ? `${selectedEmployees.length} selected`
                      : 'Select Employees'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Select Employees</p>
                  {employees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center space-x-2 py-1 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedEmployees.includes(emp.id)}
                        onCheckedChange={() => toggleEmployee(emp.id)}
                      />
                      <span className="text-sm">
                        {emp.first_name} {emp.last_name} - {emp.position}
                      </span>
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleAssign} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Assign
            </Button>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {assignment.project_name ?? 'Unknown Project'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.first_name
                        ? `${assignment.first_name} ${assignment.last_name} - ${assignment.position}`
                        : 'Unknown Employee'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
