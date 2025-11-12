import * as React from "react";

import { Input as BaseInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

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
  countries: Array<CountryOption>;
  selectedCountry?: string;
  onCountryChange?: (value: string) => void;
  key?: string;
}

const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
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
      <div className="relative">
        <BaseInput
          ref={ref}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          placeholder={
            variant === "default"
              ? (props.placeholder ?? undefined)
              : props.placeholder
          }
          className={cn(
            "w-full bg-transparent pr-4 pl-16! text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
            variant === "default"
              ? "h-[2.85rem] rounded-none border-none text-white placeholder:text-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              : "text-foreground focus:border-primary focus-visible:border-primary h-14 rounded-sm border border-gray-300 placeholder:text-[#B5B5B5] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:border-gray-200",
            error &&
              (variant === "default"
                ? "text-destructive"
                : "text-destructive border-red-500 focus:border-red-500"),
            className,
          )}
          {...props}
        />
        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2">
          <Select
            value={selectedCountry}
            onValueChange={onCountryChange}
            disabled={props.disabled}
          >
            <SelectTrigger
              className={cn(
                "h-8 w-auto border-0 bg-transparent p-0 pt-1 text-base shadow-none hover:bg-transparent focus:ring-0",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "[&>svg]:hidden",
              )}
            >
              <div className="flex items-center gap-1.5">
                {selectedCountryData ? (
                  <>
                    <span className="text-base text-white">
                      {selectedCountryData.dialCode}
                    </span>
                  </>
                ) : (
                  <span className="text-white">Select</span>
                )}
                <ChevronDownIcon className="size-4 text-white" />
              </div>
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={10}
              className="z-9999! max-h-[270px] w-[140px] overflow-hidden"
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
        </div>
      </div>
    );
  },
);

MobileInput.displayName = "MobileInput";

export default MobileInput;
