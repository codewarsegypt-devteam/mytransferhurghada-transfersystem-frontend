/**
 * Transfer Payment Callback Page
 * 
 * This page handles the payment callback for transfer bookings.
 * After a user completes payment with Kashier for a transfer, they are redirected here.
 * The page verifies the payment and completes the transfer booking.
 */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SignInButton } from '@clerk/nextjs';
import { Loader2, CheckCircle, XCircle, AlertCircle, LogIn } from 'lucide-react';

type PaymentStatus = 'validating' | 'processing' | 'success' | 'failed' | 'invalid' | 'login_required';

function TransferCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('validating');
  const [message, setMessage] = useState('Validating payment...');
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get all query parameters from Kashier redirect
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        console.log('Kashier callback params (transfer):', params);

        // Verify payment on the server (PAYMENT_API_KEY is a server-only env var)
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentStatus: params.paymentStatus || params.transactionStatus || params.status,
            signature: params.signature,
            orderId: params.orderId,
            transactionId: params.transactionId || params.paymentId,
            amount: params.amount,
            currency: params.currency,
            merchantOrderId: params.merchantOrderId,
            cardDataToken: params.cardDataToken,
            maskedCard: params.maskedCard,
            cardBrand: params.cardBrand,
            orderReference: params.orderReference,
            mode: params.mode,
          }),
        });
        const verifyData = await verifyRes.json();
        console.log('verifyData (transfer):', verifyData);
        if (!verifyRes.ok || !verifyData.verified) {
          setStatus('invalid');
          setMessage(verifyData.message ?? 'Payment verification failed. This payment may be fraudulent.');
          return;
        }

        // Check payment status from verified response
        const paymentStatus = verifyData.status;
        const merchantOrderId = verifyData.merchantOrderId;

        console.log('Payment status:', paymentStatus);
        console.log('Merchant Order ID:', merchantOrderId);

        if (paymentStatus !== 'SUCCESS' && paymentStatus !== 'CAPTURED') {
          setStatus('failed');
          setMessage(
            verifyData.message || 
            params.message || 
            params.failureReason || 
            'Payment was not successful. Please try again.'
          );
          return;
        }

        // Payment successful - retrieve booking data from server
        setStatus('processing');
        setMessage('Payment successful! Creating your transfer booking...');

        // Get the booking ID from merchantOrderId
        const bookingId = merchantOrderId;
        if (!bookingId) {
          setStatus('failed');
          setMessage('Invalid payment reference. Please contact support.');
          return;
        }

        // Retrieve the pending booking from server and create the actual booking
        const bookingResponse = await fetch('/api/booking/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            bookingId,
            transactionId: verifyData.transactionId,
            paidAmount: parseFloat(verifyData.amount || '0'),
            paidCurrency: verifyData.currency || '',
          }),
        });

        const data = await bookingResponse.json().catch(() => ({}));
        if (!bookingResponse.ok) {
          const isLoginRequired =
            bookingResponse.status === 401 && data.code === 'USER_REQUIRED';
          if (isLoginRequired) {
            setStatus('login_required');
            setMessage(
              data.message ||
                'You must be logged in to complete a transfer booking. Please log in and try again.'
            );
            return;
          }
          setStatus('failed');
          setMessage(data.message || 'Failed to complete booking. Please contact support.');
          return;
        }

        const result = data;
        
        if (!result.success || !result.bookingId) {
          setStatus('failed');
          setMessage(result.message || 'Failed to complete booking. Please contact support.');
          return;
        }

        setBookingId(result.bookingId);
        setStatus('success');
        setMessage('Your transfer booking has been confirmed!');

      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('failed');
        setMessage(
          error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred. Please contact support.'
        );
      }
    }

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5E6D8] py-8 pt-24 flex items-center justify-center px-4">
      <div className="container mx-auto max-w-lg">
        <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-8">
          {/* Validating / Processing */}
          {(status === 'validating' || status === 'processing') && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-(--primary-orange) mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-(--black) mb-2">Processing</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-(--black) mb-2">Transfer Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              {bookingId && (
                <div className="bg-(--off-white)/80 border border-(--light-grey) rounded-lg p-4 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Reference Number
                  </p>
                  <p className="text-xl font-bold text-(--accent-orange) font-mono">
                    {bookingId}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/transfer')}
                  className="w-full px-6 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) transition-colors"
                >
                  Book Another Transfer
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-(--light-grey) hover:bg-(--off-white) transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Failed */}
          {status === 'failed' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-(--black) mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/transfer')}
                  className="w-full px-6 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-(--light-grey) hover:bg-(--off-white) transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Invalid */}
          {status === 'invalid' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-amber-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-(--black) mb-2">Invalid Payment</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Login required (backend requires user for transfer booking) */}
          {status === 'login_required' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                  <LogIn className="w-12 h-12 text-amber-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-(--black) mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <SignInButton mode="modal" forceRedirectUrl="/transfer">
                  <button
                    type="button"
                    className="w-full px-6 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Log in and try again
                  </button>
                </SignInButton>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-(--light-grey) hover:bg-(--off-white) transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransferCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5E6D8] py-8 pt-24 flex items-center justify-center px-4">
          <div className="container mx-auto max-w-lg">
            <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-8 text-center">
              <Loader2 className="w-16 h-16 animate-spin text-(--primary-orange) mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-(--black) mb-2">Loading</h2>
              <p className="text-gray-600">Validating payment...</p>
            </div>
          </div>
        </div>
      }
    >
      <TransferCallbackContent />
    </Suspense>
  );
}
