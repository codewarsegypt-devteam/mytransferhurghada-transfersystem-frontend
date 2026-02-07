'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type PaymentStatus = 'validating' | 'processing' | 'success' | 'failed' | 'invalid';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('validating');
  const [message, setMessage] = useState('Validating payment...');
  const [bookingId, setBookingId] = useState<number | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get all query parameters from Kashier redirect
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        console.log('Kashier callback params:', params);

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
        console.log('verifyData', verifyData);
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
        setMessage('Payment successful! Creating your booking...');

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
          body: JSON.stringify({
            bookingId,
            transactionId: verifyData.transactionId,
            paidAmount: parseFloat(verifyData.amount || '0'),
            paidCurrency: verifyData.currency || '',
          }),
        });

        if (!bookingResponse.ok) {
          const error = await bookingResponse.json();
          setStatus('failed');
          setMessage(error.message || 'Failed to complete booking. Please contact support.');
          return;
        }

        const result = await bookingResponse.json();
        
        if (!result.success || !result.bookingId) {
          setStatus('failed');
          setMessage(result.message || 'Failed to complete booking. Please contact support.');
          return;
        }

        setBookingId(result.bookingId);
        setStatus('success');
        setMessage('Your booking has been confirmed!');

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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Validating / Processing */}
        {(status === 'validating' || status === 'processing') && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-[--primary-orange] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            {bookingId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="text-xl font-bold text-[--primary-orange]">#{bookingId}</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/trips')}
                className="w-full px-6 py-3 bg-[--primary-orange] text-black font-semibold rounded-lg hover:bg-[--accent-orange] transition-colors"
              >
                Browse More Trips
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/trips')}
                className="w-full px-6 py-3 bg-[--primary-orange] text-black font-semibold rounded-lg hover:bg-[--accent-orange] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Invalid */}
        {status === 'invalid' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-[--primary-orange] text-black font-semibold rounded-lg hover:bg-[--accent-orange] transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-[--primary-orange] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading</h2>
            <p className="text-gray-600">Validating payment...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
