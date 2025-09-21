import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteSettings } from '@/types/supabase';
import FooterSettingsForm from '@/components/admin/FooterSettingsForm';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';

const AdminFooterSettings: React.FC = () => {
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
      console.error('Error fetching website settings for footer:', error);
      setError('Failed to load footer settings. Please ensure there is exactly one entry in the "website_settings" table.');
      showError('Failed to load footer settings.');
      setSettings(null);
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData: Partial<WebsiteSettings>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving footer settings...');

    if (!settings) {
      showError('No settings found to update. Please ensure an initial entry exists and is correctly fetched.');
      dismissToast(toastId);
      setIsSubmitting(false);
      return;
    }

    console.log('[AdminFooterSettings] Attempting to update footer settings with ID:', settings.id, 'Data:', formData);
    const { error } = await supabase
      .from('website_settings')
      .update(formData)
      .eq('id', settings.id);

    dismissToast(toastId);
    if (error) {
      console.error('Error updating footer settings:', error);
      showError(`Failed to save footer settings: ${error.message}`);
    } else {
      console.log('[AdminFooterSettings] Footer settings updated successfully.');
      showSuccess('Footer settings saved successfully!');
      fetchSettings(); // Re-fetch to ensure UI is up-to-date
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading footer settings..." />
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"> {/* Added wrapper div */}
      <h2 className="text-3xl font-bold text-[#0d2f60] mb-6">Edit Footer Settings</h2>
      <FooterSettingsForm
        initialData={settings}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminFooterSettings;