// OTP types
export interface SendOTPRequest {
  recipient: string;
  channel: "email" | "sms" | "phone";
  action: "changeEmail" | "changePhone" | "register" | "login";
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
  action: "changeEmail" | "changePhone" | "register" | "login";
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
