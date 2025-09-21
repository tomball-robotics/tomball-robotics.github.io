import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, XCircle, Facebook, Instagram, Youtube, X, Linkedin, Github, Globe } from 'lucide-react';
import { SocialMediaLink } from '@/types/supabase';

// Map social media types to Lucide icons
const socialMediaIcons: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: X,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  custom: Globe, // Default icon for custom or unknown types
};

const socialMediaOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'website', label: 'Website' },
  { value: 'custom', label: 'Custom Link' },
];

interface SocialMediaInputFieldProps {
  form: UseFormReturn<any>;
  name: string; // e.g., 'social_media_links'
  label: string; // e.g., 'Social Media Links'
}

const SocialMediaInputField: React.FC<SocialMediaInputFieldProps> = ({ form, name, label }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const currentType = form.watch(`${name}.${index}.type`);
          const Icon = socialMediaIcons[currentType] || socialMediaIcons.custom;

          return (
            <div key={field.id} className="flex flex-col sm:flex-row items-end sm:items-center gap-2 p-3 border rounded-md bg-gray-50">
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2 w-full items-center">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#0d2f60]" />
                  <FormField
                    control={form.control}
                    name={`${name}.${index}.type`}
                    render={({ field: typeField }) => (
                      <FormItem className="w-full space-y-1">
                        <FormLabel className="sr-only">Social Media Type</FormLabel>
                        <Select onValueChange={typeField.onChange} defaultValue={typeField.value} disabled={form.formState.isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select social media type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {socialMediaOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`${name}.${index}.url`}
                  render={({ field: urlField }) => (
                    <FormItem className="sm:col-span-2 w-full space-y-1">
                      <FormLabel className="sr-only">URL</FormLabel>
                      <FormControl>
                        <Input
                          {...urlField}
                          placeholder="Enter URL"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={form.formState.isSubmitting}
                className="flex-shrink-0"
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove link</span>
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ type: 'custom', url: '' } as SocialMediaLink)}
          disabled={form.formState.isSubmitting}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default SocialMediaInputField;