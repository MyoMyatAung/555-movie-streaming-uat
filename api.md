# Geetest API

## GET `/api/v1/geetest/register`
Initialize Geetest CAPTCHA and retrieve a challenge token. This endpoint is used to start the CAPTCHA verification process.

**Request:**
```bash
# Frontend (default)
curl "https://efdfd435gv.qdhgtch.com/api/v1/geetest/register?platform=frontend"

# Android
curl "https://efdfd435gv.qdhgtch.com/api/v1/geetest/register?platform=android"

# Without platform parameter (defaults to frontend)
curl "https://efdfd435gv.qdhgtch.com/api/v1/geetest/register"
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | No | Platform type: `frontend` or `android`. Defaults to `frontend` if not provided |

**Success Response (200) - Normal Mode:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "success": 1,
    "challenge": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "gt": "c4e744f7659b6f444d1c73b876424422"
  }
}
```

**Success Response (200) - Failback Mode:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "success": 0,
    "challenge": "failback_challenge_token_here",
    "gt": "c4e744f7659b6f444d1c73b876424422"
  }
}
```

> **Important Notes**:
> - `success: 1` indicates normal mode (Geetest service is available)
> - `success: 0` indicates failback mode (Geetest service is unavailable, use local validation)
> - The `challenge` token is required for the validate endpoint
> - The `gt` (captcha ID) is used by the frontend to initialize the CAPTCHA widget
> - Different credentials are used for `frontend` and `android` platforms
> - Frontend ID: `c4e744f7659b6f444d1c73b876424422`
> - Android ID: `8c675a3ff657e49e6c05a2be3e24f4e7`

## POST `/api/v1/geetest/validate`
Validate the Geetest CAPTCHA response from the client. This endpoint verifies that the user successfully completed the CAPTCHA challenge.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/geetest/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "geetest_challenge": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "geetest_validate": "validate_token_here",
    "geetest_seccode": "seccode_token_here",
    "platform": "frontend"
  }'
```

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `geetest_challenge` | string | Yes | The challenge token received from the register endpoint |
| `geetest_validate` | string | Yes | The validation token from the CAPTCHA completion |
| `geetest_seccode` | string | Yes | The security code from the CAPTCHA completion |
| `platform` | string | No | Platform type: `frontend` or `android`. Defaults to `frontend` if not provided |

**Success Response (200):**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "result": "success",
    "version": "3.0.0"
  }
}
```

**Failure Response (200):**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "result": "fail",
    "msg": "Local validation failed"
  }
}
```

**Validation Error (422):**
```json
{
  "error": {
    "code": "geetest_challenge",
    "detail": "The geetest challenge field is required."
  }
}
```

> **Important Notes**:
> - This endpoint validates the CAPTCHA response both locally and with Geetest servers
> - `result: "success"` means the CAPTCHA was completed successfully
> - `result: "fail"` means the validation failed (invalid tokens or tampering detected)
> - The validation process:
>   1. First performs local validation using the private key
>   2. Then optionally verifies with Geetest servers
>   3. If server validation fails but local validation passes, it still returns success (handles network issues)
> - In failback mode (when `success: 0` from register), validation is performed locally only
> - All three parameters (`geetest_challenge`, `geetest_validate`, `geetest_seccode`) are required
> - The `platform` parameter should match the one used in the register endpoint

## Testing Instructions

### 1. Test Register Endpoint (Frontend)

```bash
# Test with frontend platform
curl "http://localhost:8000/api/v1/geetest/register?platform=frontend"

# Expected response:
# {
#   "status": true,
#   "message": "Success",
#   "data": {
#     "success": 1,
#     "challenge": "...",
#     "gt": "c4e744f7659b6f444d1c73b876424422"
#   }
# }
```

### 2. Test Register Endpoint (Android)

```bash
# Test with android platform
curl "http://localhost:8000/api/v1/geetest/register?platform=android"

# Expected response:
# {
#   "status": true,
#   "message": "Success",
#   "data": {
#     "success": 1,
#     "challenge": "...",
#     "gt": "8c675a3ff657e49e6c05a2be3e24f4e7"
#   }
# }
```

### 3. Test Validate Endpoint

**Note:** To properly test the validate endpoint, you need to:
1. First call the register endpoint to get a valid challenge
2. Complete the CAPTCHA on the frontend (or use Geetest's test credentials)
3. Use the returned values to call the validate endpoint

```bash
# Example validate request (with actual values from CAPTCHA completion)
curl -X POST http://localhost:8000/api/v1/geetest/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "geetest_challenge": "challenge_from_register",
    "geetest_validate": "validate_from_captcha",
    "geetest_seccode": "seccode_from_captcha",
    "platform": "frontend"
  }'
```

### 4. Integration Testing with Frontend

1. **Initialize CAPTCHA:**
   ```javascript
   // Call register endpoint
   fetch('/api/v1/geetest/register?platform=frontend')
     .then(res => res.json())
     .then(data => {
       const { challenge, gt } = data.data;
       
       // Initialize Geetest widget
       initGeetest4({
         captchaId: gt,
         product: 'float',
         challenge: challenge,
         // ... other options
       }, function (captchaObj) {
         captchaObj.appendTo('#captcha-container');
         
         captchaObj.onSuccess(function () {
           const result = captchaObj.getValidate();
           
           // Send to validate endpoint
           fetch('/api/v1/geetest/validate', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               geetest_challenge: result.geetest_challenge,
               geetest_validate: result.geetest_validate,
               geetest_seccode: result.geetest_seccode,
               platform: 'frontend'
             })
           })
           .then(res => res.json())
           .then(validationResult => {
             if (validationResult.data.result === 'success') {
               // CAPTCHA validated successfully
               console.log('CAPTCHA verified!');
             }
           });
         });
       });
     });
   ```

### 5. Testing Failback Mode

To test failback mode, you can temporarily block access to Geetest API or simulate network errors. The system will automatically fall back to local validation.

### 6. Using Postman/API Testing Tools

**Register Request:**
- Method: `GET`
- URL: `http://localhost:8000/api/v1/geetest/register?platform=frontend`
- Headers: None required

**Validate Request:**
- Method: `POST`
- URL: `http://localhost:8000/api/v1/geetest/validate`
- Headers: `Content-Type: application/json`
- Body (JSON):
  ```json
  {
    "geetest_challenge": "your_challenge_here",
    "geetest_validate": "your_validate_here",
    "geetest_seccode": "your_seccode_here",
    "platform": "frontend"
  }
  ```

# Auth API

## Error Format

All validation errors (except social login endpoints) return the following format:

```json
{
  "error": {
    "code": "field_name",
    "detail": "Error message describing what went wrong."
  }
}
```

- **code**: The field name or error type that caused the validation failure
- **detail**: A human-readable error message

Example:
```json
{
  "error": {
    "code": "otp",
    "detail": "The provided OTP is invalid or has expired."
  }
}
```

> **Note**: Social login endpoints (`/api/v1/auth/social-login/*`) use Laravel's default validation error format and are excluded from this standard format.

## POST `/api/v1/auth/send-otp`
Initiate OTP delivery for registration, login, or password recovery.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/send-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "channel": "email",
    "recipient": "user@example.com",
    "action": "register"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "channel": "email",
    "destination": "user@example.com",
    "action": "login"
  }
}
```

> `action` accepts `register`, `login`, `forgot-password`, `change-phone`, or `change-email`. When the channel is `email`, the `recipient` must be a valid email address; when the channel is `phone`, it must be a digits-only phone number (optionally prefixed with `+`). For `login` and `forgot-password`, the recipient must already belong to an existing account. For `change-phone` and `change-email`, the recipient may not exist yet (it's the new phone/email being verified).

## POST `/api/v1/auth/check-otp`
Validate the OTP and receive a short-lived verification token.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/check-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "channel": "email",
    "recipient": "user@example.com",
    "otp": "123456",
    "action": "register"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "token": "a9c1b4c0-9c2a-4e9a-9ac4-7d6fd9f0d1ef"
  }
}
```

> Use the same `channel`, `recipient`, and `action` you provided when requesting the OTP. `action` must be one of `register`, `login`, `forgot-password`, `change-phone`, or `change-email`. Invalid or expired OTP returns HTTP 422 with:
```json
{
  "error": {
    "code": "otp",
    "detail": "The provided OTP is invalid or has expired."
  }
}
```

## POST `/api/v1/auth/login/password`
Authenticate with username and password to receive a JWT.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/login/password \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "newuser",
    "password": "P@ssword123"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "access_token": "jwt_token_here",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
      "username": "newuser",
      "name": "User",
      "nickname": "User",
      "email": "user@example.com",
      "phone": null,
      "status": "active",
      "email_verified_at": null,
      "created_at": "2025-01-12T15:30:14.000000Z",
      "updated_at": "2025-01-12T15:30:14.000000Z"
    }
  }
}
```

> Invalid credentials return HTTP 401 with:
```json
{
  "error": {
    "code": "username",
    "detail": "Invalid username or password."
  }
}
```

## POST `/api/v1/auth/login/email-otp`
Exchange the verification token (issued by `auth/check-otp` with `action: "login"`) for a JWT.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/login/email-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "token": "a9c1b4c0-9c2a-4e9a-9ac4-7d6fd9f0d1ef"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "access_token": "jwt_token_here",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
      "username": "newuser",
      "name": "User",
      "nickname": "User",
      "email": "user@example.com",
      "phone": "+15550001234",
      "status": "active",
      "email_verified_at": "2024-12-10T08:12:00.000000Z",
      "created_at": "2024-11-01T09:45:32.000000Z",
      "updated_at": "2025-01-12T15:30:14.000000Z"
    }
  }
}
```

## POST `/api/v1/auth/login/phone-otp`
Exchange the verification token (issued by `auth/check-otp` with `action: "login"`) for a JWT.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/login/phone-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": "+15550001234",
    "token": "a9c1b4c0-9c2a-4e9a-9ac4-7d6fd9f0d1ef"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "access_token": "jwt_token_here",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
      "username": "newuser",
      "name": "User",
      "nickname": "User",
      "email": "user@example.com",
      "phone": "+15550001234",
      "status": "active",
      "email_verified_at": "2024-12-10T08:12:00.000000Z",
      "created_at": "2024-11-01T09:45:32.000000Z",
      "updated_at": "2025-01-12T15:30:14.000000Z"
    }
  }
}
```

## POST `/api/v1/auth/signup`
Complete account creation using a verified signup token. Creates the user, assigns credentials, and returns an authenticated session.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "a9c1b4c0-9c2a-4e9a-9ac4-7d6fd9f0d1ef",
    "username": "newuser",
    "password": "P@ssword123",
    "referral_code": "ABC1234", // optional
    "geetest_id": "geetest_id", // optional, for event tracking
    "device_id": "device_id" // optional
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "access_token": "jwt_token_here",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
      "username": "newuser",
      "name": "newuser",
      "nickname": "newuser",
      "email": "user@example.com",
      "phone": "+15550001234",
      "status": "active",
      "email_verified_at": null,
      "created_at": "2025-01-12T15:30:14.000000Z",
      "updated_at": "2025-01-12T15:30:14.000000Z"
    }
  }
}
```

