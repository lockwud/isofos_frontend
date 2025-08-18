// components/ClientModal.tsx
'use client'
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export default function ClientModal({ isOpen, onClose, client }: any) {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-md shadow-lg p-6 w-full max-w-md z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Client Details</h2>
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Address:</strong> {client.address}</p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="default">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
