'use client';

import React from 'react'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session || !session.user) {
    router.push('/admin/login');
    return null;
  }

  if (session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-2">User Management</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage users, roles, and permissions</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm w-full"
          >
            Manage Users
          </button>
        </div>

        <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Vehicle Management</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage vehicle listings, categories, and specifications</p>
          <button
            onClick={() => router.push('/admin/vehicles')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm w-full"
          >
            Manage Vehicles
          </button>
        </div>

        <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Order Management</h3>
          <p className="text-sm text-muted-foreground mb-4">View and manage user orders</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm w-full"
          >
            Order History
          </button>
        </div>
      </div>
    </div>
  );
}
