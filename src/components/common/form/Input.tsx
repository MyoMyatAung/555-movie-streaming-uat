import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "popover"> {
  label?: string;
  error?: boolean;
  variant?: "default" | "border";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, variant, value, ...props }, ref) => {
    const controlledValue = value ?? "";

    return (
      <div>
        {variant === "default" ? (
          <div className="flex flex-col gap-1.5">
            {label && (
              <label
                className={cn(
                  "text-sm font-medium text-gray-700",
                  error && "text-red-500",
                  props.disabled && "text-gray-400",
                )}
              >
                {label}
              </label>
            )}
            <div className="relative">
              <BaseInput
                type={type}
                className={cn(
                  "h-14 w-full rounded-sm bg-transparent px-4 text-base transition-all outline-none placeholder:text-base placeholder:text-[#B5B5B5]",
                  "border-b border-gray-300",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "focus:!border-primary-yellow focus:border",
                  "disabled:border-gray-200",
                  error && "border-red-500 focus:border-red-500",
                  className,
                )}
                ref={ref}
                value={controlledValue}
                autoComplete={props.name}
                {...props}
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <BaseInput
              type={type}
              placeholder=" "
              className={cn(
                "peer h-14 w-full rounded-sm bg-transparent px-4 text-base transition-all outline-none placeholder:text-base",
                "border border-gray-300",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "focus:!border-primary-yellow focus:border",
                "disabled:border-gray-200",
                error && "border-red-500 focus:border-red-500",
                className,
              )}
              ref={ref}
              value={controlledValue}
              autoComplete={props.name}
              {...props}
            />
            {label && (
              <span
                className={cn(
                  "absolute -top-[0.7rem] left-[0.7rem] bg-white px-1 text-sm text-gray-500",
                  "peer-focus:!text-primary-yellow",
                  error && "text-red-500 peer-focus:text-red-500",
                  props.disabled && "bg-gray-50 text-gray-400",
                )}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
