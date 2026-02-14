'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';

type PaymentStatus = 'validating' | 'processing' | 'success' | 'failed' | 'invalid';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('validating');
  const [message, setMessage] = useState('Validating payment...');
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get all query parameters from Kashier redirect
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        // Capture transaction ID from URL early (available in success and failure)
        const txFromParams = params.transactionId || params.paymentId || params.orderReference || params.orderId;
        if (txFromParams) setTransactionId(txFromParams);

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
        if (verifyData.transactionId) setTransactionId(verifyData.transactionId);
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

  const transactionIdBlock = transactionId ? (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 mb-6 text-left">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
        Transaction ID
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm font-mono font-semibold text-gray-800 break-all">
          {transactionId}
        </code>
        <button
          type="button"
          onClick={() => copyToClipboard(transactionId)}
          className="shrink-0 p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:border-[--primary-orange] hover:text-[--primary-orange] transition-colors"
          title="Copy"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-b from-[#F5F6F6] via-white to-[#F5F6F6]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10">
          {/* Validating / Processing */}
          {(status === 'validating' || status === 'processing') && (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[--primary-orange]/10 mb-6">
                <Loader2 className="w-10 h-10 animate-spin text-[--primary-orange]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Processing
              </h2>
              <p className="text-gray-600 text-[15px]">{message}</p>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600 mb-6 text-[15px]">{message}</p>
              {bookingId && (
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 mb-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    Booking Reference
                  </p>
                  <p className="text-xl font-bold text-[--primary-orange]">#{bookingId}</p>
                </div>
              )}
              {transactionIdBlock}
              <div className="space-y-3 mt-6">
                <button
                  onClick={() => router.push('/trips')}
                  className="w-full px-6 py-3.5 bg-[--primary-orange] text-black font-semibold rounded-xl hover:bg-[--accent-orange] transition-colors shadow-sm"
                >
                  Browse More Trips
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Failed */}
          {status === 'failed' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6 text-[15px]">{message}</p>
              {transactionIdBlock}
              <div className="space-y-3 mt-6">
                <button
                  onClick={() => router.push('/trips')}
                  className="w-full px-6 py-3.5 bg-[--primary-orange] text-black font-semibold rounded-xl hover:bg-[--accent-orange] transition-colors shadow-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Invalid */}
          {status === 'invalid' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 mb-6">
                <AlertCircle className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Invalid Payment
              </h2>
              <p className="text-gray-600 mb-6 text-[15px]">{message}</p>
              {transactionIdBlock}
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3.5 bg-[--primary-orange] text-black font-semibold rounded-xl hover:bg-[--accent-orange] transition-colors shadow-sm mt-6"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-b from-[#F5F6F6] via-white to-[#F5F6F6]">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[--primary-orange]/10 mb-6">
              <Loader2 className="w-10 h-10 animate-spin text-[--primary-orange]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Loading</h2>
            <p className="text-gray-600 text-[15px]">Validating payment...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
