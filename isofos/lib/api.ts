// API service layer for backend integration
import {
  Client,
  Project,
  ProjectEmployee,
  ProjectMaterial,
  Employee,
  Supplier,
  Material,
  Inventory,
  WarehouseRack,
  Manager,
} from "@/types";

const API_BASE_URL = "http://localhost:3001/api";

class ApiService {
  private token: string | null = null;
  private loadingStates: Map<string, boolean> = new Map();

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    loadingKey?: string
  ): Promise<T> {
    if (loadingKey) {
      this.setLoading(loadingKey, true);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        const networkError = new Error(
          "Network error - please check your connection"
        );
        (networkError as any).code = "NETWORK_ERROR";
        throw networkError;
      }
      console.error("API request failed:", error);
      throw error;
    } finally {
      if (loadingKey) {
        this.setLoading(loadingKey, false);
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  // Loading state management
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  private setLoading(key: string, loading: boolean) {
    this.loadingStates.set(key, loading);
  }

  // Auth endpoints
  async login(
    credentials: { email: string; password: string },
    loadingKey?: string
  ) {
    return this.request<{ token: string; manager: Manager }>(
      "/managers/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      loadingKey
    );
  }

  async register(
    data: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone?: string;
    },
    loadingKey?: string
  ) {
    return this.request<{ token: string; manager: Manager }>(
      "/managers/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      loadingKey
    );
  }

  // Generic CRUD methods
  async getAll<T>(endpoint: string, loadingKey?: string): Promise<T[]> {
    return this.request<T[]>(`/${endpoint}`, {}, loadingKey);
  }

  async getById<T>(
    endpoint: string,
    id: number,
    loadingKey?: string
  ): Promise<T> {
    return this.request<T>(`/${endpoint}/${id}`, {}, loadingKey);
  }

  async create<T>(
    endpoint: string,
    data: any,
    loadingKey?: string
  ): Promise<T> {
    return this.request<T>(
      `/${endpoint}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      loadingKey
    );
  }

  async update<T>(
    endpoint: string,
    id: number,
    data: any,
    loadingKey?: string
  ): Promise<T> {
    return this.request<T>(
      `/${endpoint}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      loadingKey
    );
  }

  async delete(
    endpoint: string,
    id: number,
    loadingKey?: string
  ): Promise<void> {
    return this.request<void>(
      `/${endpoint}/${id}`,
      {
        method: "DELETE",
      },
      loadingKey
    );
  }

  // Project methods
  async getProjects(loadingKey?: string): Promise<Project[]> {
    return this.getAll<Project>("projects", loadingKey);
  }

  async getProject(id: number, loadingKey?: string): Promise<Project> {
    return this.getById<Project>("projects", id, loadingKey);
  }

  async createProject(
    data: Partial<Project>,
    loadingKey?: string
  ): Promise<Project> {
    return this.create<Project>("projects", data, loadingKey);
  }

  async updateProject(
    id: number,
    data: Partial<Project>,
    loadingKey?: string
  ): Promise<Project> {
    return this.update<Project>("projects", id, data, loadingKey);
  }

  async deleteProject(id: number, loadingKey?: string) {
    return this.delete("projects", id, loadingKey);
  }

  // Client methods
  async getClients(loadingKey?: string): Promise<Client[]> {
    return this.getAll<Client>("clients", loadingKey);
  }

  async getClient(id: number, loadingKey?: string): Promise<Client> {
    return this.getById<Client>("clients", id, loadingKey);
  }

  async createClient(
    data: Partial<Client>,
    loadingKey?: string
  ): Promise<Client> {
    return this.create<Client>("clients", data, loadingKey);
  }

  async updateClient(
    id: number,
    data: Partial<Client>,
    loadingKey?: string
  ): Promise<Client> {
    return this.update<Client>("clients", id, data, loadingKey);
  }

  async deleteClient(id: number, loadingKey?: string) {
    return this.delete("clients", id, loadingKey);
  }

  // Employee methods - updated to match backend expectations
  async getEmployees(loadingKey?: string): Promise<Employee[]> {
    return this.request<Employee[]>("/employees", {}, loadingKey);
  }

  async getEmployee(id: string, loadingKey?: string): Promise<Employee> {
    return this.request<Employee>(`/employees/${id}`, {}, loadingKey);
  }

  async createEmployee(
    data: {
      em_id: string;
      em_name: string;
      em_roll: string;
      em_salary: number;
      mng_id: string;
      email?: string;
      phone?: string;
      address?: string;
      hire_date?: string;
    },
    loadingKey?: string
  ): Promise<Employee> {
    return this.request<Employee>(
      "/employees",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      loadingKey
    );
  }

  async updateEmployee(
    id: string,
    data: Partial<{
      em_name: string;
      em_roll: string;
      em_salary: number;
      mng_id: string;
      email?: string;
      phone?: string;
      address?: string;
      hire_date?: string;
    }>,
    loadingKey?: string
  ): Promise<Employee> {
    return this.request<Employee>(
      `/employees/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      loadingKey
    );
  }

  async deleteEmployee(id: string, loadingKey?: string): Promise<void> {
    return this.request<void>(
      `/employees/${id}`,
      {
        method: "DELETE",
      },
      loadingKey
    );
  }
  // Supplier methods
  async getSuppliers(loadingKey?: string): Promise<Supplier[]> {
    return this.getAll<Supplier>("suppliers", loadingKey);
  }

  async getSupplier(id: number, loadingKey?: string): Promise<Supplier> {
    return this.getById<Supplier>("suppliers", id, loadingKey);
  }

  async createSupplier(
    data: Partial<Supplier>,
    loadingKey?: string
  ): Promise<Supplier> {
    return this.create<Supplier>("suppliers", data, loadingKey);
  }

  async updateSupplier(
    id: number,
    data: Partial<Supplier>,
    loadingKey?: string
  ): Promise<Supplier> {
    return this.update<Supplier>("suppliers", id, data, loadingKey);
  }

  async deleteSupplier(id: number, loadingKey?: string) {
    return this.delete("suppliers", id, loadingKey);
  }

  // Material methods
  async getMaterials(loadingKey?: string): Promise<Material[]> {
    const response = await this.request<{ materials: Material[] }>(
      "/materials",
      {},
      loadingKey
    );
    return response.materials;
  }

  async getMaterial(id: number, loadingKey?: string): Promise<Material> {
    return this.getById<Material>("materials", id, loadingKey);
  }

  async createMaterial(
    data: Partial<Material>,
    loadingKey?: string
  ): Promise<Material> {
    return this.create<Material>("materials", data, loadingKey);
  }

  async updateMaterial(
    id: number,
    data: Partial<Material>,
    loadingKey?: string
  ): Promise<Material> {
    return this.update<Material>("materials", id, data, loadingKey);
  }

  async deleteMaterial(id: number, loadingKey?: string) {
    return this.delete("materials", id, loadingKey);
  }

  // Inventory methods
  async getInventory(loadingKey?: string): Promise<Inventory[]> {
    return this.getAll<Inventory>("inventory", loadingKey);
  }

  async getInventoryItem(id: number, loadingKey?: string): Promise<Inventory> {
    return this.getById<Inventory>("inventory", id, loadingKey);
  }

  async createInventoryItem(
    data: Partial<Inventory>,
    loadingKey?: string
  ): Promise<Inventory> {
    return this.create<Inventory>("inventory", data, loadingKey);
  }

  async updateInventoryItem(
    id: number,
    data: Partial<Inventory>,
    loadingKey?: string
  ): Promise<Inventory> {
    return this.update<Inventory>("inventory", id, data, loadingKey);
  }

  async deleteInventoryItem(id: number, loadingKey?: string) {
    return this.delete("inventory", id, loadingKey);
  }

  // WarehouseRack methods
  async getWarehouseRacks(loadingKey?: string): Promise<WarehouseRack[]> {
    const response = await this.request<any>("/warehouses", {}, loadingKey);
    return response.racks ?? [];
  }

  async getWarehouseRack(
    id: number,
    loadingKey?: string
  ): Promise<WarehouseRack> {
    return this.getById<WarehouseRack>("warehouse-racks", id, loadingKey);
  }

  async createWarehouseRack(
    data: Partial<WarehouseRack>,
    loadingKey?: string
  ): Promise<WarehouseRack> {
    return this.create<WarehouseRack>("warehouses", data, loadingKey);
  }

  async updateWarehouseRack(
    id: number,
    data: Partial<WarehouseRack>,
    loadingKey?: string
  ): Promise<WarehouseRack> {
    return this.update<WarehouseRack>("warehouse-racks", id, data, loadingKey);
  }

  async deleteWarehouseRack(id: number, loadingKey?: string) {
    return this.delete("warehouse-racks", id, loadingKey);
  }

  // Project resources
  // FIXED: unwrap { employees: [...] } response
async getProjectEmployees(
  projectId: number,
  loadingKey?: string
): Promise<ProjectEmployee[]> {
  const response = await this.request<{ employees: ProjectEmployee[] }>(
    `/project-employees/project/${projectId}`, // ✅ corrected
    {},
    loadingKey
  );
  return response.employees || [];
}



  async getAllAssignedEmployees(loadingKey?: string): Promise<ProjectEmployee[]> {
  return this.getAll<ProjectEmployee>("project-employees", loadingKey);
}


  async getProjectMaterials(
    projectId: number,
    loadingKey?: string
  ): Promise<ProjectMaterial[]> {
    return this.getAll<ProjectMaterial>(
      `project-materials?project_id=${projectId}`,
      loadingKey
    );
  }

  async addProjectEmployee(
    data: Partial<ProjectEmployee>,
    loadingKey?: string
  ): Promise<ProjectEmployee> {
    return this.create<ProjectEmployee>("project-employees", data, loadingKey);
  }

  async addProjectMaterial(
    data: Partial<ProjectMaterial>,
    loadingKey?: string
  ): Promise<ProjectMaterial> {
    return this.create<ProjectMaterial>("project-materials", data, loadingKey);
  }

  async removeProjectEmployee(id: number, loadingKey?: string) {
    return this.delete("project-employees", id, loadingKey);
  }

  async removeProjectMaterial(id: number, loadingKey?: string) {
    return this.delete("project-materials", id, loadingKey);
  }

  // Report methods
  async getProjectCostReport(projectId: number, loadingKey?: string) {
    return this.request<any>(
      `/reports/project-cost/${projectId}`,
      {},
      loadingKey
    );
  }

  async getEmployeeWorkloadReport(loadingKey?: string) {
    return this.request<any>("/reports/employee-workload", {}, loadingKey);
  }

  async getInventoryValueReport(loadingKey?: string) {
    return this.request<any>("/reports/inventory-value", {}, loadingKey);
  }

  async totalProjects(loadingKey?: string) {
    return this.request<any>("/reports/total-projects", {}, loadingKey);
  }

  async totalEmployees(loadingKey?: string) {
    return this.request<any>("/reports/total-employees", {}, loadingKey);
  }

  async totalSuppliers(loadingKey?: string) {
    return this.request<any>("/reports/total-suppliers", {}, loadingKey);
  }

  async totalClients(loadingKey?: string) {
    return this.request<any>("/reports/total-clients", {}, loadingKey);
  }
}

export const apiService = new ApiService();
