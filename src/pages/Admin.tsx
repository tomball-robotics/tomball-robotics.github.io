import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout'; // Import the new AdminLayout

const Admin: React.FC = () => {
  // The AdminLayout handles authentication and navigation,
  // so this page simply acts as the entry point for the admin section.
  return <AdminLayout />;
};

export default Admin;