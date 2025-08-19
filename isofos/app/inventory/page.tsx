"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/lib/api";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Box,
  Warehouse,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Material, WarehouseRack } from "@/types";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [racks, setRacks] = useState<WarehouseRack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [inv, mats, wracks] = await Promise.all([
        apiService.getInventory(),
        apiService.getMaterials(),
        apiService.getWarehouseRacks(),
      ]);

      setInventory(Array.isArray(inv) ? inv : []);
      setMaterials(mats);
      setRacks(wracks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const getMaterialName = (id: number) =>
    materials.find((m) => m.id === id)?.name || "Unknown material";

  const getRackName = (id: number) =>
    racks.find((r) => r.id === id)?.name || "Unknown rack";

  const deleteInventoryItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inventory item?"))
      return;
    try {
      await apiService.deleteInventoryItem(id);
      toast.success("Inventory item deleted successfully");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete inventory item");
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const materialName = getMaterialName(item.material_id).toLowerCase();
    const rackName = getRackName(item.rack_id).toLowerCase();
    return (
      materialName.includes(searchTerm.toLowerCase()) ||
      rackName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="mt-2 text-gray-600">Manage your material inventory</p>
          </div>
          <Link href="/inventory/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Inventory Item
            </Button>
          </Link>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Warehouse Rack</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Box className="h-4 w-4 mr-2" />
                        {getMaterialName(item.material_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Warehouse className="h-4 w-4 mr-2" />
                        {getRackName(item.rack_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 mr-2" />
                        {item.quantity}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.last_restocked
                        ? new Date(item.last_restocked).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`/inventory/${item.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/inventory/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteInventoryItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