## POST `/api/v1/auth/logout`
Invalidate the current access token (requires `Authorization` header).

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/logout \
  -H 'Authorization: Bearer <access_token>'
```

```json
{
  "status": true,
  "message": "Success",
  "data": null
}
```

## POST `/api/v1/auth/refresh`
Issue a new JWT using a valid refreshable token (requires `Authorization` header).

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/refresh \
  -H 'Authorization: Bearer <refreshable_token>'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "access_token": "new_jwt_token",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

## POST `/api/v1/auth/forget-password/reset-password`
Reset password using a verification token obtained from OTP verification. No authentication required.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/forget-password/reset-password \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "a9c1b4c0-9c2a-4e9a-9ac4-7d6fd9f0d1ef",
    "password": "NewPassword123",
    "password_confirmation": "NewPassword123"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": null
}
```

> **Important Notes**:
> - `token` is required and must be a valid verification token obtained from `auth/check-otp` with `action: "forgot-password"`
> - `password` is required and must be at least 8 characters
> - `password_confirmation` is required and must match `password`
> - The token must be specifically for password reset (action: "forgot-password")
> - The token is consumed after successful password reset and cannot be reused
> - Invalid or expired token returns HTTP 422 with:
> ```json
> {
>   "errors": {
>     "token": ["The verification token cannot be used for password reset."]
>   }
> }
> ```
> - If no account is associated with the token, returns HTTP 422 with:
> ```json
> {
>   "errors": {
>     "token": ["No account is associated with this verification token."]
>   }
> }
> ```

## GET `/api/v1/config/data`
Retrieve public configuration values (share links, contact information, etc.). No authentication required.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/config/data
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "share_link": "https://example.com/share",
    "contact_us": {
      "email": "support@example.com",
      "phone": "+15550001234"
    },
    "share_app": null
  }
}
```

## GET `/api/v1/auth/social-login/providers`
List configured social login providers and whether each provider is currently supported.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/providers
```

```json
{
  "providers": [
    "google",
    "facebook"
  ],
  "status": {
    "google": {
      "supported": true,
      "configured": true
    },
    "facebook": {
      "supported": true,
      "configured": true
    },
    "wechat": {
      "supported": false,
      "configured": false
    },
    "weibo": {
      "supported": false,
      "configured": false
    }
  }
}
```

## POST `/api/v1/auth/social-login/login-url`
Generate an authorization URL (and optional QR code) for the requested provider.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/login-url \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "redirect_uri": "https://app.example.com/auth/callback"
  }'
```

```json
{
  "url": "https://social.example.com/connect.php?type=google&...",
  "qrcode": "https://social.example.com/qrcode.png"
}
```

> `redirect_uri` must be a valid URL. When a whitelist is configured (`social_login.allowed_redirect_uris`), the URI must match one of the allowed entries unless backend callbacks are enabled.

## POST `/api/v1/auth/social-login/callback`
Finalize the social login flow after the provider redirects back with an authorization code.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/callback \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "code": "authorization_code_here"
  }'
```

```json
{
  "is_bound": true,
  "token": {
    "access_token": "your-access-token",
    "refresh_token": "your-refresh-token"
  },
  "user": {
    "uid": "user-uid-123",
    "nickname": "User",
    "avatar": "https://example.com/avatar.png",
    "email": "user@example.com",
    "social_uid": "google-1234567890",
    "provider": "google"
  }
}
```

> If the social account is not yet bound, the response will include `"is_bound": false` and a `social_user_info` payload containing a temporary token the client can exchange during account binding.

## POST `/api/v1/auth/social-login/register-with-social-account`
Register a new account with social login credentials. Creates a new user account using social login information.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/register-with-social-account \
  -H 'Content-Type: application/json' \
  -d '{
    "temp_token": "base64_encoded_temp_token",
    "username": "newuser",
    "password": "P@ssword123"
  }'
```

```json
{
  "success": true,
  "data": {
    "token": {
      "access_token": "jwt_token_here",
      "refresh_token": "jwt_token_here"
    },
    "user": {
      "uid": "user-uid-123",
      "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
      "username": "newuser",
      "nickname": "User",
      "avatar": "https://example.com/avatar.png",
      "email": "user@example.com",
      "social_uid": "google-1234567890",
      "provider": "google"
    },
    "is_new_user": true
  }
}
```

> `temp_token` is the temporary token received from the social login callback when `is_bound: false`. `username` is required and must be 5-25 characters, alphanumeric. `password` is required and must be 8-20 characters. If the username already exists or the social account is already bound to another user, returns HTTP 409 with:
```json
{
  "success": false,
  "error": "USERNAME_EXISTS",
  "message": "Username already exists"
}
```

## POST `/api/v1/auth/social-login/bind`
Bind a social account to the currently authenticated user. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/bind \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "code": "authorization_code_here"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "success": true,
    "social_account": {
      "social_uid": "google-1234567890",
      "nickname": "User",
      "avatar": "https://example.com/avatar.png",
      "email": "user@example.com",
      "provider": "google"
    }
  }
}
```

> `provider` is required and must be one of: `google`, `facebook`, `wx` (WeChat), or `sina` (Weibo). `code` is required and is the OAuth authorization code from the social provider. If the social account is already bound to another user, returns HTTP 409 with:
```json
{
  "success": false,
  "error": "SOCIAL_ACCOUNT_ALREADY_BOUND",
  "message": "Social account is already bound to another user"
}
```

If the binding fails, returns HTTP 500 with:
```json
{
  "success": false,
  "error": "SOCIAL_LOGIN_BIND_FAILED",
  "message": "Failed to bind social account: [error details]"
}
```

## POST `/api/v1/auth/social-login/unbind`
Unbind a social account from the currently authenticated user. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/unbind \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "social_uid": "google-1234567890"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "success": true
  }
}
```

> `provider` is required and must be one of: `google`, `facebook`, `wx` (WeChat), or `sina` (Weibo). `social_uid` is required and is the social user ID to unbind. Cannot unbind the last credential - user must have at least one other login method. If the social account is not bound to this user, returns HTTP 404 with:
```json
{
  "success": false,
  "error": "SOCIAL_ACCOUNT_NOT_BOUND",
  "message": "Social account is not bound to this user"
}
```

If attempting to unbind the last credential, returns HTTP 500 with:
```json
{
  "success": false,
  "error": "SOCIAL_LOGIN_UNBIND_FAILED",
  "message": "Cannot unbind last credential. Please add another login method first."
}
```

## GET `/api/v1/auth/social-login/bound-accounts`
Get all bound social accounts for the currently authenticated user. Requires `Authorization: Bearer <access_token>`.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/bound-accounts \
  -H 'Authorization: Bearer <access_token>'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "accounts": [
      {
        "social_uid": "google-1234567890",
        "nickname": "User",
        "avatar": "https://example.com/avatar.png",
        "email": "user@example.com",
        "provider": "google",
        "bound_at": "2025-01-12T15:30:14.000000Z"
      },
      {
        "social_uid": "facebook-9876543210",
        "nickname": "User",
        "avatar": "https://example.com/facebook-avatar.png",
        "email": "user@facebook.com",
        "provider": "facebook",
        "bound_at": "2025-01-10T10:20:30.000000Z"
      }
    ]
  }
}
```

> Returns an array of all social accounts bound to the authenticated user. Each account includes the social UID, nickname, avatar URL, email, provider, and when it was bound.

## POST `/api/v1/auth/social-login/refresh`
Refresh social user information from the social provider. Updates the stored user information with the latest data from the social provider. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/auth/social-login/refresh \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "social_uid": "google-1234567890",
    "access_token": "optional_access_token"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "user": {
      "social_uid": "google-1234567890",
      "nickname": "Updated User",
      "avatar": "https://example.com/updated-avatar.png",
      "email": "updated@example.com",
      "gender": "male",
      "location": "New York, USA",
      "provider": "google"
    }
  }
}
```

> `provider` is required and must be one of: `google`, `facebook`, `wx` (WeChat), or `sina` (Weibo). `social_uid` is required and is the social user ID to refresh. `access_token` is optional - if not provided, the system will attempt to use the stored access token from the credential. If the social account is not bound to this user, returns HTTP 404 with:
```json
{
  "success": false,
  "error": "SOCIAL_ACCOUNT_NOT_BOUND",
  "message": "Social account is not bound to this user"
}
```

If the refresh fails (e.g., invalid access token or API error), returns HTTP 500 with:
```json
{
  "success": false,
  "error": "SOCIAL_LOGIN_REFRESH_FAILED",
  "message": "Failed to refresh social user info: [error details]"
}
```

## GET `/api/v1/profile/get-own-profile`
Fetch the authenticated user's profile. Requires `Authorization: Bearer <access_token>`.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/profile/get-own-profile \
  -H 'Authorization: Bearer <access_token>'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
    "username": "newuser",
    "name": "User",
    "nickname": "User",
    "email": "user@example.com",
    "phone": "+15550001234",
    "status": "active",
    "email_verified_at": "2024-12-10T08:12:00.000000Z",
    "created_at": "2024-11-01T09:45:32.000000Z",
    "updated_at": "2025-01-12T15:30:14.000000Z"
  }
}
```

## PUT `/api/v1/profile/update-nickname`
Update the authenticated user's nickname. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X PUT https://efdfd435gv.qdhgtch.com/api/v1/profile/update-nickname \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nickname": "Xiao"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": true
}
```

> `nickname` is required and must be a string with a maximum of 20 characters. Invalid input returns HTTP 422 with:
```json
{
  "error": {
    "code": "nickname",
    "detail": "The nickname field is required."
  }
}
```

## POST `/api/v1/profile/remove-avatar`
Remove the authenticated user's avatar. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/profile/remove-avatar \
  -H 'Authorization: Bearer <access_token>'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
    "username": "newuser",
    "name": "User",
    "nickname": "User",
    "email": "user@example.com",
    "phone": "+15550001234",
    "status": "active",
    "email_verified_at": "2024-12-10T08:12:00.000000Z",
    "created_at": "2024-11-01T09:45:32.000000Z",
    "updated_at": "2025-01-12T15:30:14.000000Z"
  }
}
```

> Removes the user's avatar and any pending profile photo reviews.

## POST `/api/v1/profile/change-password`
Change the authenticated user's password. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/profile/change-password \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "old_password": "OldPassword123",
    "new_password": "NewPassword123",
    "confirm_new_password": "NewPassword123"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "message": "Password changed successfully."
  }
}
```

> `old_password` is required. `new_password` is required and must be 8-25 characters, containing at least two of: letters, numbers. `confirm_new_password` is required and must match `new_password`. Invalid input or incorrect old password returns HTTP 422 with:
```json
{
  "error": {
    "code": "old_password",
    "detail": "The old password is incorrect."
  }
}
```

## POST `/api/v1/profile/change-phone-number`
Change the authenticated user's phone number. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/profile/change-phone-number \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": "+15550001234"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "message": "Phone number changed successfully."
  }
}
```

