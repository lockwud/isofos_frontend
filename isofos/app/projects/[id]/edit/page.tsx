"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProjectPage() {
  const staticProjectTypes = [
    { id: 1, type_name: "House" },
    { id: 2, type_name: "Office" },
    { id: 3, type_name: "Store" },
  ];
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    project_type_id: 0,
    status: "pending",
    start_date: "",
    end_date: "",
    description: "",
    budget: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProject(Number(params.id));
      const project = data.project;
      console.log(project);
      setFormData({
        name: project.name || "",
        project_type_id: project.project_type_id || 0,
        status: project.status || "pending",
        start_date: project.start_date ? project.start_date.split("T")[0] : "",
        end_date: project.end_date ? project.end_date.split("T")[0] : "",
        description: project.description || "",
        budget: project.budget?.toString() || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load project");
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProject(Number(params.id), {
        ...formData,
        budget: parseFloat(formData.budget || "0"),
      });
      toast.success("Project updated successfully!");
      router.push(`/projects/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/projects`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_type_id">Project Type</Label>
                <Select
                  value={formData.project_type_id.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      project_type_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger id="project_type_id">
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {staticProjectTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
