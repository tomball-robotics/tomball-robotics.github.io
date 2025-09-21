import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Changed to BrowserRouter
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
import AdminSponsorshipTiers from "./pages/admin/AdminSponsorshipTiers";
import AdminRobots from "./pages/admin/AdminRobots";
import AdminUnitybots from "./pages/admin/AdminUnitybots";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminSlideshowImages from "./pages/admin/AdminSlideshowImages";
import AdminDashboardContent from "./pages/admin/AdminDashboardContent";
import AdminFooterSettings from "./pages/admin/AdminFooterSettings"; // Import new footer settings page

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
        <BrowserRouter> {/* Changed to BrowserRouter */}
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
              <Route index element={<AdminDashboardContent />} />
              {/* Specific Admin Pages */}
              <Route path="settings" element={<AdminWebsiteSettings />} />
              <Route path="footer" element={<AdminFooterSettings />} /> {/* New route for Footer Settings */}
              <Route path="events" element={<AdminEvents />} />
              <Route path="sponsors" element={<AdminSponsors />} />
              <Route path="sponsorship-tiers" element={<AdminSponsorshipTiers />} />
              <Route path="robots" element={<AdminRobots />} />
              <Route path="unitybots" element={<AdminUnitybots />} />
              <Route path="team-members" element={<AdminTeamMembers />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="slideshow-images" element={<AdminSlideshowImages />} />
              {/* Add more admin routes here as we build them */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter> {/* Changed to BrowserRouter */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;