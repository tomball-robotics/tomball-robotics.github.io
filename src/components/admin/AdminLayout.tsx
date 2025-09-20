import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { PanelLeft, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSupabase } from '@/components/SessionContextProvider';
import AdminSidebar from './AdminSidebar'; // Import the sidebar

const AdminLayout: React.FC = () => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden fixed top-4 left-4 z-50">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs flex flex-col">
          <nav className="grid gap-6 text-lg font-medium pt-8">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <Home className="h-6 w-6" />
              <span>Home</span>
            </Link>
            <AdminSidebar />
          </nav>
          <div className="mt-auto p-4">
            <Button onClick={handleLogout} className="w-full" variant="destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-6 w-6" />
            <span className="">Tomball Robotics</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <AdminSidebar />
        </div>
        <div className="mt-auto p-4 border-t">
          <Button onClick={handleLogout} className="w-full" variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-y-auto"> {/* Added overflow-y-auto */}
          <Outlet /> {/* This is where nested routes will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;