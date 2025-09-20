import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/components/SessionContextProvider';
import { useEffect } from 'react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      // User is logged in, redirect to a protected page (e.g., home or a dashboard)
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#0d2f60] mb-6">Login to Tomball Robotics</h1>
        <Auth
          supabaseClient={supabase}
          // Removed providers={['google']} to enable email/password by default
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0d2f60', // Primary blue color
                  brandAccent: '#d92507', // Accent red color
                },
              },
            },
          }}
          theme="light"
          redirectTo={window.location.origin + '/#/'} // Redirect to home after login
        />
      </div>
    </div>
  );
};

export default Login;