> `phone` is required and must be 7 to 15 digits (optionally prefixed with `+`). The phone number must be different from the current phone number and not already in use by another account. Invalid input returns HTTP 422 with:
```json
{
  "error": {
    "code": "phone",
    "detail": "This phone number is already in use by another account."
  }
}
```

## POST `/api/v1/profile/change-email`
Change the authenticated user's email address. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/profile/change-email \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "newemail@example.com"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
    "username": "newuser",
    "name": "User",
    "nickname": "User",
    "email": "newemail@example.com",
    "phone": "+15550001234",
    "status": "active",
    "email_verified_at": "2024-12-10T08:12:00.000000Z",
    "created_at": "2024-11-01T09:45:32.000000Z",
    "updated_at": "2025-01-12T15:30:14.000000Z"
  }
}
```

> `email` is required and must be a valid email address (max 255 characters). The email must be different from the current email and not already in use by another account. Invalid input returns HTTP 422 with:
```json
{
  "error": {
    "code": "email",
    "detail": "This email address is already in use by another account."
  }
}
```

## POST `/api/v1/profile/save-referral-code`
Save a referral code for the authenticated user. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/profile/save-referral-code \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "referral_code": "ABC1234"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "8a7f2e90-2c74-4a9a-9ef3-12f8d6b9c4d1",
    "reference_id": "990e8400-e29b-41d4-a716-446655440002",
    "referral_code": "ABC1234",
    "created_at": "2025-01-12T15:30:14.000000Z",
    "updated_at": "2025-01-12T15:30:14.000000Z"
  }
}
```

> `referral_code` is required and must be a valid referral code that belongs to another user. Invalid input returns HTTP 422 with:
> ```json
> {
>   "errors": {
>     "referral_code": ["The provided referral code is invalid."]
>   }
> }
> ```
> 
> If the user has already used a referral code, returns HTTP 422 with:
> ```json
> {
>   "errors": {
>     "referral_code": ["You have already used a referral code."]
>   }
> }
> ```

## GET `/api/v1/avatar/list`
Get list of avatars grouped by level. Requires `Authorization: Bearer <access_token>`.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/avatar/list \
  -H 'Authorization: Bearer <access_token>'
```

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "level": "Unlocked Avatar Level -1",
      "is_available": true,
      "list": [
        {
          "id": "avatar-id-1",
          "name": "Avatar 1",
          "image": "https://example.com/avatar1.png",
          "level_id": "level-id-1"
        }
      ]
    },
    {
      "level": "Unlocked Avatar Level -2",
      "is_available": false,
      "list": [
        {
          "id": "avatar-id-2",
          "name": "Avatar 2",
          "image": "https://example.com/avatar2.png",
          "level_id": "level-id-2"
        }
      ]
    }
  ]
}
```

> Returns avatars grouped by level. `is_available` indicates whether the user has access to avatars in that level based on their current level points.

## POST `/api/v1/avatar/upload`
Select/upload an avatar for the authenticated user. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/avatar/upload \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "avatar_id": "avatar-id-1"
  }'
```

```json
{
  "status": true,
  "message": "Success",
  "data": true
}
```

> `avatar_id` is required and must exist in the avatars table. This will update the user's avatar and delete any pending profile photo reviews. Invalid input returns HTTP 422 with:
```json
{
  "error": {
    "code": "avatar_id",
    "detail": "The selected avatar id is invalid."
  }
}
```

# Post API

## POST `/api/v1/post/comment`
Create a comment on a post or reply to an existing comment. Requires `Authorization: Bearer <access_token>`.

**Request Body for Creating a Comment:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/post/comment \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "This is a great post!",
    "device": "iOS",
    "app_version": "1.0.0"
  }'
```

**Success Response (200) - Comment:**
```json
{
  "status": true,
  "message": "Comment created successfully",
  "data": {
    "type": "comment",
    "data": {
      "comment_id": "660e8400-e29b-41d4-a716-446655440001",
      "post_id": "550e8400-e29b-41d4-a716-446655440000",
      "content": "This is a great post!",
      "status": "pending",
      "created_at": "2024-11-28 13:45:30",
      "like_count": 0,
      "comment_like_count": 0,
      "is_liked": false,
      "user": {
        "user_id": "770e8400-e29b-41d4-a716-446655440002",
        "username": "johndoe",
        "nickname": "John Doe",
        "name": "John",
        "avatar": "https://example.com/avatars/user123.jpg",
        "email": "john@example.com",
        "phone": "+1234567890",
        "status": "active",
        "referral_code": "ABC1234"
      },
      "replies": {
        "list": [],
        "replies_count": 0,
        "hasMore": false
      }
    }
  }
}
```

**Request Body for Creating a Reply:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/post/comment \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "comment_id": "660e8400-e29b-41d4-a716-446655440001",
    "content": "I totally agree with you!",
    "device": "Android",
    "app_version": "1.0.0"
  }'
```

**Success Response (200) - Reply:**
```json
{
  "status": true,
  "message": "Comment created successfully",
  "data": {
    "type": "reply",
    "data": {
      "reply_id": "880e8400-e29b-41d4-a716-446655440003",
      "comment_id": "660e8400-e29b-41d4-a716-446655440001",
      "parent_id": null,
      "reply_to": "Unknown",
      "status": "pending",
      "content": "I totally agree with you!",
      "user": {
        "user_id": "990e8400-e29b-41d4-a716-446655440004",
        "username": "janedoe",
        "nickname": "Jane Doe",
        "name": "Jane",
        "avatar": "https://example.com/avatars/user456.jpg",
        "email": "jane@example.com",
        "phone": "+0987654321",
        "status": "active",
        "referral_code": "XYZ5678"
      },
      "created_at": "2024-11-28 13:46:15",
      "reply_like_count": 0,
      "is_liked": false
    }
  }
}
```

**Request Body for Creating a Nested Reply (Reply to a Reply):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/post/comment \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "comment_id": "660e8400-e29b-41d4-a716-446655440001",
    "reply_id": "880e8400-e29b-41d4-a716-446655440003",
    "content": "Thanks for your input!",
    "device": "iOS",
    "app_version": "1.0.0"
  }'
```

**Success Response (200) - Nested Reply:**
```json
{
  "status": true,
  "message": "Comment created successfully",
  "data": {
    "type": "reply",
    "data": {
      "reply_id": "aa0e8400-e29b-41d4-a716-446655440005",
      "comment_id": "660e8400-e29b-41d4-a716-446655440001",
      "parent_id": "880e8400-e29b-41d4-a716-446655440003",
      "reply_to": "Jane Doe",
      "status": "pending",
      "content": "Thanks for your input!",
      "user": {
        "user_id": "770e8400-e29b-41d4-a716-446655440002",
        "username": "johndoe",
        "nickname": "John Doe",
        "name": "John",
        "avatar": "https://example.com/avatars/user123.jpg",
        "email": "john@example.com",
        "phone": "+1234567890",
        "status": "active",
        "referral_code": "ABC1234"
      },
      "created_at": "2024-11-28 13:47:00",
      "reply_like_count": 0,
      "is_liked": false
    }
  }
}
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the post to comment on |
| `content` | string | Yes | The comment/reply content |
| `comment_id` | UUID | No | The ID of the comment to reply to (required for replies) |
| `reply_id` | UUID | No | The ID of the reply to reply to (for nested replies) |
| `device` | string | No | Device type (e.g., "iOS", "Android") |
| `app_version` | string | No | Application version (e.g., "1.0.0") |

**Error Responses**:

**422 Validation Error** (Missing required field):
```json
{
  "errors": {
    "content": ["The content field is required."]
  }
}
```

**422 Validation Error** (Invalid post_id):
```json
{
  "errors": {
    "post_id": ["The selected post id is invalid."]
  }
}
```

**400 Bad Request** (Forbidden words found):
```json
{
  "status": false,
  "message": "Forbidden words found in content",
  "error": {
    "code": "API_ERROR",
    "detail": "Forbidden words found in content"
  }
}
```

**409 Conflict** (Rate limit - comment posted too fast):
```json
{
  "status": false,
  "message": "Comment posted too fast. Please wait a moment.",
  "error": {
    "code": "API_ERROR",
    "detail": "Comment posted too fast. Please wait a moment."
  }
}
```

**401 Unauthorized** (No token or invalid token):
```json
{
  "message": "Unauthenticated."
}
```

> **Important Notes**:
> - This endpoint requires authentication via `Authorization: Bearer <access_token>` header
> - Comments and replies are created with `status: "pending"` by default (awaiting moderation)
> - Status values: `0` = pending, `1` = approved
> - Rate limiting: A distributed lock prevents duplicate/spam comments (30-second timeout)
> - Forbidden words check: Content is validated against a forbidden words list using Trie data structure
> - Event tracking: Creating a comment dispatches a `UserActionEvent` for coin activity tracking (replies do not trigger coin events)
> - Nested replies: You can reply to replies by providing both `comment_id` and `reply_id`
> - The `reply_to` field in reply responses shows the nickname of the user being replied to (or "Unknown" if replying to a top-level comment)

## GET `/api/v1/post/comments`
Get a list of comments for a specific post. Returns approved comments with pagination support. Optional authentication (works with or without `Authorization` header).

```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/comments?post_id=550e8400-e29b-41d4-a716-446655440000&limit=20" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Comments retrieved successfully",
  "data": {
    "list": [
      {
        "comment_id": "660e8400-e29b-41d4-a716-446655440001",
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "content": "This is a great post!",
        "status": "success",
        "created_at": "2024-11-28 13:45:30",
        "like_count": 15,
        "comment_like_count": 15,
        "is_liked": false,
        "user": {
          "user_id": "770e8400-e29b-41d4-a716-446655440002",
          "username": "johndoe",
          "nickname": "John Doe",
          "name": "John",
          "avatar": "https://example.com/avatars/user123.jpg",
          "email": "john@example.com",
          "phone": "+1234567890",
          "status": "active",
          "referral_code": "ABC1234"
        },
        "replies": {
          "list": [
            {
              "reply_id": "880e8400-e29b-41d4-a716-446655440003",
              "comment_id": "660e8400-e29b-41d4-a716-446655440001",
              "parent_id": null,
              "reply_to": "Unknown",
              "status": "success",
              "content": "I totally agree!",
              "user": {
                "user_id": "990e8400-e29b-41d4-a716-446655440004",
                "username": "janedoe",
                "nickname": "Jane Doe",
                "name": "Jane",
                "avatar": "https://example.com/avatars/user456.jpg",
                "email": "jane@example.com",
                "phone": "+0987654321",
                "status": "active",
                "referral_code": "XYZ5678"
              },
              "created_at": "2024-11-28 13:46:15",
              "reply_like_count": 5,
              "is_liked": false
            }
          ],
          "replies_count": 3,
          "hasMore": true
        }
      },
      {
        "comment_id": "aa0e8400-e29b-41d4-a716-446655440005",
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "content": "Amazing content!",
        "status": "success",
        "created_at": "2024-11-28 13:40:20",
        "like_count": 42,
        "comment_like_count": 42,
        "is_liked": true,
        "user": {
          "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
          "username": "alice",
          "nickname": "Alice Smith",
          "name": "Alice",
          "avatar": "https://example.com/avatars/user789.jpg",
          "email": "alice@example.com",
          "phone": "+1122334455",
          "status": "active",
          "referral_code": "DEF9012"
        },
        "replies": {
          "list": [],
          "replies_count": 0,
          "hasMore": false
        }
      }
    ],
    "comments_count": 25,
    "hasMore": true
  }
}
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the post to get comments for (must exist in posts table) |
| `last_comment_id` | UUID | No | The ID of the last comment from the previous page (for cursor-based pagination) |
| `limit` | integer | No | Number of comments per page (1-50, default: 20) |

