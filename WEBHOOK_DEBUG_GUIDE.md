# Clerk Webhook Debug Guide

Your webhook is not firing when you sign in. Follow these steps to diagnose and fix the issue.

## Step 1: Check Environment Variables

1. Open your `.env.local` file
2. Verify you have these three variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # ← This one is required for webhooks
```

3. Test the configuration:

```bash
# Visit this URL in your browser
http://localhost:3000/api/webhooks/clerk/test
```

You should see:
```json
{
  "success": true,
  "envCheck": {
    "hasWebhookSecret": true,  // ← Must be true
    "hasPublishableKey": true,
    "hasSecretKey": true
  }
}
```

## Step 2: Set Up Ngrok (for Local Development)

Clerk's webhooks need a **publicly accessible URL**. Your localhost is not accessible from the internet.

### Install and Run Ngrok

```bash
# Install ngrok (if you haven't)
npm install -g ngrok

# Start your Next.js dev server
npm run dev

# In a NEW terminal, start ngrok
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the `https://abc123.ngrok.io` URL** - you'll need it for Step 3.

## Step 3: Configure Webhook in Clerk Dashboard

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your application
3. Click **Webhooks** in the left sidebar
4. Click **Add Endpoint**

### Webhook Configuration

**Endpoint URL:**
```
https://abc123.ngrok.io/api/webhooks/clerk
```
(Replace `abc123` with your actual ngrok subdomain)

**Events to Subscribe:**
- ✅ `session.created` ← **CRITICAL: Must be enabled**
- ✅ `user.created`

**Important:** Make sure `session.created` is checked - this is the event that fires on login!

5. Click **Create**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add it to your `.env.local`:

```bash
CLERK_WEBHOOK_SECRET=whsec_your_copied_secret_here
```

8. **Restart your Next.js dev server** (webhooks won't work without restart)

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## Step 4: Test the Webhook

1. Open your app: `http://localhost:3000`
2. Click the "Sign In" button in the header
3. Sign in with Google
4. Watch your terminal for webhook logs:

### Expected Logs

```bash
🎯 Webhook endpoint called at: 2026-02-04T...
✅ Webhook secret found
📨 Webhook headers: { svix-id: '...', svix-timestamp: '...', svix-signature: 'present' }
📦 Webhook payload type: session.created
✅ Webhook signature verified
📋 Processing event type: session.created
🎉 User logged in successfully! { userId: '...', sessionId: '...' }
🔐 Calling backend authentication... { email: '...', name: '...' }
✅ Backend authentication successful and token stored
```

### If You See Nothing

Check Clerk Dashboard:
1. Go to **Webhooks**
2. Click on your endpoint
3. Check the **Message Attempts** tab
4. Look for failed deliveries and error messages

## Step 5: Common Issues

### Issue: "CLERK_WEBHOOK_SECRET not found"
**Fix:** Add the secret to `.env.local` and restart the dev server

### Issue: Ngrok URL not working
**Fix:** Make sure:
- Ngrok is running (`ngrok http 3000`)
- You're using the HTTPS URL (not HTTP)
- The URL in Clerk Dashboard exactly matches ngrok output

### Issue: Webhook fires but backend auth fails
**Fix:** Check that `process.env.NEXT_PUBLIC_API_URL` is set correctly

### Issue: "Error verifying webhook"
**Fix:** The signing secret doesn't match. Copy it again from Clerk Dashboard

## Step 6: Production Setup

Once it works locally, for production:

1. Deploy your app to Vercel/Netlify/etc
2. Update the webhook URL in Clerk Dashboard to your production URL:
   ```
   https://yourdomain.com/api/webhooks/clerk
   ```
3. Add `CLERK_WEBHOOK_SECRET` to your production environment variables

## Quick Debug Checklist

- [ ] `.env.local` has `CLERK_WEBHOOK_SECRET`
- [ ] Dev server was restarted after adding the secret
- [ ] Ngrok is running and showing `https://...` URL
- [ ] Webhook URL in Clerk Dashboard matches ngrok URL
- [ ] `session.created` event is enabled in Clerk Dashboard
- [ ] Signing secret in `.env.local` matches Clerk Dashboard
- [ ] Terminal shows webhook logs when you sign in

## Still Not Working?

1. Check browser console for errors
2. Check Clerk Dashboard > Webhooks > Message Attempts for error details
3. Try the test endpoint: `http://localhost:3000/api/webhooks/clerk/test`
4. Check ngrok dashboard: `http://127.0.0.1:4040` (shows all requests)

---

**Need help?** Share the logs from your terminal and the error from Clerk Dashboard > Webhooks > Message Attempts.
