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
import Admin from "./pages/Admin"; // Import the new Admin page
import ScrollToTop from "./components/ScrollToTop";
import { useSupabase } from "./components/SessionContextProvider";

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

            {/* Protected Admin route */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;