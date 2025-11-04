import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '@/components/SessionContextProvider';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async'; // Import Helmet

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
      <Helmet>
        <title>Admin Login - Tomball T3 Robotics</title>
        <meta name="description" content="Log in to the Tomball T3 Robotics website administration panel." />
      </Helmet>
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
          view="sign_in"
          showLinks={false}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0d2f60',
                  brandAccent: '#d92507',
                },
              },
            },
          }}
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