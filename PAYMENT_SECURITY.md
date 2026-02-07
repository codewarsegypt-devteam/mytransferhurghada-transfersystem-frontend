# Payment Security Implementation

This document explains the secure payment flow implemented for the Fox Travel Egypt booking system.

## Security Flow Overview

The payment system uses a secure server-side storage approach to prevent client-side data manipulation:

```
1. User fills checkout form
   ↓
2. Client calls /api/booking/prepare
   ↓
3. Server validates & stores booking data with unique ID
   ↓
4. Client receives bookingId (UUID)
   ↓
5. Client calls /api/payment/create with bookingId
   ↓
6. Server retrieves booking, creates Kashier payment URL
   ↓
7. User redirected to Kashier payment page
   ↓
8. User completes payment
   ↓
9. Kashier redirects to /payment/callback?signature=...&merchantOrderId=bookingId&...
   ↓
10. Client validates signature with server secret
   ↓
11. Client calls /api/booking/complete
   ↓
12. Server validates payment amount & creates actual booking
   ↓
13. User sees confirmation with booking ID
```

## Security Features

### 1. **Server-Side Data Storage**
- Booking data is stored on the server, not in client-side sessionStorage
- Uses cryptographically secure UUID as booking reference
- Prevents users from manipulating booking details or prices

### 2. **Payment Amount Validation**
- Server stores expected payment amount when booking is prepared
- On callback, server validates that paid amount matches expected amount
- Prevents payment manipulation attacks

### 3. **Signature Validation**
- All Kashier callbacks are validated using HMAC-SHA256 signature
- Prevents fraudulent callback requests
- Uses server-side secret key (never exposed to client)

### 4. **Booking Expiration**
- Pending bookings expire after 1 hour
- Automatic cleanup of expired bookings
- Prevents stale bookings from accumulating

### 5. **Idempotency**
- Each booking has a unique ID (UUID)
- Prevents duplicate bookings from the same payment
- Pending booking is deleted after successful completion

## API Endpoints

### POST `/api/booking/prepare`
Prepares a booking for payment by storing it securely on the server.

**Request:**
```json
{
  "tripSlotId": 123,
  "date": "2026-02-15",
  "adults": 2,
  "children": 1,
  "enfants": 0,
  "extras": [
    { "extraId": 5, "quantity": 1 }
  ],
  "promoCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "550e8400-e29b-41d4-a716-446655440000",
  "preview": {
    "total": 150.00,
    "currency": "EUR",
    // ... preview details
  }
}
```

### POST `/api/payment/create`
Creates a Kashier payment URL for a prepared booking.

**Request:**
```json
{
  "bookingId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://payments.kashier.io/?merchantId=...",
  "bookingId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": "150.00",
  "currency": "EUR"
}
```

### POST `/api/booking/complete`
Completes a booking after successful payment.

**Request:**
```json
{
  "bookingId": "550e8400-e29b-41d4-a716-446655440000",
  "transactionId": "KASHIER-TXN-12345",
  "paidAmount": 150.00,
  "paidCurrency": "EUR"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": 456,
  "message": "Booking created successfully"
}
```

## Important Notes

### Production Deployment

⚠️ **CRITICAL**: The current implementation uses **in-memory storage** for pending bookings. This is suitable for development but **NOT for production**.

For production deployment, you must replace the in-memory storage with a persistent store:

#### Option 1: Redis (Recommended)
```typescript
// lib/storage/pendingBookings.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function storePendingBooking(booking: PendingBooking) {
  await redis.setex(
    `pending:${booking.id}`,
    3600, // 1 hour TTL
    JSON.stringify(booking)
  );
  return booking;
}

export async function getPendingBooking(id: string) {
  const data = await redis.get(`pending:${id}`);
  return data ? JSON.parse(data) : null;
}
```

#### Option 2: Database Table
Create a `pending_bookings` table:
```sql
CREATE TABLE pending_bookings (
  id UUID PRIMARY KEY,
  booking_data JSONB NOT NULL,
  expected_amount DECIMAL(10,2) NOT NULL,
  expected_currency VARCHAR(3) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_expires_at ON pending_bookings(expires_at);
```

### Environment Variables Required
```env
# Kashier Configuration
MID=MID-XXXXX
PAYMENT_API_KEY=your-kashier-api-key
MODE=test  # or "live" for production

# Application URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
BASE_URL=https://your-domain.com

# For production with Redis
REDIS_URL=redis://localhost:6379
```

### Testing

To test the payment flow:

1. Use Kashier test mode credentials
2. Test card numbers provided by Kashier documentation
3. Verify signature validation works correctly
4. Test expiration (set short expiry for testing)
5. Test amount mismatch scenarios
6. Test with expired bookings

### Monitoring & Logging

Key events to monitor:
- Pending booking creation
- Payment creation
- Signature validation failures (potential fraud)
- Amount mismatch errors (potential manipulation)
- Booking completion success/failure
- Expired bookings cleanup

### Error Handling

The system handles various error scenarios:
- Invalid booking data → 400 error with clear message
- Expired booking → 404 error directing user to start over
- Amount mismatch → 400 error with support contact info
- API errors → Logged with details for debugging
- Network failures → User-friendly error messages

## Future Improvements

Consider implementing:
1. **Webhook Handler**: Add `/api/payment/webhook` for server-to-server notifications
2. **Payment Status Page**: Allow users to check payment status with booking ID
3. **Admin Dashboard**: View pending/failed bookings for manual review
4. **Retry Logic**: Automatic retry for failed booking creations
5. **Audit Log**: Track all payment attempts for compliance
6. **Rate Limiting**: Prevent abuse of prepare endpoint
7. **Email Notifications**: Send confirmation emails on successful booking
