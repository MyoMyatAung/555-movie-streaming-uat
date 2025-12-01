// OTP types
export interface SendOTPRequest {
  recipient: string;
  channel: "email" | "sms" | "phone";
  action:
    | "change-email"
    | "change-phone"
    | "register"
    | "login"
    | "forgot-password";
}

export interface SendOTPResponse {
  data?: {
    success: boolean;
    message?: string;
    expiresIn?: number;
    [key: string]: any;
  };
  message?: string;
  success?: boolean;
}

export interface VerifyOTPRequest {
  channel: "email" | "sms" | "phone";
  recipient: string;
  otp: string;
  action:
    | "change-email"
    | "change-phone"
    | "register"
    | "login"
    | "forgot-password";
}

export interface VerifyOTPResponse {
  data?: {
    success?: boolean;
    verified: boolean;
    message?: string;
    [key: string]: any;
  };
  message?: string;
  success?: boolean;
}
