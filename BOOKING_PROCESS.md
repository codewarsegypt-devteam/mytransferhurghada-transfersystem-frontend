# Trip Booking Process Documentation

## Overview

This document describes the complete trip booking flow in the Fox Travel Egypt website. The booking process is designed to be secure, user-friendly, and integrated with Kashier payment gateway.

## User Journey

### 1. Browse & Select Trip
- User browses available trips (`/trips`)
- Selects a specific trip (`/trips/[slug]`)
- Clicks "Book Now" to start checkout

### 2. Checkout Flow (`/trips/checkout`)
The checkout process is divided into 4 steps:

#### Step 1: Date & Time Selection
- User selects a time slot (day of week + start time)
- System displays available dates for the next 90 days matching the selected day
- User picks a specific date

**Validation**: Both slot and date must be selected to proceed

#### Step 2: Participants
- User specifies number of participants:
  - **Adults** (Age 13+)
  - **Children** (Age 6-12)
  - **Infants** (Age 0-5)
- Real-time capacity validation (cannot exceed slot capacity)
- Dynamic pricing display

**Validation**: At least one participant required, total cannot exceed slot capacity

#### Step 3: Extras (Optional)
- User can add optional extras to their booking
- Two types of extras:
  - **Per Booking**: Added once regardless of participant count
  - **Per Person**: Multiplied by number of participants
- Each extra has quantity controls

**Validation**: Optional step, user can skip

#### Step 4: Review & Payment
- System fetches booking preview (pricing calculation)
- Displays complete breakdown:
  - Trip subtotal (adults + children + infants)
  - Extras subtotal
  - Discount (if promo code applied)
  - Final total
- Optional promo code input
- "Proceed to Payment" button

**Validation**: Booking preview must succeed

### 3. Payment Processing

#### 3.1 Prepare Booking
When user clicks "Proceed to Payment":

1. Frontend sends booking data to `/api/booking/prepare`
2. Server validates and calls preview API to verify pricing
3. Server generates a unique booking ID (UUID)
4. Booking data stored in-memory with:
   - Booking details
   - Expected amount & currency
   - Expiration timestamp (1 hour)
5. Returns booking ID to frontend

#### 3.2 Create Payment
1. Frontend sends booking ID to `/api/payment/create`
2. Server retrieves pending booking
3. Creates Kashier payment order with:
   - Amount and currency
   - Merchant order ID (booking ID)
   - Callback URLs
   - Payment security hash
4. Returns Kashier payment URL
5. User redirected to Kashier payment page

#### 3.3 Payment Execution
- User completes payment on Kashier's secure page
- Kashier redirects to `/api/payment/callback` (backend)
- Backend validates signature and redirects to `/payment/callback` (frontend)

#### 3.4 Payment Verification & Booking Completion
Frontend payment callback page (`/payment/callback`):

1. **Verify Payment**
   - Sends payment data to `/api/payment/verify`
   - Server validates Kashier signature
   - Confirms payment status

2. **Complete Booking**
   - If payment successful, calls `/api/booking/complete`
   - Server:
     - Retrieves pending booking by ID
     - Validates payment amount matches expected amount
     - Creates actual booking via backend API (`CREATE_TRIP_BOOKING`)
     - Deletes pending booking
     - Returns confirmed booking ID

3. **Show Result**
   - Success: Display booking confirmation with reference number
   - Failed: Show error message with retry option
   - Invalid: Show security warning

## Technical Architecture

### Frontend Components

#### `/app/trips/checkout/page.tsx`
Multi-step checkout form with:
- Step navigation
- Form state management
- Data validation
- Preview integration
- Payment initiation

**Key State:**
```typescript
type BookingFormData = {
  tripSlotId: number | null;
  date: string;           // YYYY-MM-DD
  adults: number;
  children: number;
  enfants: number;
  extras: ExtraItemRequest[];
  promoCode: string;
}
```

#### `/app/payment/callback/page.tsx`
Payment result handler:
- Payment verification
- Booking completion
- Success/failure UI
- Redirect logic

### Backend API Routes

#### `POST /api/booking/prepare`
Prepares booking for payment:
- **Input**: Booking form data
- **Process**: 
  - Validates required fields
  - Calls preview API to verify pricing
  - Generates UUID booking ID
  - Stores pending booking (1 hour expiry)
- **Output**: `{ success, bookingId, preview }`
- **Security**: In-memory storage prevents tampering

#### `POST /api/payment/create`
Creates Kashier payment:
- **Input**: `{ bookingId }`
- **Process**:
  - Retrieves pending booking
  - Builds Kashier payment order
  - Generates security hash
  - Creates payment URL
- **Output**: `{ success, paymentUrl, bookingId, amount, currency }`
- **Security**: Uses server-only PAYMENT_API_KEY

#### `GET /api/payment/callback`
Receives Kashier redirect:
- **Input**: Kashier query parameters
- **Process**:
  - Validates signature
  - Redirects to frontend callback with params
- **Output**: HTML redirect to `/payment/callback`
- **Security**: Server-side signature validation

#### `POST /api/payment/verify`
Verifies payment authenticity:
- **Input**: Payment parameters + signature
- **Process**:
  - Reconstructs signature with PAYMENT_API_KEY
  - Compares with Kashier's signature
  - Validates payment status
- **Output**: `{ verified, status, merchantOrderId, transactionId, amount, currency }`
- **Security**: Critical security checkpoint

#### `POST /api/booking/complete`
Finalizes booking after payment:
- **Input**: `{ bookingId, transactionId, paidAmount, paidCurrency }`
- **Process**:
  - Retrieves pending booking
  - Validates amount matches expected amount
  - Creates booking via backend API
  - Deletes pending booking
