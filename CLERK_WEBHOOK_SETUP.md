# Clerk Webhook Setup Guide

This guide explains how to set up Clerk webhooks to trigger backend calls after user login/registration.

## What This Does

The webhook endpoint at `/api/webhooks/clerk` listens for Clerk authentication events and triggers actions:

- **`session.created`** - Fired when a user successfully logs in
- **`user.created`** - Fired when a new user signs up for the first time

## Setup Steps

### 1. Configure Webhook in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Enter your webhook URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Production**: `https://your-domain.com/api/webhooks/clerk`

6. Select the events to listen for:
   - ✅ `session.created` (for login tracking)
   - ✅ `user.created` (for new user registration)

7. Click **Create**
8. Copy the **Signing Secret** (starts with `whsec_`)

### 2. Update Environment Variables

Add the webhook secret to your `.env.local`:

```bash
CLERK_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

### 3. Test the Webhook (Development)

For local testing, use ngrok to expose your local server:

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Start your Next.js dev server
npm run dev

# In another terminal, start ngrok
ngrok http 3000
```

Use the ngrok URL in your Clerk webhook configuration.

### 4. Enable Backend API Calls

When ready to call your backend, edit `/app/api/webhooks/clerk/route.ts`:

1. Uncomment the TODO sections in the code
2. Update the endpoint URLs to match your backend API:
   - Login: `/api/auth/login-webhook`
   - Registration: `/api/auth/register-webhook`
3. Add any required authentication headers
4. Customize the payload data as needed

#### Example Backend Payload (Login)

```json
{
  "userId": "user_abc123",
  "sessionId": "sess_xyz789",
  "timestamp": "2026-02-03T10:30:00.000Z"
}
```

#### Example Backend Payload (Registration)

```json
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "timestamp": "2026-02-03T10:30:00.000Z"
}
```

## Security Considerations

- ✅ Webhook signature verification is implemented (using Svix)
- ✅ Only verified requests from Clerk are processed
- ⚠️ Add authentication headers when calling your backend
- ⚠️ Consider adding rate limiting for production
- ⚠️ Store sensitive keys in environment variables only

## Monitoring

The webhook logs events to the console:

```bash
# Successful login
🎉 User logged in successfully! { userId: '...', sessionId: '...', ... }

# New user registration
👤 New user created! { userId: '...', email: '...', ... }

# Backend call success
✅ Backend webhook called successfully

# Backend call failure
❌ Backend webhook call failed: ...
```

## Troubleshooting

### Webhook not receiving events
- Check that the webhook URL is correct and accessible
- Verify the signing secret matches in `.env.local`
- Check Clerk Dashboard > Webhooks > Logs for delivery attempts

### Backend call failing
- Verify your backend endpoint is reachable
- Check authentication headers are correct
- Review backend logs for errors
- Ensure CORS is configured if needed

### Testing locally
- Use ngrok or a similar tool to expose localhost
- Check ngrok logs to see incoming requests
- Use Clerk Dashboard > Webhooks > Testing to send test events

## Next Steps

1. ✅ Webhook endpoint created at `/api/webhooks/clerk/route.ts`
2. ⏳ Add `CLERK_WEBHOOK_SECRET` to your `.env.local`
3. ⏳ Configure webhook in Clerk Dashboard
4. ⏳ Uncomment and configure backend API calls
5. ⏳ Test with real login/signup events
6. ⏳ Deploy to production and update webhook URL