**Example Requests**:

```bash
# Get first page of comments
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/comments?post_id=550e8400-e29b-41d4-a716-446655440000&limit=20"

# Get next page using cursor pagination
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/comments?post_id=550e8400-e29b-41d4-a716-446655440000&last_comment_id=aa0e8400-e29b-41d4-a716-446655440005&limit=20"

# Get comments with custom limit
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/comments?post_id=550e8400-e29b-41d4-a716-446655440000&limit=10"
```

**Error Responses**:

**422 Validation Error** (Missing or invalid post_id):
```json
{
  "errors": {
    "post_id": ["The post id field is required."]
  }
}
```

**422 Validation Error** (Post doesn't exist):
```json
{
  "errors": {
    "post_id": ["The selected post id is invalid."]
  }
}
```

**422 Validation Error** (Invalid limit):
```json
{
  "errors": {
    "limit": ["The limit must be between 1 and 50."]
  }
}
```

**422 Validation Error** (Invalid last_comment_id):
```json
{
  "errors": {
    "last_comment_id": ["The selected last comment id is invalid."]
  }
}
```

> **Important Notes**:
> - This endpoint uses optional authentication (works with or without `Authorization` header)
> - Only approved comments (`status: 1`) are returned (pending comments are excluded)
> - Comments are ordered by `id` in descending order (newest first)
> - Uses cursor-based pagination with `last_comment_id` for efficient pagination
> - Each comment includes up to 5 replies by default (with `hasMore` flag if more replies exist)
> - The `replies` object in each comment contains:
>   - `list`: Array of reply resources (max 5 per comment)
>   - `replies_count`: Total number of replies for the comment
>   - `hasMore`: Boolean indicating if there are more replies to load
> - Authentication-dependent fields (`is_liked`) are automatically set based on the authenticated user (if provided)
> - The `status` field in comments shows `"success"` for approved comments (`status: 1`) and `"pending"` for pending comments (`status: 0`)
> - User information is included for each comment and reply
> - Like counts are retrieved from cache for optimal performance

## POST `/api/v1/comment/like`
Like a comment. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/comment/like \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "comment_id": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "comment_id": "660e8400-e29b-41d4-a716-446655440001",
    "liked": true,
    "like_count": 16
  }
}
```

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `comment_id` | UUID | Yes | The ID of the comment to like (must exist in post_comments table) |

**Error Responses**:

**400 Bad Request** (Already liked):
```json
{
  "status": false,
  "message": "You have already liked this comment",
  "errors": null
}
```

**404 Not Found** (Comment doesn't exist):
```json
{
  "status": false,
  "message": "Comment not found",
  "errors": null
}
```

**422 Validation Error** (Invalid comment_id):
```json
{
  "errors": {
    "comment_id": ["The selected comment id is invalid."]
  }
}
```

> **Important Notes**:
> - This endpoint requires authentication
> - A user can only like a comment once
> - If the user has already liked the comment, a 400 error is returned
> - The unique constraint ensures one reaction per user per comment
> - Returns the updated like count for the comment
> - The like is stored in the `comment_reactions` table

## POST `/api/v1/comment/unlike`
Unlike a previously liked comment. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/comment/unlike \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "comment_id": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "comment_id": "660e8400-e29b-41d4-a716-446655440001",
    "liked": false,
    "like_count": 15
  }
}
```

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `comment_id` | UUID | Yes | The ID of the comment to unlike (must exist in post_comments table) |

**Error Responses**:

**400 Bad Request** (Not previously liked):
```json
{
  "status": false,
  "message": "You have not liked this comment",
  "errors": null
}
```

**404 Not Found** (Comment doesn't exist):
```json
{
  "status": false,
  "message": "Comment not found",
  "errors": null
}
```

**422 Validation Error** (Invalid comment_id):
```json
{
  "errors": {
    "comment_id": ["The selected comment id is invalid."]
  }
}
```

> **Important Notes**:
> - This endpoint requires authentication
> - Can only unlike a comment that has been previously liked by the user
> - If the user has not liked the comment, a 400 error is returned
> - Returns the updated like count for the comment

## GET `/api/v1/post/recommend`
Get recommended posts based on a specific post. Returns posts that share the same type and tags (if available). Optional authentication (works with or without `Authorization` header).

```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/recommend?post_id=550e8400-e29b-41d4-a716-446655440000" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "post_id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Recommended Post 1",
      "files": [
        {
          "size": "10485760",
          "type": "video",
          "width": 1920,
          "height": 1080,
          "suffix": "mp4",
          "duration": 120,
          "thumbnail": "https://example.com/thumbnail1.jpg",
          "resourceURL": "https://example.com/video1.mp4",
          "downloadURL": "https://example.com/video1.mp4"
        }
      ],
      "sprite_url": "https://example.com/sprite1.jpg",
      "sprite_metadata": {
        "frames": [
          {
            "x": 0,
            "y": 0,
            "width": 160,
            "height": 90,
            "timestamp": 0.0
          }
        ],
        "sprite_width": 1600,
        "sprite_height": 900
      },
      "file_type": "video",
      "privacy": "public",
      "status": "published",
      "city": "New York",
      "score": 8.5,
      "province": "New York",
      "is_pin": 0,
      "type": "post",
      "ads_info": null,
      "preview_image": "https://example.com/thumbnail1.jpg",
      "tag": ["funny", "viral", "comedy"],
      "user": {
        "user_id": "770e8400-e29b-41d4-a716-446655440002",
        "username": "johndoe",
        "nickname": "John Doe",
        "name": "John",
        "avatar": "https://example.com/avatars/user123.jpg",
        "email": "john@example.com",
        "phone": "+1234567890",
        "status": "active",
        "referral_code": "ABC1234"
      },
      "like_count": 150,
      "comment_count": 25,
      "view_count": "0",
      "preview": {
        "url": "https://example.com/preview1.mp4",
        "width": 1920,
        "height": 1080,
        "size": 524288,
        "format": "mp4",
        "version": "preview",
        "duration": 5
      },
      "time_ago": "2 hours ago",
      "is_liked": false,
      "is_followed": false,
      "is_watched": false,
      "related": []
    },
    {
      "post_id": "880e8400-e29b-41d4-a716-446655440003",
      "title": "Recommended Post 2",
      "files": [
        {
          "size": "15728640",
          "type": "video",
          "width": 1920,
          "height": 1080,
          "suffix": "mp4",
          "duration": 180,
          "thumbnail": "https://example.com/thumbnail2.jpg",
          "resourceURL": "https://example.com/video2.mp4"
        }
      ],
      "sprite_url": null,
      "sprite_metadata": null,
      "file_type": "video",
      "privacy": "public",
      "status": "published",
      "city": "Los Angeles",
      "score": 7.8,
      "province": "California",
      "is_pin": 0,
      "type": "post",
      "ads_info": null,
      "preview_image": "https://example.com/thumbnail2.jpg",
      "tag": ["funny", "entertainment"],
      "user": {
        "user_id": "990e8400-e29b-41d4-a716-446655440004",
        "username": "janedoe",
        "nickname": "Jane Doe",
        "name": "Jane",
        "avatar": "https://example.com/avatars/user456.jpg",
        "email": "jane@example.com",
        "phone": "+0987654321",
        "status": "active",
        "referral_code": "XYZ5678"
      },
      "like_count": 89,
      "comment_count": 12,
      "view_count": "0",
      "preview": null,
      "time_ago": "5 hours ago",
      "is_liked": true,
      "is_followed": true,
      "is_watched": false,
      "related": []
    }
  ]
}
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the post to get recommendations for (must exist in posts table) |

**Error Responses**:

**404 Not Found** (Post not found):
```json
{
  "status": false,
  "message": "Invalid ID",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Invalid ID"
  }
}
```

**422 Validation Error** (Missing or invalid post_id):
```json
{
  "errors": {
    "post_id": ["The post id field is required."]
  }
}
```

**422 Validation Error** (Post doesn't exist):
```json
{
  "errors": {
    "post_id": ["The selected post id is invalid."]
  }
}
```

> **Important Notes**:
> - This endpoint uses optional authentication (works with or without `Authorization` header)
> - Returns up to 9 recommended posts by default
> - Recommendations are based on:
>   - Same `type` as the source post (e.g., "post", "ads", "ads_virtual")
>   - Same tags (if the source post has tags, only posts with matching tags are returned)
>   - Only published, public posts are included
>   - The source post is excluded from results
> - Results are sorted by `created_at` in descending order (newest first)
> - If the source post has no tags, recommendations are based only on matching type
> - If no recommendations are found, an empty array is returned
> - Response format matches the standard post list format with all post details, user information, and interaction counts
> - Authentication-dependent fields (`is_liked`, `is_followed`, `is_watched`) are automatically set based on the authenticated user (if provided)

## GET `/api/v1/post/index_recommend`
Get homepage recommendation layout with carousel, playback history, recommendation sections, and advertisements. Optional authentication (works with or without `Authorization` header).

**Request:**
```bash
# With authentication (includes playback history)
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/index_recommend" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'

# Without authentication (public content only)
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/index_recommend" \
  -H 'Accept: application/json'
