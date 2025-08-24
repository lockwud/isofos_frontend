// Database entity types based on SQL schema

export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
  }
  
  export interface ProjectType {
    id: number;
    type_name: 'house' | 'office' | 'store';
    description?: string;
  }
  
  export interface Project {
    id: number;
    client_id: number;
    project_type_id: number;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    client?: Client;
    project_type?: ProjectType;
  }
  
  export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
  }
  
  export interface Material {
    id: number;
    supplier_id: number;
    name: string;
    description?: string;
    unit_price: number;
    unit_of_measure?: string;
    created_at: string;
    supplier?: Supplier;
  }
  
  export interface WarehouseRack {
    id: number;
    name: string;
    location: string;
    capacity?: number;
    created_at: string;
  }
  
  export interface Inventory {
    id: number;
    material_id: number;
    rack_id: number;
    quantity: number;
    last_restocked?: string;
    material?: Material;
    rack?: WarehouseRack;
  }
  
  export interface Employee {
  id: Key | null | undefined;
  first_name: ReactNode;
  last_name: ReactNode;
  em_id: string;        // Changed from 'id: number'
  em_name: string;      // Changed from 'first_name' and 'last_name'
  em_roll: string;      // Changed from 'position'
  em_salary: number;    // Changed from 'base_salary'
  mng_id: string;       // New field for manager reference
  email?: string;       // Optional fields kept from original
  phone?: string;
  address?: string;
  hire_date?: string;
  created_at?: string;
}
  
  export interface ProjectMaterial {
    id: number;
    project_id: number;
    material_id: number;
    quantity: number;
    allocated_date?: string;
    project?: Project;
    material?: Material;
  }
  
  export interface ProjectEmployee {
    id: number;
    project_id: number;
    employee_id: number;
    role?: string;
    start_date?: string;
    end_date?: string;
    salary_allocation?: number;
    project?: Project;
    employee?: Employee;
  }
  
  export interface Manager {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    created_at: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
  }
  
  export interface AuthResponse {
    token: string;
    manager: Manager;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }