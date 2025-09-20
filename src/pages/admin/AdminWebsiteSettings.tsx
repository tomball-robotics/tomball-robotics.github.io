import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteSettings } from '@/types/supabase';
import WebsiteSettingsForm from '@/components/admin/WebsiteSettingsForm';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

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
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching website settings:', error);
      setError('Failed to load website settings.');
      showError('Failed to load website settings.');
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData: Partial<WebsiteSettings>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving website settings...');

    if (!settings) {
      showError('No settings found to update. Please ensure an initial entry exists.');
      dismissToast(toastId);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('website_settings')
      .update(formData)
      .eq('id', settings.id);

    dismissToast(toastId);
    if (error) {
      console.error('Error updating website settings:', error);
      showError('Failed to save website settings.');
    } else {
      showSuccess('Website settings saved successfully!');
      fetchSettings(); // Re-fetch to ensure UI is up-to-date
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading website settings...</p>
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
        <p className="text-lg text-gray-600">No website settings found. Please add an initial entry in Supabase.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-[#0d2f60] mb-6">Edit Website Settings</h2>
      <WebsiteSettingsForm
        initialData={settings}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminWebsiteSettings;