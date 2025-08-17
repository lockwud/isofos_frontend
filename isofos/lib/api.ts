// API service layer for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; manager: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: { first_name: string; last_name: string; email: string; password: string; phone?: string }) {
    return this.request<{ token: string; manager: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic CRUD methods
  async getAll<T>(endpoint: string): Promise<T[]> {
    return this.request<T[]>(`/${endpoint}`);
  }

  async getById<T>(endpoint: string, id: number): Promise<T> {
    return this.request<T>(`/${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(`/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update<T>(endpoint: string, id: number, data: any): Promise<T> {
    return this.request<T>(`/${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, id: number): Promise<void> {
    return this.request<void>(`/${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // Specific entity methods
  async getProjects() {
    return this.getAll<any>('projects');
  }

  async getProject(id: number) {
    return this.getById<any>('projects', id);
  }

  async createProject(data: any) {
    return this.create<any>('projects', data);
  }

  async updateProject(id: number, data: any) {
    return this.update<any>('projects', id, data);
  }

  async deleteProject(id: number) {
    return this.delete('projects', id);
  }

  // Similar methods for other entities
  async getClients() {
    return this.getAll<any>('clients');
  }

  async getClient(id: number) {
    return this.getById<any>('clients', id);
  }

  async createClient(data: any) {
    return this.create<any>('clients', data);
  }

  async updateClient(id: number, data: any) {
    return this.update<any>('clients', id, data);
  }

  async deleteClient(id: number) {
    return this.delete('clients', id);
  }

  async getEmployees() {
    return this.getAll<any>('employees');
  }

  async getEmployee(id: number) {
    return this.getById<any>('employees', id);
  }

  async createEmployee(data: any) {
    return this.create<any>('employees', data);
  }

  async updateEmployee(id: number, data: any) {
    return this.update<any>('employees', id, data);
  }

  async deleteEmployee(id: number) {
    return this.delete('employees', id);
  }

  async getSuppliers() {
    return this.getAll<any>('suppliers');
  }

  async getSupplier(id: number) {
    return this.getById<any>('suppliers', id);
  }

  async createSupplier(data: any) {
    return this.create<any>('suppliers', data);
  }

  async updateSupplier(id: number, data: any) {
    return this.update<any>('suppliers', id, data);
  }

  async deleteSupplier(id: number) {
    return this.delete('suppliers', id);
  }

  async getMaterials() {
    return this.getAll<any>('materials');
  }

  async getMaterial(id: number) {
    return this.getById<any>('materials', id);
  }

  async createMaterial(data: any) {
    return this.create<any>('materials', data);
  }

  async updateMaterial(id: number, data: any) {
    return this.update<any>('materials', id, data);
  }

  async deleteMaterial(id: number) {
    return this.delete('materials', id);
  }

  async getInventory() {
    return this.getAll<any>('inventory');
  }

  async getInventoryItem(id: number) {
    return this.getById<any>('inventory', id);
  }

  async createInventoryItem(data: any) {
    return this.create<any>('inventory', data);
  }

  async updateInventoryItem(id: number, data: any) {
    return this.update<any>('inventory', id, data);
  }

  async deleteInventoryItem(id: number) {
    return this.delete('inventory', id);
  }

  async getWarehouseRacks() {
    return this.getAll<any>('warehouse-racks');
  }

  async getWarehouseRack(id: number) {
    return this.getById<any>('warehouse-racks', id);
  }

  async createWarehouseRack(data: any) {
    return this.create<any>('warehouse-racks', data);
  }

  async updateWarehouseRack(id: number, data: any) {
    return this.update<any>('warehouse-racks', id, data);
  }

  async deleteWarehouseRack(id: number) {
    return this.delete('warehouse-racks', id);
  }
}

export const apiService = new ApiService();