```

**Success Response (200) - Authenticated User**:
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "layout": "index_recommend_carousel",
      "title": "carousel",
      "list": [
        {
          "image": "https://example.com/carousel1.jpg",
          "type": "post",
          "title": "Featured Post",
          "sub_title": "Check this out",
          "label": "New",
          "click": "post_detail",
          "link_id": "550e8400-e29b-41d4-a716-446655440000"
        },
        {
          "image": "https://example.com/carousel2.jpg",
          "type": "external",
          "title": "Special Offer",
          "sub_title": "Limited time only",
          "label": "Hot",
          "click": "external_link",
          "link": "https://example.com/offer"
        }
      ],
      "right": {}
    },
    {
      "layout": "playback_history",
      "title": "Continue Watching",
      "list": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "Episode 5",
          "cover": "https://example.com/cover1.jpg",
          "year": "2025",
          "dynamic": 850,
          "progress": 45,
          "type_name": "drama"
        }
      ],
      "right": {
        "text": "View All",
        "type": "navigator",
        "data": {
          "page": "playback_history",
          "param": {}
        }
      }
    },
    {
      "layout": "advert_self",
      "title": "",
      "data": [
        {
          "type": "banner",
          "location_id": "location-uuid-1",
          "channel": "android",
          "remarks": "Homepage banner",
          "data": {
            "image": "https://example.com/ad1.jpg",
            "link": "https://example.com/promo1"
          }
        },
        {
          "type": "app",
          "location_id": "location-uuid-2",
          "channel": "android",
          "remarks": "App recommendation",
          "data": {
            "name": "Gaming App",
            "package": "com.example.game",
            "image": "https://example.com/app-icon.jpg"
          }
        }
      ],
      "right": {},
      "ads_per_row": 6
    },
    {
      "layout": "index_recommend_list",
      "title": "Trending Now",
      "list": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Amazing Video",
          "cover": "https://example.com/cover.jpg",
          "year": "2025",
          "dynamic": 1250,
          "label": "Pinned",
          "type_name": "funny"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440002",
          "name": "Epic Movie",
          "cover": "https://example.com/cover2.jpg",
          "year": "2024",
          "dynamic": 980,
          "label": null,
          "type_name": "action"
        }
      ],
      "right": {
        "text": "More",
        "type": "navigator",
        "data": {
          "page": "post_list",
          "param": {
            "tag": "trending"
          }
        }
      }
    },
    {
      "layout": "index_recommend_list",
      "title": "New Releases",
      "list": [
        {
          "id": "880e8400-e29b-41d4-a716-446655440003",
          "name": "Latest Show",
          "cover": "https://example.com/cover3.jpg",
          "year": "2025",
          "dynamic": 520,
          "label": "New",
          "type_name": "series"
        }
      ],
      "right": {}
    }
  ]
}
```

**Success Response (200) - Unauthenticated User**:
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "layout": "index_recommend_carousel",
      "title": "carousel",
      "list": [
        {
          "image": "https://example.com/carousel1.jpg",
          "type": "post",
          "title": "Featured Post",
          "sub_title": "Check this out",
          "label": "New",
          "click": "post_detail",
          "link_id": "550e8400-e29b-41d4-a716-446655440000"
        }
      ],
      "right": {}
    },
    {
      "layout": "index_recommend_list",
      "title": "Trending Now",
      "list": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Amazing Video",
          "cover": "https://example.com/cover.jpg",
          "year": "2025",
          "dynamic": 1250,
          "label": "Pinned",
          "type_name": "funny"
        }
      ],
      "right": {
        "text": "More",
        "type": "navigator",
        "data": {
          "page": "post_list",
          "param": {
            "tag": "trending"
          }
        }
      }
    }
  ]
}
```

**Response Structure**:

The response is an array of layout cards. Each card has:

- **`layout`**: The layout type (e.g., `index_recommend_carousel`, `advert_self`, `index_recommend_list`, `playback_history`)
- **`title`**: Section title (string)
- **`list` or `data`**: Array of items (carousel items, posts, or ads)
- **`right`**: Right button configuration (empty object `{}` if no button, otherwise contains navigation data)

**Card Types**:

1. **Carousel Card** (`index_recommend_carousel`):
   - Always appears first if carousel items exist
   - Contains carousel images with metadata
   - Each carousel item includes:
     - `image`: Carousel image URL
     - `type`: Type of content (e.g., "post", "external")
     - `title`: Carousel item title
     - `sub_title`: Subtitle or description
     - `label`: Optional label (e.g., "New", "Featured")
     - `click`: Click action type (e.g., "post_detail")
     - `tag`: Array of tag names associated with the post (e.g., ["Fantasy", "Action", "Sci-Fi"])
     - `duration`: Video duration in seconds (0 if not available)

2. **Playback History Card** (`playback_history`) - **Authenticated users only**:
   - Appears after carousel for logged-in users
   - Shows user's recent playback history
   - Contains list of recently watched posts

3. **Advertisement Card** (`advert_self`):
   - Can appear at various positions in the layout
   - Contains advertisements based on user OS (Android/iOS)
   - Uses `data` field instead of `list`
   - Includes `ads_per_row` field for layout configuration
   - Each ad includes:
     - `type`: Ad type (e.g., "banner", "app")
     - `location_id`: Ad location identifier
     - `channel`: Platform channel (e.g., "android", "ios")
     - `remarks`: Optional ad description
     - `data`: Ad content (image, link, name, package, etc.)

4. **Recommendation Section Card** (`index_recommend_list`):
   - Generated from `index_recommend` table entries
   - Each section can have different filtering logic:
     - `by_default`: Default recommendation (sorted by creation date)
     - `by_type`: Filter by post type
     - `by_tag`: Filter by specific tags
     - `by_id`: Specific post IDs
   - Contains post list with cover images and metadata
   - Each post item includes:
     - `id`: Post ID
     - `name`: Post title
     - `cover`: Post cover image URL
     - `year`: Post year (optional)
     - `dynamic`: Dynamic metric (e.g., view count, popularity)
     - `label`: Optional label (e.g., "Pinned", "Hot")
     - `type_name`: Post type/category name (optional)

**Query Parameters**:

No query parameters required. This endpoint returns the complete homepage recommendation layout.

> **Important Notes**:
> - This endpoint uses optional authentication (works with or without `Authorization` header)
> - If authenticated, user-specific content (playback history) will be included after the carousel
> - **Card Order Sequence**:
>   1. Carousel card (if carousel items exist)
>   2. Playback history card (if user is authenticated)
>   3. Recommendation section cards (ordered by `sort` field, descending)
>   4. Advertisement cards are inserted at strategic positions among recommendation sections
> - Carousel items are filtered by application code from config
> - Recommendation sections are ordered by `sort` field (descending)
> - Only active recommendation sections (`status: true`) are included
> - Advertisements are filtered by user OS (Android/iOS, detected from User-Agent) and application code
> - Post lists in recommendation sections only include published, public posts
> - Empty sections (with no content) are automatically excluded from the response
> - The `right` button configuration allows navigation to detailed views or tabs:
>   - `type: "navigator"` - Navigate to a specific page
>   - `type: "tab"` - Switch to a specific tab
>   - Empty object `{}` means no right button is displayed
> - Different recommendation sections can use different filtering strategies (`by_default`, `by_type`, `by_tag`, `by_id`)
> - The layout is dynamically generated based on database configuration (no hardcoded content)

## GET `/api/v1/post/detail`
Get detailed information about a specific post. Optional authentication (works with or without `Authorization` header).

**Request:**
```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/post/detail?post_id=550e8400-e29b-41d4-a716-446655440000" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Amazing Video",
    "files": [
      {
        "size": "10485760",
        "type": "video",
        "width": 1920,
        "height": 1080,
        "suffix": "mp4",
        "duration": 120,
        "thumbnail": "https://example.com/thumbnail.jpg",
        "resourceURL": "https://example.com/video.mp4",
        "downloadURL": "https://example.com/download/video.mp4"
      }
    ],
    "sprite_url": "https://example.com/sprite.jpg",
    "sprite_metadata": {
      "frames": [
        {
          "x": 0,
          "y": 0,
          "width": 160,
          "height": 90,
          "timestamp": 0.0
        }
      ],
      "sprite_width": 1600,
      "sprite_height": 900
    },
    "file_type": "video",
    "privacy": "public",
    "status": "published",
    "city": "New York",
    "score": 8.5,
    "province": "New York",
    "is_pin": 0,
    "type": "post",
    "ads_info": null,
    "preview_image": "https://example.com/thumbnail.jpg",
    "tag": ["funny", "viral"],
    "user": {
      "user_id": "770e8400-e29b-41d4-a716-446655440002",
      "username": "johndoe",
      "nickname": "John Doe",
      "name": "John",
      "avatar": "https://example.com/avatars/user123.jpg",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "active",
      "referral_code": "ABC1234"
    },
    "like_count": 150,
    "comment_count": 25,
    "view_count": "0",
    "preview": {
      "url": "https://example.com/preview.mp4",
      "width": 1920,
      "height": 1080,
      "size": 524288,
      "format": "mp4",
      "version": "preview",
      "duration": 5
    },
    "time_ago": "2 hours ago",
    "is_liked": false,
    "is_followed": false,
    "is_watched": false,
    "related": [],
    "description": "This is an amazing video about...",
    "rating": 4.5,
    "episodes": "12 episodes",
    "year": "2025"
  }
}
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the post to retrieve (must exist in posts table) |

**Error Responses**:

**422 Validation Error** (Missing or invalid post_id):
```json
{
  "errors": {
    "post_id": ["The post id field is required."]
  }
}
```

**422 Validation Error** (Post doesn't exist):
```json
{
  "errors": {
    "post_id": ["The selected post id is invalid."]
  }
}
```

> **Important Notes**:
> - This endpoint uses optional authentication (works with or without `Authorization` header)
> - Authentication-dependent fields (`is_liked`, `is_followed`, `is_watched`) are automatically set based on the authenticated user (if provided)
> - File URLs are load-balanced across multiple domains if configured
> - Download URLs are only provided for MP4 files under 15 minutes duration
> - Response includes complete post details, user information, interaction counts, and tags
> - Preview videos are included if available
> - Optional fields (`description`, `rating`, `episodes`, `year`) may be `null` if not set for the post
> - The `view_count` is currently hardcoded to "0" and will be implemented in future versions
> - The `related` field is an empty array and reserved for future use

# Feedback API

## POST `/api/v1/feedback/submit`
Submit feedback for a film/post. Requires `Authorization: Bearer <access_token>`.

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/feedback/submit \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "problem_type_id": 1,
    "description": "The video keeps buffering every few minutes and sometimes freezes completely. This happens especially during action scenes."
  }'
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Feedback submitted successfully. We will review it shortly.",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "problem_type_id": 1,
    "problem_type": {
      "id": 1,
      "name": "playback_issues",
      "label": "Playback Issues"
    },
    "description": "The video keeps buffering every few minutes and sometimes freezes completely. This happens especially during action scenes.",
    "created_at": "2025-11-28T15:30:16.000000Z",
    "updated_at": "2025-11-28T15:30:16.000000Z"
  }
}
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the film/post being reported (must exist in posts table) |
| `problem_type_id` | integer | Yes | The ID of the problem type (must exist in problem_types table) |
| `description` | string | Yes | Detailed description of the problem (10-2000 characters) |

**Problem Type IDs and Values**:

