import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';

interface LinkArrayInputFieldProps {
  form: UseFormReturn<any>;
  name: string; // e.g., 'links'
  label: string; // e.g., 'Links'
}

const LinkArrayInputField: React.FC<LinkArrayInputFieldProps> = ({ form, name, label }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col sm:flex-row items-end sm:items-center gap-2 p-3 border rounded-md bg-gray-50">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <FormField
                control={form.control}
                name={`${name}.${index}.text`}
                render={({ field: text_field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="sr-only">Link Text</FormLabel>
                    <FormControl>
                      <Input
                        {...text_field}
                        placeholder="Link Text"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${name}.${index}.url`}
                render={({ field: url_field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="sr-only">Link URL</FormLabel>
                    <FormControl>
                      <Input
                        {...url_field}
                        placeholder="Link URL"
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
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ text: '', url: '' })}
          disabled={form.formState.isSubmitting}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Link
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default LinkArrayInputField;