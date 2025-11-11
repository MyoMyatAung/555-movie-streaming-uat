import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import Input from "./Input";

interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: React.ReactNode;
}

interface MobileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onKeyDown" | "onPaste" | "popover"
  > {
  label?: string;
  error?: boolean;
  variant?: "default" | "border";
  countries: CountryOption[];
  selectedCountry?: string;
  onCountryChange?: (value: string) => void;
  key?: string;
}

const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  (
    {
      className,
      label,
      error,
      variant = "border",
      countries,
      selectedCountry,
      onCountryChange,
      key = "mobile",
      ...props
    },
    ref,
  ) => {
    const selectedCountryData = countries.find(
      (c) => c.dialCode === selectedCountry,
    );

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow only numbers, backspace, delete, arrow keys, tab
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ];
      if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      // Only allow pasting numbers
      const pastedData = e.clipboardData.getData("text");
      if (!/^\d+$/.test(pastedData)) {
        e.preventDefault();
      }
    };

    return (
      <div>
        <div className="relative">
          <div className="relative">
            <Input
              type="tel"
              placeholder=" "
              inputMode="numeric"
              pattern="[0-9]*"
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              error={error}
              className={cn(
                "peer h-14 w-full rounded-sm bg-transparent pr-4 pl-24 text-base transition-all outline-none placeholder:text-base",
                "border border-gray-300",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "focus:!border-primary-yellow focus:border",
                "disabled:border-gray-200",
                error && "border-red-500 focus:border-red-500",
                className,
              )}
              ref={ref}
              {...(props as React.ComponentProps<typeof Input>)}
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
            <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-3">
              <Select
                value={selectedCountry}
                onValueChange={onCountryChange}
                disabled={props.disabled}
              >
                <SelectTrigger
                  className={cn(
                    "h-8 w-auto border-0 bg-transparent p-0 text-base shadow-none hover:bg-transparent focus:ring-0",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "[&>svg]:hidden",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {selectedCountryData ? (
                      <>
                        <span className="text-[20px]">
                          {selectedCountryData.flag}
                        </span>
                        <span className="text-base text-gray-600">
                          {selectedCountryData.dialCode}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#B5B5B5]">Select</span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  sideOffset={10}
                  className="!z-[9999] max-h-[270px] w-[140px] overflow-hidden"
                >
                  {countries.map((country) => (
                    <SelectItem
                      key={key + "-" + country.code + "-" + country.dialCode}
                      value={country.dialCode}
                      className="rounded-sm py-1.5 pr-6 pl-2 hover:bg-gray-50 focus:bg-gray-50 data-[state=checked]:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[20px]">{country.flag}</span>
                        <span className="text-base text-gray-600">
                          {country.dialCode}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-5 w-px bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

MobileInput.displayName = "MobileInput";

export default MobileInput;
