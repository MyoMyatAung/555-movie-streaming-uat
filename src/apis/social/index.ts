// Export social API functions
export {
  getSocialLoginUrlApi,
  getSocialProvidersApi,
  socialLoginCallbackApi,
  socialRegisterApi,
} from "./socialApi";

// Export social queries
export { useGetSocialProviders } from "./queryGetSocialProviders";

// Export social mutations
export { useGetSocialLoginUrl } from "./mutationGetSocialLoginUrl";
export { useSocialLoginCallback } from "./mutationSocialLoginCallback";
export { useSocialRegister } from "./mutationSocialRegister";

// Export types
export type {
  SocialLoginCallbackRequest,
  SocialLoginCallbackResponse,
  SocialLoginUrlRequest,
  SocialLoginUrlResponse,
  SocialProvider,
  SocialProvidersResponse,
  SocialRegisterRequest,
  SocialRegisterResponse,
} from "@/types/social";