The following problem types are available by default:

| ID | Name | Label | Description |
|----|------|-------|-------------|
| 1 | `playback_issues` | Playback Issues | Video playback problems (buffering, freezing, etc.) |
| 2 | `incomplete_episodes` | Incomplete Episodes | Missing or incomplete episodes |
| 3 | `missing_resources` | Missing Resources | Missing video files or resources |
| 4 | `incorrect_information` | Incorrect Information | Wrong title, description, or metadata |
| 5 | `inaccurate_category` | Inaccurate Category | Wrong genre or category classification |
| 6 | `bug_error` | Bug Error | Application bugs or errors |

> **Note**: Problem types are stored in the `problem_types` table and can be managed by administrators. Only active problem types should be used. The IDs shown above are the default values, but they may vary if the database has been modified.

**Error Responses**:

**422 Validation Error** (Missing required field):
```json
{
  "errors": {
    "post_id": ["The Post ID is required."],
    "problem_type_id": ["Please select a problem type."],
    "description": ["Please provide a detailed description of the problem."]
  }
}
```

**422 Validation Error** (Invalid problem type):
```json
{
  "errors": {
    "problem_type_id": ["The selected problem type is invalid."]
  }
}
```

**422 Validation Error** (Description too short):
```json
{
  "errors": {
    "description": ["The description must be at least 10 characters."]
  }
}
```

**422 Validation Error** (Post doesn't exist):
```json
{
  "errors": {
    "post_id": ["The selected Post does not exist."]
  }
}
```

**401 Unauthorized** (No token or invalid token):
```json
{
  "message": "Unauthenticated."
}
```

> **Important Notes**:
> - This endpoint requires authentication via `Authorization: Bearer <access_token>` header
> - The `user_id` is automatically set from the authenticated user
> - All feedback submissions are stored for review
> - The `description` field must be between 10 and 2000 characters
> - The `post_id` must reference an existing post in the database
> - The `problem_type_id` must reference an existing and active problem type in the `problem_types` table
> - The response includes both `problem_type_id` and a nested `problem_type` object with id, name, and label for convenience

# Problem Types API

## GET `/api/v1/problem-types/list`
Get a list of all active problem types. Returns only the name and description for each problem type. No authentication required.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/problem-types/list
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "name": "incomplete_episodes",
      "description": "Missing or incomplete episodes"
    },
    {
      "name": "missing_resources",
      "description": "Missing video files or resources"
    },
    {
      "name": "incorrect_information",
      "description": "Wrong title, description, or metadata"
    },
    {
      "name": "inaccurate_category",
      "description": "Wrong genre or category classification"
    },
    {
      "name": "bug_error",
      "description": "Application bugs or errors"
    }
  ]
}
```

**Query Parameters**:

No query parameters required.

> **Important Notes**:
> - This endpoint is publicly accessible (no authentication required)
> - Returns only active problem types (`is_active: true`)
> - Results are ordered by `sort_order` (ascending)
> - Only `name` and `description` fields are returned in the response
> - Problem types can be managed by administrators in the `problem_types` table
> - Use this endpoint to populate problem type selection dropdowns in feedback forms

# Ads API

## GET `/api/v1/application/ads`
Get application page ads (carousel, header, application groups, footer). No authentication required.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/application/ads
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "carousel": [
      {
        "id": "advert-uuid-1",
        "type": "banner",
        "image": "https://example.com/carousel.jpg",
        "link": "https://example.com",
        "location_id": "location-uuid",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "header": [
      {
        "id": "advert-uuid-2",
        "type": "banner",
        "image": "https://example.com/header.jpg",
        "link": "https://example.com",
        "location_id": "location-uuid-2",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "application": [
      {
        "title": "Popular Apps",
        "apps": [
          {
            "id": "advert-uuid-3",
            "type": "app",
            "image": "https://example.com/app-icon.jpg",
            "name": "App Name",
            "package": "com.example.app",
            "location_id": "location-uuid-3",
            "channel": "android",
            "sort": 1,
            "status": true
          }
        ]
      }
    ],
    "footer": [
      {
        "id": "advert-uuid-4",
        "type": "banner",
        "image": "https://example.com/footer.jpg",
        "link": "https://example.com",
        "location_id": "location-uuid-4",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ]
  }
}
```

> **Important Notes**:
> - This endpoint is publicly accessible (no authentication required)
> - Ads are filtered by user OS (Android/iOS) detected from request headers
> - Footer ads are shuffled randomly on each request
> - Ads are cached for 1 hour to improve performance
> - Only active ads (`status: true`) are returned
> - Ads are sorted by `sort` field (ascending for carousel/header/footer, descending for application groups)

## GET `/api/v1/app/ads`
Get all app ads including popup, splash screen, and application groups. No authentication required.

