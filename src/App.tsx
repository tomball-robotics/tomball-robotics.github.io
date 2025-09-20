import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Sponsors from "./pages/Sponsors";
import Donate from "./pages/Donate";
import Events from "./pages/Events";
import Robots from "././pages/Robots";
import About from "./pages/About";
import Unitybots from "./pages/Unitybots";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/ScrollToTop";
import { useSupabase } from "./components/SessionContextProvider";
import AdminWebsiteSettings from "./pages/admin/AdminWebsiteSettings";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminSponsors from "./pages/admin/AdminSponsors";
import AdminTeamMembers from "./pages/admin/AdminTeamMembers";
import AdminSponsorshipTiers from "./pages/admin/AdminSponsorshipTiers"; // Import new admin page

const queryClient = new QueryClient();

// A wrapper component to protect routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useSupabase();
  if (!session) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/events" element={<Events />} />
            <Route path="/robots" element={<Robots />} />
            <Route path="/about" element={<About />} />
            <Route path="/unitybots" element={<Unitybots />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}>
              {/* Admin Dashboard (default for /admin) */}
              <Route index element={<h2 className="text-3xl font-bold text-[#0d2f60]">Welcome to the Admin Dashboard!</h2>} />
              {/* Specific Admin Pages */}
              <Route path="settings" element={<AdminWebsiteSettings />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="sponsors" element={<AdminSponsors />} />
              <Route path="sponsorship-tiers" element={<AdminSponsorshipTiers />} />
              <Route path="team-members" element={<AdminTeamMembers />} />
              {/* Add more admin routes here as we build them */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;