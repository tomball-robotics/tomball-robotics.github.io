import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteSettings } from '@/types/supabase';
import WebsiteSettingsForm from '@/components/admin/WebsiteSettingsForm';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';

const AdminWebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching website settings:', error);
      setError('Failed to load website settings. Please ensure there is exactly one entry in the "website_settings" table.');
      showError('Failed to load website settings.');
      setSettings(null);
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData: Partial<WebsiteSettings>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving website settings...');

    if (!settings) {
      showError('No settings found to update. Please ensure an initial entry exists and is correctly fetched.');
      dismissToast(toastId);
      setIsSubmitting(false);
      return;
    }

    console.log('[AdminWebsiteSettings] Attempting to update settings with ID:', settings.id, 'Data:', formData);
    const { error } = await supabase
      .from('website_settings')
      .update(formData)
      .eq('id', settings.id);

    dismissToast(toastId);
    if (error) {
      console.error('Error updating website settings:', error);
      showError(`Failed to save website settings: ${error.message}`);
    } else {
      console.log('[AdminWebsiteSettings] Website settings updated successfully.');
      showSuccess('Website settings saved successfully!');
      fetchSettings();
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading website settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchSettings} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-gray-600">No website settings found. Please ensure an initial entry exists in your Supabase `website_settings` table.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="max-w-4xl mx-auto"> {/* Inner wrapper for centering content */}
        <h2 className="text-3xl font-bold text-[#0d2f60] mb-6">Edit Website Settings</h2>
        <WebsiteSettingsForm
          initialData={settings}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AdminWebsiteSettings;