```bash
curl https://efdfd435gv.qdhgtch.com/api/v1/app/ads
```

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "popup_application": [
      {
        "id": "advert-uuid-1",
        "type": "app",
        "image": "https://example.com/app-icon.jpg",
        "name": "App Name",
        "package": "com.example.app",
        "location_id": "location-uuid",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "profile_app_group": [
      {
        "id": "advert-uuid-2",
        "type": "app",
        "image": "https://example.com/app-icon2.jpg",
        "name": "Another App",
        "package": "com.example.app2",
        "location_id": "location-uuid-2",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "creator_center_app_group": [
      {
        "id": "advert-uuid-3",
        "type": "app",
        "image": "https://example.com/app-icon3.jpg",
        "name": "Creator App",
        "package": "com.example.creator",
        "location_id": "location-uuid-3",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "ranking_carousel": [
      {
        "id": "advert-uuid-4",
        "type": "app",
        "image": "https://example.com/app-icon4.jpg",
        "name": "Ranking App",
        "package": "com.example.ranking",
        "location_id": "location-uuid-4",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "index_popup": [
      {
        "id": "advert-uuid-5",
        "type": "popup",
        "image": "https://example.com/popup.jpg",
        "link": "https://example.com",
        "location_id": "location-uuid-5",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ],
    "splash_screen": [
      {
        "id": "advert-uuid-6",
        "type": "splash",
        "image": "https://example.com/splash.jpg",
        "link": "https://example.com",
        "location_id": "location-uuid-6",
        "channel": "android",
        "sort": 1,
        "status": true
      }
    ]
  }
}
```

> **Important Notes**:
> - This endpoint is publicly accessible (no authentication required)
> - Ads are filtered by user OS (Android/iOS) detected from request headers
> - Application groups (`popup_application`, `profile_app_group`, `creator_center_app_group`, `ranking_carousel`) are cached for 1 hour
> - Related ads (`index_popup`, `splash_screen`) are not cached and are fetched fresh on each request
> - Multiple ads can be returned for `index_popup` (type: "multiple")
> - Only active ads (`status: true`) are returned
> - Ads are sorted by `sort` field (descending for application groups)

# Internal API

## API Key Configuration

The internal API endpoints require API key authentication. To configure API keys:

1. **Add to your `.env` file**:
   ```env
   INTERNAL_API_KEYS=your-secret-api-key-1,your-secret-api-key-2
   ```

2. **Generate a secure API key** (64-character hex string):
   ```bash
   php -r "echo bin2hex(random_bytes(32));"
   ```
   Example output: `651b611ac839cc4729605f87029afe0cb2fbf22e14aaef78753f9f37cd2c91ba`

3. **Multiple keys**: You can provide multiple API keys separated by commas. This is useful for:
   - Different environments (development, staging, production)
   - Different services (transcoding service, webhook service, etc.)
   - Key rotation without downtime

4. **After updating `.env`**, clear the config cache:
   ```bash
   php artisan config:clear
   ```

5. **Use the API key** in requests by including it in the `X-API-Key` header:
   ```bash
   curl -X POST https://example.com/api/v1/internal/post/publish \
     -H 'X-API-Key: your-secret-api-key-1' \
     -H 'Content-Type: application/json' \
     -d '{...}'
   ```

> **Security Best Practices**:
> - Use strong, randomly generated keys (at least 32 bytes)
> - Never commit API keys to version control
> - Rotate keys periodically
> - Use different keys for different environments
> - Restrict API key access to trusted IPs if possible

## POST `/api/v1/internal/post/publish`
Publish video from external systems (e.g., video transcoding services). This endpoint is protected by API key authentication and is used to publish videos after transcoding is complete.

**Authentication**: API Key (via `X-API-Key` header)

```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/internal/post/publish \
  -H 'X-API-Key: your-api-key-here' \
  -H 'Content-Type: application/json' \
  -d '{
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Awesome Video",
    "uploader_id": "123e4567-e89b-12d3-a456-426614174000",
    "description": "This is a great video",
    "cover_url": "https://example.com/cover.jpg",
    "city": "New York",
    "province": "New York",
    "tags": ["funny", "viral", "comedy"],
    "files": [
      {
        "url": "s3://bucket/video.mp4",
        "format": "mp4",
        "version": "main",
        "duration": 120,
        "width": 1920,
        "height": 1080,
        "size": 10485760
      },
      {
        "url": "s3://bucket/video.m3u8",
        "format": "m3u8",
        "version": "main",
        "duration": 120,
        "width": 1920,
        "height": 1080,
        "size": 1048576
      },
      {
        "url": "s3://bucket/preview.mp4",
        "format": "mp4",
        "version": "preview",
        "duration": 5,
        "width": 1920,
        "height": 1080,
        "size": 524288
      }
    ],
    "sprite_metadata": {
      "frames": [
        {
          "x": 0,
          "y": 0,
          "width": 160,
          "height": 90,
          "timestamp": 0.0
        }
      ],
      "sprite_width": 1600,
      "sprite_height": 900
    },
    "sprite_url": "https://example.com/sprite.jpg"
  }'
```

**Success Response (200)**:
```json
{
  "message": "Operation completed successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "My Awesome Video",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "file_type": "video",
    "files": [
      {
        "format": "mp4",
        "data": {
          "size": 10485760,
          "type": "video",
          "width": 1920,
          "height": 1080,
          "suffix": "mp4",
          "duration": 120,
          "thumbnail": "https://example.com/cover.jpg",
          "url": "s3://bucket/video.mp4",
          "description": "This is a great video"
        }
      },
      {
        "format": "m3u8",
        "data": {
          "size": 1048576,
          "type": "video",
          "width": 1920,
          "height": 1080,
          "suffix": "m3u8",
          "duration": 120,
          "thumbnail": "https://example.com/cover.jpg",
          "url": "s3://bucket/video.m3u8",
          "description": "This is a great video"
        }
      }
    ],
    "preview": {
      "url": "s3://bucket/preview.mp4",
      "format": "mp4",
      "version": "preview",
      "duration": 5,
      "width": 1920,
      "height": 1080,
      "size": 524288
    },
    "sprite_metadata": {
      "frames": [
        {
          "x": 0,
          "y": 0,
          "width": 160,
          "height": 90,
          "timestamp": 0.0
        }
      ],
      "sprite_width": 1600,
      "sprite_height": 900
    },
    "sprite_url": "https://example.com/sprite.jpg",
    "status": "published",
    "privacy": "public",
    "city": "New York",
    "province": "New York",
    "type": "post",
    "score": 0,
    "tags": [
      {
        "id": "tag-uuid-1",
        "name": "funny"
      },
      {
        "id": "tag-uuid-2",
        "name": "viral"
      },
      {
        "id": "tag-uuid-3",
        "name": "comedy"
      }
    ],
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  },
  "status": true
}
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `video_id` | UUID | Yes | Unique identifier for the video |
| `title` | string | Yes | Post title (max 255 characters) |
| `uploader_id` | UUID | Yes | User ID who uploaded the video (must exist in users table) |
| `description` | string | No | Video description |
| `cover_url` | string | Yes | Cover/thumbnail image URL |
| `city` | string | No | City location |
| `province` | string | No | Province location |
| `tags` | array | No | Array of tag names (strings) |
| `files` | array | Yes | Array of file objects (min 1) |
| `files[].url` | string | Yes | File URL |
| `files[].format` | string | Yes | File format (e.g., "mp4", "m3u8") |
| `files[].version` | string | Yes | File version ("preview" or "main") |
| `files[].duration` | number | No | Video duration in seconds |
| `files[].width` | integer | Yes | Video width in pixels |
| `files[].height` | integer | Yes | Video height in pixels |
| `files[].size` | integer | Yes | File size in bytes |
| `sprite_metadata` | object | No | Sprite metadata for video thumbnails |
| `sprite_url` | string | No | Sprite image URL |

**Error Responses**:

**401 Unauthorized** (Invalid API Key):
```json
{
  "error": "Invalid API key"
}
```

**422 Validation Error**:
```json
{
  "errors": {
    "video_id": ["The video id field is required."],
    "uploader_id": ["The uploader id field is required."],
    "files": ["The files field is required."]
  }
}
```

**500 Internal Server Error**:
```json
{
  "message": "Internal server error: [error details]",
  "data": [],
  "status": false
}
```

> **Important Notes**:
> - This endpoint requires API key authentication via the `X-API-Key` header
> - API keys are configured via the `INTERNAL_API_KEYS` environment variable (comma-separated)
> - Posts are immediately published with `status: "published"` (no review required)
> - The endpoint handles both creating new posts and updating existing ones:
>   - If a post with the same `video_id` exists, it will be updated
>   - If a transcoding post with the same title and user exists, it will be updated with the new `video_id`
>   - Otherwise, a new post will be created
> - Preview files (with `version: "preview"`) are stored separately from main video files
> - Tags are automatically created if they don't exist
> - MyDay cache is automatically cleared after publishing


# Favourite API

The Favourite feature allows users to bookmark posts (movies/videos) for quick access. It's a simple one-click feature similar to "Like" buttons in social media apps.

## POST `/api/v1/favourite/add`
Add a post to favourites. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/favourite/add \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the post to favourite (must exist in posts table) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "is_favourite": true,
    "favourites_count": 245,
    "favourited_at": "2025-12-03T10:30:00.000000Z"
  }
}
```

**Error Responses**:

**400 Bad Request** (Already favourited):
```json
{
  "status": false,
  "message": "Post already in favourites",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Post already in favourites"
  }
}
```

**404 Not Found** (Post doesn't exist):
```json
{
  "status": false,
  "message": "Post not found",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Post not found"
  }
}
```

**422 Validation Error**:
```json
{
  "errors": {
    "post_id": ["The post id field is required."]
  }
}
```

> **Important Notes**:
> - This endpoint requires authentication via `Authorization: Bearer <access_token>` header
> - A user can only favourite a post once (database unique constraint)
> - Returns the total favourites count for the post
> - The favourite is stored in the `user_favourites` table

## POST `/api/v1/favourite/remove`
Remove one or more posts from favourites. Supports both single and batch removal. Requires `Authorization: Bearer <access_token>`.

**Request (Single Post):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/favourite/remove \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Request (Multiple Posts):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/favourite/remove \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": [
      "550e8400-e29b-41d4-a716-446655440000",
      "6a8b7c9d-e2f3-41d4-b816-556677889900",
      "7c9d8e0f-f3a4-52e5-c927-667788990011"
    ]
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID or UUID[] | Yes | The ID(s) of the post(s) to unfavourite. Can be a single UUID string or an array of UUIDs for batch removal. |

**Success Response (200) - Single Post**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "is_favourite": false,
    "favourites_count": 244
  }
}
```

**Success Response (200) - Multiple Posts**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "removed": [
      {
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "favourites_count": 244
      },
      {
        "post_id": "6a8b7c9d-e2f3-41d4-b816-556677889900",
        "favourites_count": 132
      }
    ],
    "failed": [
      {
        "post_id": "7c9d8e0f-f3a4-52e5-c927-667788990011",
        "error": "Favourite not found"
      }
    ],
    "removed_count": 2,
    "failed_count": 1
  }
}
```

**Error Responses**:

**404 Not Found** (Favourite not found):
```json
{
  "status": false,
  "message": "Favourite not found",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Favourite not found"
  }
}
```

> **Important Notes**:
> - Can remove a single favourite or multiple favourites in one request
> - Returns the updated favourites count for each post
> - When removing multiple posts, the operation continues even if some posts fail (partial success)
> - Failed removals are reported in the `failed` array with error messages

## GET `/api/v1/favourite/list`
Get user's favourite posts with pagination. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/favourite/list?page=1&per_page=20" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1, min: 1) |
| `per_page` | integer | No | Items per page (default: 20, min: 1, max: 100) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "favourites": [
      {
        "id": "post-uuid-1",
        "title": "Amazing Movie",
        "favourited_at": "2025-12-03T10:30:00.000000Z",
        "is_favourite": true,
        "favourites_count": 245,
        "files": [
          {
            "size": "10485760",
            "type": "video",
            "width": 1920,
            "height": 1080,
            "suffix": "mp4",
            "duration": 120,
            "thumbnail": "https://example.com/thumbnail.jpg",
            "resourceURL": "https://example.com/video.mp4"
          }
        ],
        "user": {
          "user_id": "user-uuid",
          "username": "johndoe",
          "nickname": "John Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "tag": ["action", "thriller"]
      }
    ],
    "total": 15,
    "current_page": 1,
    "per_page": 20,
    "last_page": 1
  }
}
```

> **Important Notes**:
> - Returns posts ordered by favourite creation time (newest first)
> - Each post includes complete post details
> - `favourited_at` shows when the user favourited the post
> - Supports standard pagination parameters

## GET `/api/v1/favourite/check`
Check if a post is favourited by the current user and get the total favourites count. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/favourite/check?post_id=550e8400-e29b-41d4-a716-446655440000" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The ID of the post to check (must exist in posts table) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "is_favourite": true,
    "favourites_count": 245
  }
}
```

> **Important Notes**:
> - `is_favourite` indicates if the authenticated user has favourited this post
> - `favourites_count` shows the total number of users who favourited this post
> - Useful for displaying favourite status in UI

---

# Collection API

The Collection feature allows users to organize posts into custom named groups (like playlists). Users can create multiple collections, make them public or private, and manage posts within them.

## POST `/api/v1/collection/create`
Create a new collection. Requires `Authorization: Bearer <access_token>`.

**Request (JSON):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/create \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Watch Later",
    "description": "Movies to watch this weekend",
    "is_public": false,
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "sort_order": 0
  }'
```

**Request (With File Upload):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/create \
  -H 'Authorization: Bearer <access_token>' \
  -F 'name=Watch Later' \
  -F 'description=Movies to watch this weekend' \
  -F 'is_public=false' \
  -F 'thumbnail=@/path/to/image.jpg' \
  -F 'sort_order=0'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Collection name (max 255 characters) |
| `description` | string | No | Collection description (max 1000 characters) |
| `is_public` | boolean | No | Make collection public (default: false) |
| `thumbnail_url` | string | No | Collection thumbnail URL (max 500 characters) |
| `thumbnail` | file | No | Image file upload (jpeg, jpg, png, gif, webp; max 5MB) |
| `sort_order` | integer | No | User-defined sort order (min: 0) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collection": {
      "id": "collection-uuid",
      "name": "Watch Later",
      "description": "Movies to watch this weekend",
      "is_public": false,
      "thumbnail_url": "http://your-domain.com/storage/collections/user-id/thumbnails/uuid.jpg",
      "posts_count": 0,
      "sort_order": 0,
      "created_at": "2025-12-03T10:30:00.000000Z",
      "updated_at": "2025-12-03T10:30:00.000000Z"
    }
  }
}
```

**Error Responses**:

**422 Validation Error**:
```json
{
  "errors": {
    "name": ["The name field is required."]
  }
}
```

> **Important Notes**:
> - Users can create unlimited collections
> - Collection names don't need to be unique
> - `posts_count` is automatically maintained
> - You can provide either `thumbnail_url` (URL string) OR `thumbnail` (file upload), not both
> - If uploading a file, use `multipart/form-data` content type
> - Supported image formats: jpeg, jpg, png, gif, webp (max 5MB)

## POST `/api/v1/collection/update`
Update collection details. Requires `Authorization: Bearer <access_token>`.

**Request (JSON):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/update \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "name": "Must Watch",
    "description": "Updated description",
    "is_public": true
  }'
```

**Request (With File Upload):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/update \
  -H 'Authorization: Bearer <access_token>' \
  -F 'collection_id=collection-uuid' \
  -F 'name=Must Watch' \
  -F 'description=Updated description' \
  -F 'is_public=true' \
  -F 'thumbnail=@/path/to/new-image.jpg'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to update (must exist and belong to user) |
| `name` | string | No | New collection name (max 255 characters) |
| `description` | string | No | New description (max 1000 characters) |
| `is_public` | boolean | No | Update public status |
| `thumbnail_url` | string | No | Update thumbnail URL |
| `thumbnail` | file | No | Image file upload (jpeg, jpg, png, gif, webp; max 5MB) |
| `sort_order` | integer | No | Update sort order |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collection": {
      "id": "collection-uuid",
      "name": "Must Watch",
      "description": "Updated description",
      "is_public": true,
      "posts_count": 5,
      "created_at": "2025-12-03T10:30:00.000000Z",
      "updated_at": "2025-12-03T10:35:00.000000Z"
    }
  }
}
```

**Error Responses**:

**404 Not Found** (Collection not found or unauthorized):
```json
{
  "status": false,
  "message": "Collection not found or unauthorized",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Collection not found or unauthorized"
  }
}
```

> **Important Notes**:
> - Users can only update their own collections
> - All fields are optional (only provide fields you want to update)
> - You can provide either `thumbnail_url` (URL string) OR `thumbnail` (file upload), not both
> - If uploading a file, use `multipart/form-data` content type and the old thumbnail will be automatically deleted
> - Supported image formats: jpeg, jpg, png, gif, webp (max 5MB)

## DELETE `/api/v1/collection/delete`
Delete a collection. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X DELETE https://efdfd435gv.qdhgtch.com/api/v1/collection/delete \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid"
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to delete (must exist and belong to user) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "deleted": true
  }
}
```

