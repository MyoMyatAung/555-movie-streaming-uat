import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Input from "./Input";

interface OTPInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
  onResend?: () => void;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ className, label, error, onResend, ...props }, ref) => {
    const { t } = useTranslation();
    // const [countdown, setCountdown] = useState(0);
    // const [hasRequested, setHasRequested] = useState(false);

    const handleResend = () => {
      onResend?.();
      // setCountdown(5);
      // setHasRequested(true);
    };

    // useEffect(() => {
    //   if (countdown > 0) {
    //     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    //     return () => clearTimeout(timer);
    //   }
    // }, [countdown]);

    return (
      <div>
        <div className="relative">
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              error={error}
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
            {onResend && !props.disabled && (
              <button
                type="button"
                onClick={handleResend}
                disabled={props.disabled}
                className={cn(
                  "absolute top-1/2 right-4 -translate-y-1/2 text-base text-gray-600 hover:text-gray-700",
                )}
              >
                {t("forms.otp.getOTP")}
                {/* {hasRequested
                  ? countdown > 0
                    ? t("forms.otp.resendOTPWithTimer", { time: countdown })
                    : t("forms.otp.resendOTP")
                  : t("forms.otp.getOTP")} */}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

OTPInput.displayName = "OTPInput";

export default OTPInput;
