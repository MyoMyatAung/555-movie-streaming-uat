import React, { createContext } from "react";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/common/form/FormField";
import { PasswordInput } from "@/components/common/form/PasswordInput";
import TextareaInput from "@/components/common/form/TextareaInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Form as BaseForm } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Input from "./Input";
import MobileInput from "./MobileInput";
import OTPInput from "./OTPInput";

const FormMethodsContext = createContext<UseFormReturn<FieldValues> | null>(
  null,
);

type FormProps<T extends FieldValues> = {
  id: string;
  formMethods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  onError?: (errors: FieldErrors<T>) => void;
  className?: string;
  children: React.ReactNode;
};

function Form<T extends FieldValues>({
  id,
  formMethods,
  onSubmit,
  onError,
  className,
  children,
}: FormProps<T>) {
  return (
    <FormMethodsContext.Provider
      value={formMethods as UseFormReturn<FieldValues>}
    >
      <BaseForm {...formMethods}>
        <form
          id={id}
          onSubmit={formMethods.handleSubmit(onSubmit, onError)}
          className={className}
          noValidate
        >
          {children}
        </form>
      </BaseForm>
    </FormMethodsContext.Provider>
  );
}

Form.InputField = function InputField<T extends FieldValues = FieldValues>({
  name,
  label,
  required = false,
  variant,
  ...props
}: {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  variant?: "border" | "default";
} & Omit<React.ComponentProps<typeof Input>, "variant">) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      className="w-full"
      control={control}
      field={{
        name,
        label,
        required,
        render: (
          <Input
            className="h-12 rounded-lg text-white"
            variant={variant}
            {...props}
          />
        ),
      }}
    />
  );
};

Form.PasswordField = function PasswordField<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  variant,
  ...props
}: {
  name: FieldPath<T>;
  label?: string;
  variant?: "border" | "default";
} & Omit<React.ComponentProps<typeof PasswordInput>, "variant">) {
  const { control } = useFormContext<T>();
  const { className, ...restProps } = props;

  return (
    <FormField
      className="w-full"
      control={control}
      field={{
        name,
        label,
        render: (
          <PasswordInput
            {...restProps}
            className={cn(
              "h-12 rounded-lg text-white",
              variant === "border" &&
                "rounded-none border-none bg-transparent px-0 pt-4 pb-1.5",
              className,
            )}
          />
        ),
      }}
    />
  );
};

Form.TextareaField = function TextareaField<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  optional = false,
  ...props
}: { name: FieldPath<T>; optional?: boolean } & React.ComponentProps<
  typeof TextareaInput
>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      field={{
        name,
        label,
        optional,
        render: <TextareaInput {...props} />,
      }}
    />
  );
};

Form.CheckboxField = function CheckboxField<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  ...props
}: { name: FieldPath<T>; label?: string } & Omit<
  React.ComponentProps<typeof Checkbox>,
  "value"
>) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      field={{
        name,
        render: (
          <Checkbox
            value={name}
            className="border-primary-pink data-[state=checked]:border-primary-pink data-[state=checked]:bg-primary-pink"
            {...props}
          />
        ),
      }}
    />
  );
};

Form.SwitchField = function SwitchField<T extends FieldValues = FieldValues>({
  name,
  className,
  ...props
}: {
  name: FieldPath<T>;
  className?: string;
} & Omit<React.ComponentProps<typeof Switch>, "checked" | "onCheckedChange">) {
  const { control, setValue, watch } = useFormContext<T>();
  const value = watch(name);
  return (
    <FormField
      control={control}
      className={cn("w-full", className)}
      field={{
        name,
        render: (
          <div className="flex items-center">
            <Switch
              {...props}
              checked={!!value}
              onCheckedChange={(checked) =>
                setValue(name, checked as PathValue<T, Path<T>>)
              }
            />
          </div>
        ),
      }}
    />
  );
};

Form.MobileField = function MobileField<T extends FieldValues = FieldValues>({
  name,
  label,
  variant = "default",
  countries,
  selectedCountry,
  onCountryChange,
  ...props
}: {
  name: FieldPath<T>;
  label?: string;
  variant?: "border" | "default";
  countries: Array<{
    code: string;
    name: string;
    dialCode: string;
    flag: React.ReactNode;
  }>;
  selectedCountry?: string;
  onCountryChange?: (value: string) => void;
} & Omit<
  React.ComponentProps<typeof MobileInput>,
  "countries" | "selectedCountry" | "onCountryChange"
>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      className="w-full **:data-[slot=form-label]:left-20"
      control={control}
      field={{
        name,
        label,
        labelClassName: "left-20",
        render: (
          <MobileInput
            label={label}
            countries={countries}
            selectedCountry={selectedCountry}
            onCountryChange={onCountryChange}
            {...props}
          />
        ),
      }}
    />
  );
};

Form.OTPField = function OTPField<T extends FieldValues = FieldValues>({
  name,
  label,
  variant = "default",
  onResend,
  ...props
}: {
  name: FieldPath<T>;
  label?: string;
  variant?: "border" | "default";
  onResend?: () => void;
} & Omit<React.ComponentProps<typeof OTPInput>, "onResend">) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      className="w-full"
      control={control}
      field={{
        name,
        label,
        render: <OTPInput label={label} onResend={onResend} {...props} />,
      }}
    />
  );
};

export { Form };
