import React, { Suspense } from "react"; // Added Suspense
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { useSupabase } from "./components/SessionContextProvider";
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider

// Lazy load page components for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const Sponsors = React.lazy(() => import("./pages/Sponsors"));
const Donate = React.lazy(() => import("./pages/Donate"));
const Events = React.lazy(() => import("./pages/Events"));
const Robots = React.lazy(() => import("./pages/Robots"));
const About = React.lazy(() => import("./pages/About"));
const Unitybots = React.lazy(() => import("./pages/Unitybots"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const NewsIndex = React.lazy(() => import("./pages/NewsIndex"));
const NewsArticlePage = React.lazy(() => import("./pages/NewsArticle"));

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
        <HelmetProvider> {/* Wrap the entire app with HelmetProvider */}
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div>Loading...</div>}> {/* Add Suspense for lazy loaded components */}
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
                <Route path="/news" element={<NewsIndex />} />
                <Route path="/news/:id" element={<NewsArticlePage />} />

                {/* Protected Admin route */}
                <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;