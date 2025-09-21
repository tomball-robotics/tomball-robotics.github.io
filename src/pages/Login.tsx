import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '@/components/SessionContextProvider';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      // User is logged in, redirect to the admin page
      navigate('/admin');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#0d2f60]">
            Admin Login
          </h1>
          <p className="text-gray-700 mt-2">Access the Tomball Robotics dashboard.</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          providers={[]} // Only email/password
          appearance={{
            className: {
              container: 'space-y-4',
              button: 'flex justify-center items-center w-full bg-[#d92507] hover:bg-[#b31f06] text-white font-bold py-2 px-4 rounded-md transition-colors',
              input: 'block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d2f60] focus:border-[#0d2f60]',
              label: 'block text-sm font-medium text-gray-700',
              anchor: 'text-sm text-[#0d2f60] hover:underline',
              message: 'text-sm text-red-600',
            },
          }}
          theme="light"
          redirectTo={window.location.origin} // Redirect to home after magic link login, router will handle the rest
        />

        <div className="mt-8 text-center">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-[#0d2f60]">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;