- **Output**: `{ success, bookingId }`
- **Security**: Amount validation prevents tampering

### API Integration Layer

#### `/lib/apis/bookingApi.ts`
```typescript
// Preview booking with pricing
previewTripBooking(bookingData): Promise<BookingPreviewResponseDto>

// Create actual booking
createTripBooking(bookingData): Promise<CreateTripBookingResponseDto>
```

**Error Handling**: All API functions throw on failure for React Query

### Data Types (`/lib/types/bookingTypes.ts`)

```typescript
interface ExtraItemRequest {
  extraId: number;
  quantity: number;
}

interface TripBookingRequest {
  tripSlotId: number;
  date: string;
  adults: number;
  children: number;
  enfants: number;
  extras: ExtraItemRequest[];
  promoCode: string;
  paymentMethod: "CreditCard" | "Cash";
  transactionId: string;
}

interface BookingPreviewData {
  total: number;
  currency: string;
  discountValue: number;
  discount: PromoCodeDetails;
  extras: ExtraItemResponse[];
  tripPriceAdult: number;
  tripPriceChild: number;
  tripPriceEnfant: number;
  tripTotal: number;
  extrasTotal: number;
}
```

## Security Measures

### 1. Booking ID as Payment Reference
- UUID-based booking ID prevents guessing
- Used as `merchantOrderId` in Kashier payment
- Links payment to specific booking data

### 2. Server-Side Storage
- Booking data stored on server, not client
- Cannot be tampered with during payment
- Automatic expiration (1 hour)

### 3. Amount Validation
- Expected amount stored with pending booking
- Validated against paid amount before completion
- Prevents price manipulation

### 4. Signature Verification
- Kashier signatures validated server-side
- Uses secret PAYMENT_API_KEY (not exposed to client)
- Prevents fraudulent payment confirmations

### 5. Separate Verification Endpoint
- Payment verification happens in dedicated endpoint
- Independent signature validation
- Returns sanitized, verified data to frontend

## Error Handling

### User-Facing Errors

1. **Checkout Validation Errors**
   - Missing required fields
   - Capacity exceeded
   - Invalid date selection

2. **Preview Errors**
   - API unavailable
   - Invalid promo code
   - Pricing calculation failure
   - User can retry preview

3. **Payment Errors**
   - Booking expired (> 1 hour)
   - Payment creation failure
   - User returned to checkout

4. **Callback Errors**
   - Invalid signature → Security warning
   - Payment failed → Retry option
   - Amount mismatch → Contact support
   - Booking creation failed → Manual review

### Technical Error Flow

```
User Action → Frontend Validation → API Call
              ↓ (fail)                ↓ (error)
           Show Error             Throw ApiError
              ↓                         ↓
        User can retry           React Query sets isError
              ↓                         ↓
        Try again              Component shows error UI
```

## API Endpoints Reference

### Backend API (External)
- `POST ${BASE}/api/Booking/previewTripBooking` - Calculate booking price
- `POST ${BASE}/api/Booking/bookTrip` - Create confirmed booking

### Internal API Routes
- `POST /api/booking/prepare` - Prepare booking for payment
- `POST /api/payment/create` - Create Kashier payment
- `GET /api/payment/callback` - Handle Kashier redirect
- `POST /api/payment/verify` - Verify payment signature
- `POST /api/booking/complete` - Complete booking after payment

### Frontend Routes
- `/trips/checkout?trip=[slug]` - Checkout page
- `/payment/callback?[kashier-params]` - Payment result page

## Testing Considerations

### Happy Path
1. Select trip, slot, date, participants
2. Add extras (optional)
3. Apply promo code (optional)
4. Review shows correct total
5. Payment succeeds
6. Booking confirmed with reference number

### Edge Cases
1. **Booking Expiration**: Wait > 1 hour between prepare and complete
2. **Amount Mismatch**: Modify expected amount in storage
3. **Invalid Signature**: Tamper with callback parameters
4. **Payment Failure**: Use test card that fails
5. **API Timeout**: Backend API unavailable during completion
6. **Concurrent Bookings**: Multiple users booking last slot

### Security Tests
1. Attempt to modify booking data in browser
2. Replay payment callback with different amount
3. Create payment without preparing booking
4. Use expired booking ID
5. Forge payment signature

## Future Improvements

1. **Database Persistence**: Replace in-memory storage with Redis/database
2. **Webhook Handling**: Implement `/api/payment/webhook` for async updates
3. **Email Notifications**: Send confirmation emails
4. **Booking Management**: User dashboard to view bookings
5. **Guest Checkout**: Collect contact info during checkout
6. **Payment Methods**: Support cash payments, wallets
7. **Retry Logic**: Automatic retry for transient failures
8. **Analytics**: Track conversion funnel, abandonment rates

## Maintenance Notes

### Environment Variables Required
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_BASE_URL=https://example.com
KASHIER_MID=your_merchant_id
PAYMENT_API_KEY=your_payment_api_key
```

### Monitoring Points
- Pending booking storage size
- Booking preparation success rate
- Payment completion rate
- Signature validation failures
- Amount mismatch occurrences

### Common Issues
1. **Booking not found**: Check expiration time, storage persistence
2. **Signature invalid**: Verify PAYMENT_API_KEY, check parameter order
3. **Amount mismatch**: Investigate race conditions, concurrent requests
4. **Redirect loops**: Check callback URL configuration

---

**Last Updated**: February 2026  
**Version**: 1.0  
**Maintained by**: Fox Travel Egypt Development Team
