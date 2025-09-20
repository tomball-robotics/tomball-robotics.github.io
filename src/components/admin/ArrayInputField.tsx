import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';

interface ArrayInputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

const ArrayInputField: React.FC<ArrayInputFieldProps> = ({ form, name, label, placeholder }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name={`${name}.${index}`}
              render={({ field: itemField }) => (
                <FormControl>
                  <Input
                    {...itemField}
                    placeholder={placeholder || `Enter ${label.toLowerCase().slice(0, -1)}`}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
              disabled={form.formState.isSubmitting}
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('')}
          disabled={form.formState.isSubmitting}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add {label.toLowerCase().slice(0, -1)}
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default ArrayInputField;