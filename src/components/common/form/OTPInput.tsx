import * as React from "react";

import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface OTPInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
  onResend?: () => void;
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ className, label: _label, error, onResend, ...props }, ref) => {
    const { t } = useTranslation();
    const showResend = Boolean(onResend && !props.disabled);

    return (
      <div className="relative w-full">
        <BaseInput
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          className={cn(
            "w-full pr-24 text-base text-white placeholder:text-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "text-destructive",
            props.disabled && "opacity-60",
            className,
          )}
          {...props}
        />
        {showResend && (
          <button
            type="button"
            onClick={onResend}
            disabled={props.disabled}
            className={cn(
              "absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-white/80 transition-colors",
              "hover:text-white focus-visible:outline-none",
              props.disabled && "text-muted-foreground cursor-not-allowed",
            )}
          >
            {t("forms.otp.getOTP")}
          </button>
        )}
      </div>
    );
  },
);

OTPInput.displayName = "OTPInput";

export default OTPInput;
