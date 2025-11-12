import * as React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField as BaseFormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  field: {
    name: Path<T>;
    label?: string;
    required?: boolean;
    optional?: boolean;
    labelClassName?: string;
    render: React.ReactNode;
  };
  className?: string;
};

export const FormField = <T extends FieldValues>({
  control,
  field,
  className,
}: FormFieldProps<T>) => {
  const hasValue = React.useCallback((value: unknown) => {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    if (typeof value === "number") {
      return true;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      return true;
    }

    return false;
  }, []);

  return (
    <BaseFormField
      key={field.name}
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const hasLabel = Boolean(field.label);
        const isFilled = hasValue(formField.value);

        let controlNode: React.ReactNode = field.render;
        if (React.isValidElement(field.render)) {
          const renderElement = field.render as React.ReactElement<
            Record<string, unknown>
          >;
          const originalProps = renderElement.props;
          const originalClassName =
            typeof originalProps.className === "string"
              ? originalProps.className
              : undefined;
          const originalPlaceholder =
            typeof originalProps.placeholder === "string"
              ? originalProps.placeholder
              : undefined;

          controlNode = React.cloneElement(renderElement, {
            ...(formField as unknown as Record<string, unknown>),
            className: cn(
              originalClassName,
              hasLabel &&
                "h-auto min-h-[2.65rem] w-full rounded-none border-none bg-transparent px-0 pb-1.5 pt-4 text-base text-white placeholder:text-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            ),
            placeholder:
              hasLabel && originalPlaceholder === undefined
                ? " "
                : originalPlaceholder,
            "data-filled": hasLabel && isFilled ? "true" : undefined,
          });
        }

        const labelContent = hasLabel ? (
          <>
            {field.label}
            {field.required && (
              <span className="ml-1 text-xs text-red-500">*</span>
            )}
            {field.optional && (
              <span className="text-text-inactive ml-2 text-xs">
                (Optional)
              </span>
            )}
          </>
        ) : null;

        return (
          <FormItem
            className={cn(
              "w-full",
              hasLabel ? "space-y-1" : "space-y-1",
              className,
            )}
          >
            {hasLabel ? (
              <div
                data-filled={isFilled ? "true" : undefined}
                className={cn(
                  "group focus-within:border-primary-blue bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(123,177,248,0.02)_100%);] relative w-full rounded-lg border border-[#AAAAAA] px-3 pt-0.5 pb-1.5 transition-colors duration-200 focus-within:bg-[#2496FF0A]",
                  "focus-within:bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0%,rgba(123,177,248,0.05)_100%)]",
                  fieldState.invalid &&
                    "border-red-500 focus-within:border-red-500 focus-within:bg-red-500/10",
                )}
              >
                <FormControl>{controlNode}</FormControl>
                <FormLabel
                  className={cn(
                    "absolute top-1/2 left-3 origin-left -translate-y-1/2 text-base text-[#AAAAAA] transition-all duration-150",
                    "group-focus-within:top-0.5 group-focus-within:translate-y-0 group-focus-within:text-xs",
                    "group-data-[filled=true]:top-0.5 group-data-[filled=true]:translate-y-0 group-data-[filled=true]:text-xs group-data-[filled=true]:text-[#AAAAAA]",
                    fieldState.invalid &&
                      "text-red-400 group-focus-within:text-red-400 group-data-[filled=true]:text-red-400",
                    field.labelClassName,
                  )}
                >
                  <span className="rounded-sm bg-transparent py-0.5">
                    {labelContent}
                  </span>
                </FormLabel>
              </div>
            ) : (
              <>
                {labelContent && <FormLabel>{labelContent}</FormLabel>}
                <FormControl>{controlNode}</FormControl>
              </>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
