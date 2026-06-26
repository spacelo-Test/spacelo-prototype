import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminProvider } from './AdminContext';
import AdminShell from './AdminShell';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <AdminProvider>
      <AdminShell handleLogout={handleLogout} />
    </AdminProvider>
  );
}
