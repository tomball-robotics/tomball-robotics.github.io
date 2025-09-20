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
import Login from "./pages/Login"; // Import the new Login page
import ScrollToTop from "./components/ScrollToTop";
import { useSupabase } from "./components/SessionContextProvider"; // Import useSupabase

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
            <Route path="/login" element={<Login />} />
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/sponsors" element={<ProtectedRoute><Sponsors /></ProtectedRoute>} />
            <Route path="/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/robots" element={<ProtectedRoute><Robots /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/unitybots" element={<ProtectedRoute><Unitybots /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;