> **Important Notes**:
> - Deleting a collection also removes all collection items (cascade delete)
> - The posts themselves are not deleted, only the collection associations
> - Users can only delete their own collections

## GET `/api/v1/collection/list`
Get all user's collections. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/collection/list?page=1&per_page=20" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1, min: 1) |
| `per_page` | integer | No | Items per page (default: 20, min: 1, max: 100) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collections": [
      {
        "id": "favorite",
        "name": "Favorite",
        "description": null,
        "is_public": false,
        "thumbnail_url": null,
        "posts_count": 8,
        "sort_order": -1,
        "created_at": "2025-12-03T10:30:00.000000Z",
        "updated_at": "2025-12-03T10:30:00.000000Z"
      },
      {
        "id": "collection-uuid-1",
        "name": "Watch Later",
        "description": "Movies to watch",
        "is_public": false,
        "thumbnail_url": "https://example.com/thumb1.jpg",
        "posts_count": 12,
        "sort_order": 0,
        "created_at": "2025-12-03T10:30:00.000000Z",
        "updated_at": "2025-12-03T10:30:00.000000Z"
      },
      {
        "id": "collection-uuid-2",
        "name": "Action Movies",
        "description": "Best action films",
        "is_public": true,
        "thumbnail_url": "https://example.com/thumb2.jpg",
        "posts_count": 25,
        "sort_order": 1,
        "created_at": "2025-12-02T15:20:00.000000Z",
        "updated_at": "2025-12-02T15:20:00.000000Z"
      }
    ],
    "total": 5,
    "current_page": 1,
    "per_page": 20,
    "last_page": 1
  }
}
```

> **Important Notes**:
> - A virtual "Favorite" collection (id: "favorite") is always included as the first item on page 1
> - The "Favorite" collection shows the count of posts the user has favorited
> - Regular collections are ordered by `sort_order` (ascending), then by creation date (descending)
> - Each collection includes `posts_count` showing number of posts
> - Supports standard pagination

## GET `/api/v1/collection/detail`
Get collection details with posts. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/collection/detail?collection_id=collection-uuid&page=1&per_page=20" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to retrieve |
| `page` | integer | No | Page number (default: 1) |
| `per_page` | integer | No | Items per page (default: 20, max: 100) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collection": {
      "id": "collection-uuid",
      "name": "Watch Later",
      "description": "Movies to watch",
      "is_public": false,
      "posts_count": 12,
      "created_at": "2025-12-03T10:30:00.000000Z",
      "user": {
        "user_id": "user-uuid",
        "username": "johndoe",
        "nickname": "John Doe"
      }
    },
    "posts": [
      {
        "id": "post-uuid-1",
        "title": "Amazing Movie",
        "files": [ /* post files */ ],
        "user": { /* post owner */ },
        "tag": ["action"]
      }
    ],
    "total_posts": 12,
    "current_page": 1,
    "per_page": 20,
    "last_page": 1
  }
}
```

**Error Responses**:

**403 Forbidden** (Private collection, not owner):
```json
{
  "status": false,
  "message": "Access denied to private collection",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Access denied to private collection"
  }
}
```

> **Important Notes**:
> - Public collections can be viewed by anyone
> - Private collections can only be viewed by the owner
> - Posts are ordered by `sort_order` within the collection
> - Posts include complete details (user, tags, files, etc.)

## POST `/api/v1/collection/add-post`
Add a post to a collection. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/add-post \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "post_id": "post-uuid"
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to add to (must exist and belong to user) |
| `post_id` | UUID | Yes | The post to add (must exist in posts table) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collection": {
      "id": "collection-uuid",
      "name": "Watch Later",
      "posts_count": 13
    },
    "post": {
      "id": "post-uuid",
      "title": "Amazing Movie"
    },
    "added_at": "2025-12-03T10:30:00.000000Z"
  }
}
```

**Error Responses**:

**400 Bad Request** (Post already in collection):
```json
{
  "status": false,
  "message": "Post already in collection",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Post already in collection"
  }
}
```

> **Important Notes**:
> - A post can only be added once to a collection (database unique constraint)
> - The post is added at the end of the collection (highest sort_order)
> - Collection `posts_count` is automatically updated

## POST `/api/v1/collection/remove-post`
Remove one or more posts from a collection. Supports both single and batch removal. Requires `Authorization: Bearer <access_token>`.

**Request (Single Post):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/remove-post \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "post_id": "post-uuid"
  }'
```

**Request (Multiple Posts):**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/remove-post \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "post_id": [
      "550e8400-e29b-41d4-a716-446655440000",
      "6a8b7c9d-e2f3-41d4-b816-556677889900",
      "7c9d8e0f-f3a4-52e5-c927-667788990011"
    ]
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to remove from |
| `post_id` | UUID or UUID[] | Yes | The ID(s) of the post(s) to remove. Can be a single UUID string or an array of UUIDs for batch removal. |

**Success Response (200) - Single Post**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "removed": true
  }
}
```

**Success Response (200) - Multiple Posts**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "removed": [
      {
        "post_id": "550e8400-e29b-41d4-a716-446655440000"
      },
      {
        "post_id": "6a8b7c9d-e2f3-41d4-b816-556677889900"
      }
    ],
    "failed": [
      {
        "post_id": "7c9d8e0f-f3a4-52e5-c927-667788990011",
        "error": "Post not found in collection"
      }
    ],
    "removed_count": 2,
    "failed_count": 1
  }
}
```

**Error Responses**:

**404 Not Found** (Post not in collection):
```json
{
  "status": false,
  "message": "Post not found in collection",
  "data": null,
  "error": {
    "code": "API_ERROR",
    "detail": "Post not found in collection"
  }
}
```

> **Important Notes**:
> - Collection `posts_count` is automatically updated
> - The post itself is not deleted, only removed from the collection
> - Can remove a single post or multiple posts in one request
> - When removing multiple posts, the operation continues even if some posts fail (partial success)
> - Failed removals are reported in the `failed` array with error messages

## POST `/api/v1/collection/reorder`
Reorder posts in a collection (for drag & drop functionality). Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/reorder \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "post_orders": [
      {"post_id": "post-uuid-1", "sort_order": 1},
      {"post_id": "post-uuid-2", "sort_order": 2},
      {"post_id": "post-uuid-3", "sort_order": 3}
    ]
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to reorder |
| `post_orders` | array | Yes | Array of objects with post_id and sort_order (min: 1 item) |
| `post_orders[].post_id` | UUID | Yes | Post ID to reorder |
| `post_orders[].sort_order` | integer | Yes | New sort position (min: 0) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "reordered": true
  }
}
```

> **Important Notes**:
> - You can reorder all posts or just specific ones
> - Lower `sort_order` values appear first
> - Used for implementing drag-and-drop reordering in UI

## GET `/api/v1/collection/posts`
Get posts in a collection. This is an alias for `/collection/detail`. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl "https://efdfd435gv.qdhgtch.com/api/v1/collection/posts?collection_id=collection-uuid&page=1" \
  -H 'Authorization: Bearer <access_token>'
```

> **Note**: See `/collection/detail` for complete documentation. This endpoint returns the same response format.

## POST `/api/v1/collection/add-to-multiple`
Add a post to multiple collections at once. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/add-to-multiple \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "post_id": "post-uuid",
    "collection_ids": [
      "collection-uuid-1",
      "collection-uuid-2",
      "collection-uuid-3"
    ]
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | UUID | Yes | The post to add (must exist in posts table) |
| `collection_ids` | array | Yes | Array of collection UUIDs (min: 1) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "added": [
      {
        "collection_id": "collection-uuid-1",
        "collection_name": "Watch Later"
      },
      {
        "collection_id": "collection-uuid-2",
        "collection_name": "Action Movies"
      }
    ],
    "errors": [
      {
        "collection_id": "collection-uuid-3",
        "error": "Post already in collection"
      }
    ],
    "added_count": 2,
    "error_count": 1
  }
}
```

> **Important Notes**:
> - Partial success is allowed (some collections may succeed, others may fail)
> - `added` array contains successfully added collections
> - `errors` array contains failed collections with error messages
> - Useful for "Add to Collection" modal with multiple collection checkboxes

## GET `/api/v1/collection/public`
Browse public collections from all users. Optional authentication (works with or without `Authorization` header).

**Request:**
```bash
# With authentication
curl "https://efdfd435gv.qdhgtch.com/api/v1/collection/public?page=1&per_page=20" \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Accept: application/json'

# Without authentication
curl "https://efdfd435gv.qdhgtch.com/api/v1/collection/public?page=1&per_page=20" \
  -H 'Accept: application/json'
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `per_page` | integer | No | Items per page (default: 20, max: 100) |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collections": [
      {
        "id": "collection-uuid-1",
        "name": "Best Action Movies",
        "description": "Top action films of all time",
        "is_public": true,
        "thumbnail_url": "https://example.com/thumb.jpg",
        "posts_count": 50,
        "sort_order": 0,
        "created_at": "2025-12-01T10:30:00.000000Z",
        "updated_at": "2025-12-01T10:30:00.000000Z",
        "user": {
          "user_id": "user-uuid",
          "username": "johndoe",
          "nickname": "John Doe",
          "avatar": "https://example.com/avatar.jpg"
        }
      }
    ],
    "total": 100,
    "current_page": 1,
    "per_page": 20,
    "last_page": 5
  }
}
```

> **Important Notes**:
> - Only public collections (`is_public: true`) are returned
> - Ordered by creation date (newest first)
> - Each collection includes owner information
> - Users can browse collections created by others
> - Useful for discovering curated content

## POST `/api/v1/collection/share`
Make a collection public or private. Requires `Authorization: Bearer <access_token>`.

**Request:**
```bash
# Make collection public
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/share \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "is_public": true
  }'

# Make collection private
curl -X POST https://efdfd435gv.qdhgtch.com/api/v1/collection/share \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_id": "collection-uuid",
    "is_public": false
  }'
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection_id` | UUID | Yes | The collection to share/unshare |
| `is_public` | boolean | Yes | true = public, false = private |

**Success Response (200)**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "collection": {
      "id": "collection-uuid",
      "name": "Watch Later",
      "is_public": true,
      "posts_count": 12,
      "created_at": "2025-12-03T10:30:00.000000Z",
      "updated_at": "2025-12-03T10:35:00.000000Z"
    }
  }
}
```

> **Important Notes**:
> - Users can only share their own collections
> - Public collections appear in `/collection/public` endpoint
> - Private collections are only visible to the owner
> - Use this for "Share Collection" or "Make Private" buttons in UI
