'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiService } from '@/lib/api';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter((client: any) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

 const fetchClients = async () => {
  try {
    setLoading(true);
    const data = await apiService.getClients();
    console.log("Clients API response:", data);

    // Normalize response into an array
    const clientsArray = Array.isArray(data)
      ? data
      : data.clients || data.data || [];

    setClients(clientsArray);
    setFilteredClients(clientsArray);
  } catch (error) {
    toast.error('Failed to load clients');
  } finally {
    setLoading(false);
  }
};

  const deleteClient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await apiService.deleteClient(id);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="mt-2 text-gray-600">Manage your client relationships</p>
          </div>
          <Link href="/clients/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clients Grid */}
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
            {filteredClients.map((client: any) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {client.phone}
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {client.address}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Joined: {new Date(client.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Link href={`/clients/${client.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/clients/${client.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteClient(client.id)}
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

        {!loading && filteredClients.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No clients found</p>
              <Link href="/clients/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}