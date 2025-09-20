import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSupabase } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { supabase, session } = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
        <h1 className="text-5xl font-extrabold text-[#0d2f60] mb-6">Admin Dashboard</h1>
        {session ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 mb-4">
              Welcome, {session.user?.email}! This is your protected admin area.
            </p>
            <p className="text-md text-gray-600 mb-6">
              Here you will be able to manage and edit your website's content.
            </p>
            <Button onClick={handleLogout} className="bg-[#d92507] hover:bg-[#b31f06] text-white">
              Logout
            </Button>
          </div>
        ) : (
          <p className="text-lg text-gray-700">You need to be logged in to access this page.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;