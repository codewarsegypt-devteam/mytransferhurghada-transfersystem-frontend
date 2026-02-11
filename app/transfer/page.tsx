'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Calendar,
  Car,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Check,
  Users,
  ArrowRightLeft,
  Banknote,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import DateTimePicker from '@/components/ui/DateTimePicker';
import { getVehicleTypes, previewTransferBooking } from '@/lib/apis/transferApi';
import { isApiError } from '@/lib/apis/apiErrors';
import type {
  VehicleTypeDto,
  TransferLegRequest,
  ExtraItemRequest,
  TransferPreviewData,
} from '@/lib/types/bookingTypes';

// Dynamic import for map component (client-only, no SSR)
const TransferMapPicker = dynamic(() => import('@/components/TransferMapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16 bg-(--off-white)/50 rounded-brand border border-(--light-grey)">
      <Loader2 className="w-8 h-8 animate-spin text-(--primary-orange)" />
    </div>
  ),
});

// Step configuration
const STEPS = [
  { id: 1, name: 'Route', icon: MapPin },
  { id: 2, name: 'Date & Time', icon: Calendar },
  { id: 3, name: 'Vehicle', icon: Car },
  { id: 4, name: 'Payment', icon: CreditCard },
];

type TransferFormData = {
  fromRegionId: number | null;
  fromRegionName: string;
  fromLat: number | null;
  fromLng: number | null;
  fromIsAirport: boolean;
  toRegionId: number | null;
  toRegionName: string;
  toLat: number | null;
  toLng: number | null;
  toIsAirport: boolean;
  pickupDateTime: string;
  vehicleTypeId: number | null;
  extras: ExtraItemRequest[];
  promoCode: string;
};

export default function TransferBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'CreditCard' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashBookingConfirmed, setCashBookingConfirmed] = useState(false);
  const [cashBookingReference, setCashBookingReference] = useState<string>('');

  const [formData, setFormData] = useState<TransferFormData>({
    fromRegionId: null,
    fromRegionName: '',
    fromLat: null,
    fromLng: null,
    fromIsAirport: false,
    toRegionId: null,
    toRegionName: '',
    toLat: null,
    toLng: null,
    toIsAirport: false,
    pickupDateTime: '',
    vehicleTypeId: null,
    extras: [],
    promoCode: '',
  });

  // Fetch vehicle types
  const { data: vehicleTypesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: () => getVehicleTypes(),
  });

  const vehicleTypes: VehicleTypeDto[] = vehicleTypesData?.data?.data || [];

  // Preview transfer booking
  const {
    data: previewData,
    isLoading: previewLoading,
    isError: previewIsError,
    error: previewError,
    refetch: refetchPreview,
  } = useQuery({
    queryKey: ['transferPreview', formData],
    queryFn: () => {
      const leg: TransferLegRequest = {
        fromRegionId: formData.fromRegionId!,
        toRegionId: formData.toRegionId!,
        pickupDateTime: formData.pickupDateTime,
      };
      return previewTransferBooking({
        vehicleTypeId: formData.vehicleTypeId!,
        legs: [leg],
        extras: formData.extras,
        promoCode: formData.promoCode,
      });
    },
    enabled: false, // Manual trigger
  });

  // Validation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return formData.fromRegionId != null && formData.toRegionId != null;
      case 2:
        return Boolean(formData.pickupDateTime);
      case 3:
        return formData.vehicleTypeId != null;
      case 4:
        return paymentMethod != null;
      default:
        return false;
    }
  }, [currentStep, formData, paymentMethod]);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Handle payment
      if (paymentMethod === 'Cash') {
        await handleCashPayment();
      } else {
        await handleCreditCardPayment();
      }
    } else {
      if (currentStep === 3) {
        // Fetch preview before going to payment step
        await refetchPreview();
      }
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCashPayment = async () => {
    try {
      setIsProcessing(true);

      const leg: TransferLegRequest = {
        fromRegionId: formData.fromRegionId!,
        toRegionId: formData.toRegionId!,
        pickupDateTime: formData.pickupDateTime,
      };

      // For cash payment, we bypass the prepare/payment flow
      // and call createTransferBooking directly
      const response = await fetch('/api/transfer/booking/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleTypeId: formData.vehicleTypeId,
          legs: [leg],
          extras: formData.extras,
          promoCode: formData.promoCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to create booking. Please try again.');
        return;
      }

      const result = await response.json();
      setCashBookingReference(result.bookingId || 'N/A');
      setCashBookingConfirmed(true);
    } catch (error) {
      console.error('Cash payment error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreditCardPayment = async () => {
    try {
      setIsProcessing(true);

      const leg: TransferLegRequest = {
        fromRegionId: formData.fromRegionId!,
        toRegionId: formData.toRegionId!,
        pickupDateTime: formData.pickupDateTime,
      };

      // Step 1: Prepare the booking
      const prepareResponse = await fetch('/api/booking/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType: 'transfer',
          vehicleTypeId: formData.vehicleTypeId,
          legs: [leg],
          extras: formData.extras,
          promoCode: formData.promoCode,
        }),
      });

      if (!prepareResponse.ok) {
        const error = await prepareResponse.json();
        alert(error.message || 'Failed to prepare booking. Please try again.');
        return;
      }

      const prepareResult = await prepareResponse.json();
      const { bookingId } = prepareResult;

      if (!bookingId) {
        alert('Failed to prepare booking. Please try again.');
        return;
      }

      // Step 2: Create payment
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, redirectUrl: "/transfer/callback" }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        alert(error.message || 'Failed to create payment. Please try again.');
        return;
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Redirect to Kashier payment page
        window.location.href = paymentResult.paymentUrl;
      } else {
        alert('Failed to create payment. Please try again.');
      }
    } catch (error) {
      console.error('Credit card payment error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If cash booking confirmed, show confirmation
  if (cashBookingConfirmed) {
    return (
      <div className="min-h-screen bg-[#F5E6D8] py-8 pt-24 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-(--black) mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your transfer has been booked. Please have cash ready for payment.
            </p>
            <div className="bg-(--off-white)/80 border border-(--light-grey) rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Reference Number
              </p>
              <p className="text-xl font-bold text-(--accent-orange) font-mono">
                {cashBookingReference}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-(--light-grey) hover:bg-(--off-white) transition-colors"
              >
                Book Another Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5E6D8] py-8 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Step progress */}
        <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
                  <div
                    className={`
                      relative flex shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center
                      transition-all duration-300 ease-out
                      ${
                        currentStep > step.id
                          ? 'bg-(--accent-orange) text-white shadow-[0_2px_8px_rgba(241,90,34,0.25)]'
                          : currentStep === step.id
                            ? 'bg-(--primary-orange) text-white ring-2 ring-(--accent-orange) ring-offset-2 ring-offset-white shadow-[0_2px_12px_rgba(243,114,42,0.35)]'
                            : 'bg-(--light-grey) text-[#9ca3af]'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    ) : (
                      <step.icon
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        strokeWidth={currentStep === step.id ? 2.25 : 1.75}
                      />
                    )}
                  </div>
                  <span
                    className={`
                      ml-2 sm:ml-3 truncate hidden sm:inline font-semibold text-sm tracking-tight
                      ${
                        currentStep >= step.id
                          ? 'text-(--black)'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1.5 mx-2 sm:mx-4 rounded-full shrink min-w-[12px] sm:min-w-[24px]
                      transition-colors duration-300
                      ${currentStep > step.id ? 'bg-(--accent-orange)' : 'bg-(--light-grey)'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-6 sm:p-8">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight">
                    Select Your Route
                  </h2>
                  <TransferMapPicker
                    fromLocation={
                      formData.fromRegionId && formData.fromLat && formData.fromLng
                        ? {
                            lat: formData.fromLat,
                            lng: formData.fromLng,
                            regionId: formData.fromRegionId,
                            regionName: formData.fromRegionName,
                            isAirport: formData.fromIsAirport,
                          }
                        : null
                    }
                    toLocation={
                      formData.toRegionId && formData.toLat && formData.toLng
                        ? {
                            lat: formData.toLat,
                            lng: formData.toLng,
                            regionId: formData.toRegionId,
                            regionName: formData.toRegionName,
                            isAirport: formData.toIsAirport,
                          }
                        : null
                    }
                    onFromChange={(location) => {
                      if (location) {
                        setFormData((prev) => ({
                          ...prev,
                          fromRegionId: location.regionId,
                          fromRegionName: location.regionName,
                          fromLat: location.lat,
                          fromLng: location.lng,
                          fromIsAirport: location.isAirport,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          fromRegionId: null,
                          fromRegionName: '',
                          fromLat: null,
                          fromLng: null,
                          fromIsAirport: false,
                        }));
                      }
                    }}
                    onToChange={(location) => {
                      if (location) {
                        setFormData((prev) => ({
                          ...prev,
                          toRegionId: location.regionId,
                          toRegionName: location.regionName,
                          toLat: location.lat,
                          toLng: location.lng,
                          toIsAirport: location.isAirport,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          toRegionId: null,
                          toRegionName: '',
                          toLat: null,
                          toLng: null,
                          toIsAirport: false,
                        }));
                      }
                    }}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <Step2DateTime formData={formData} setFormData={setFormData} />
              )}

              {currentStep === 3 && (
                <Step3Vehicle
                  vehicleTypes={vehicleTypes}
                  formData={formData}
                  setFormData={setFormData}
                  isLoading={vehiclesLoading}
                />
              )}

              {currentStep === 4 && (
                <Step4Payment
                  formData={formData}
                  setFormData={setFormData}
                  previewData={previewData?.data}
                  isLoading={previewLoading}
                  previewError={previewIsError ? previewError : null}
                  onRetryPreview={refetchPreview}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-10 pt-6 border-t border-(--light-grey)">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 font-medium rounded-xl border border-(--light-grey) bg-white hover:bg-(--off-white) hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed || isProcessing}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) active:scale-[0.98] shadow-[0_2px_8px_rgba(243,114,42,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : currentStep === 4 ? (
                    <>
                      {paymentMethod === 'Cash' ? (
                        <>
                          <Banknote className="w-4 h-4" strokeWidth={2.5} />
                          Confirm Cash Booking
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" strokeWidth={2.5} />
                          Pay with Card
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-5 sm:p-6 sticky top-24 lg:top-28">
              <h3 className="text-base font-semibold text-(--black) tracking-tight mb-4">
                Transfer Summary
              </h3>

              {formData.fromRegionName && formData.toRegionName && (
                <div className="mb-4 pb-4 border-b border-(--light-grey)">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Route
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-(--black)">{formData.fromRegionName}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="font-medium text-(--black)">{formData.toRegionName}</span>
                  </div>
                </div>
              )}

              {formData.pickupDateTime && (
                <div className="mb-4 pb-4 border-b border-(--light-grey)">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Pickup
                  </p>
                  <p className="text-xs text-(--black) font-medium">
                    {new Date(formData.pickupDateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date(formData.pickupDateTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}

              {formData.vehicleTypeId && vehicleTypes.length > 0 && (
                <div className="mb-4 pb-4 border-b border-(--light-grey)">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Vehicle
                  </p>
                  <p className="text-xs text-(--black) font-medium">
                    {vehicleTypes.find((v) => v.id === formData.vehicleTypeId)?.title}
                  </p>
                </div>
              )}

              {previewData?.data && currentStep === 4 && (
                <div className="rounded-lg bg-(--off-white)/80 border border-(--light-grey) p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Total Amount</span>
                    <span className="text-base font-bold text-(--accent-orange) tabular-nums">
                      {previewData.data.total} {previewData.data.currency}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Date & Time
function Step2DateTime({
  formData,
  setFormData,
}: {
  formData: TransferFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransferFormData>>;
}) {
  const handleDateTimeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, pickupDateTime: value }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight">
        Select Pickup Date & Time
      </h2>

      <div className="max-w-md">
        <label htmlFor="pickupDateTime" className="block text-sm font-medium text-gray-600 mb-3">
          Pickup Date & Time
        </label>
        <DateTimePicker
          id="pickupDateTime"
          value={formData.pickupDateTime}
          onChange={handleDateTimeChange}
          placeholder="Select date and time"
          aria-label="Pickup date and time"
        />
        <p className="text-xs text-gray-500 mt-2">
          Please book at least 2 hours in advance
        </p>
      </div>

      {formData.pickupDateTime && (
        <div className="bg-(--off-white)/80 border border-(--light-grey) rounded-brand p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Selected Pickup
          </p>
          <p className="text-base font-semibold text-(--black)">
            {new Date(formData.pickupDateTime).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            at{' '}
            {new Date(formData.pickupDateTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

// Step 3: Vehicle Selection
function Step3Vehicle({
  vehicleTypes,
  formData,
  setFormData,
  isLoading,
}: {
  vehicleTypes: VehicleTypeDto[];
  formData: TransferFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransferFormData>>;
  isLoading: boolean;
}) {
  const handleVehicleSelect = (vehicleId: number) => {
    setFormData((prev) => ({ ...prev, vehicleTypeId: vehicleId }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-(--primary-orange)" />
        <p className="text-sm text-gray-500">Loading vehicles…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight">
        Choose Your Vehicle
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vehicleTypes.map((vehicle) => {
          const isSelected = formData.vehicleTypeId === vehicle.id;
          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => handleVehicleSelect(vehicle.id)}
              className={`
                relative flex flex-col gap-4 p-5 rounded-brand border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? 'border-(--primary-orange) bg-[rgba(243,114,42,0.06)] shadow-[0_0_0_1px_var(--primary-orange)]'
                    : 'border-(--light-grey) bg-white hover:border-[#d1d3d6] hover:shadow-soft'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex shrink-0 w-14 h-14 rounded-xl items-center justify-center
                    ${isSelected ? 'bg-(--primary-orange) text-white' : 'bg-(--light-grey) text-gray-500'}
                  `}
                >
                  <Car className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-(--black) text-base">{vehicle.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    <span className="text-sm text-gray-600">
                      Up to {vehicle.capacity} passengers
                    </span>
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-4 right-4 text-(--primary-orange)">
                  <Check className="w-6 h-6" strokeWidth={2.5} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {vehicleTypes.length === 0 && (
        <div className="rounded-brand border border-(--light-grey) bg-(--off-white)/50 py-12 px-6 text-center">
          <Car className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No vehicles available</p>
          <p className="text-sm text-gray-500 mt-1">Please contact support</p>
        </div>
      )}
    </div>
  );
}

// Step 4: Payment
function Step4Payment({
  formData,
  setFormData,
  previewData,
  isLoading,
  previewError,
  onRetryPreview,
  paymentMethod,
  setPaymentMethod,
}: {
  formData: TransferFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransferFormData>>;
  previewData: TransferPreviewData | undefined;
  isLoading: boolean;
  previewError: Error | null;
  onRetryPreview: () => void;
  paymentMethod: 'Cash' | 'CreditCard' | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<'Cash' | 'CreditCard' | null>>;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-(--primary-orange)" />
        <p className="text-sm text-gray-500">Calculating total…</p>
      </div>
    );
  }

  if (previewError) {
    const message = isApiError(previewError) ? previewError.message : 'Failed to load pricing.';
    return (
      <div className="rounded-brand border border-red-200 bg-red-50/80 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-red-900 text-sm">Preview unavailable</h3>
            <p className="text-red-700 text-sm mt-1">{message}</p>
            <button
              type="button"
              onClick={() => onRetryPreview()}
              className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 active:scale-95 transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight">
        Review & Payment
      </h2>

      {/* Transfer Summary */}
      <div className="rounded-brand border border-(--light-grey) bg-white divide-y divide-(--light-grey)">
        <div className="px-4 py-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Transfer Details
          </h3>
          {previewData?.transferLegs && previewData.transferLegs.length > 0 && (
            <div className="space-y-2">
              {previewData.transferLegs.map((leg, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-(--black)">{leg.fromRegionName}</span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium text-(--black)">{leg.toRegionName}</span>
                  <span className="ml-auto font-semibold text-(--black) tabular-nums">
                    {leg.price} {previewData.currency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Promo code */}
      <div>
        <label
          htmlFor="promoCode"
          className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
        >
          Promo Code <span className="text-gray-400 font-normal normal-case">(Optional)</span>
        </label>
        <input
          id="promoCode"
          type="text"
          value={formData.promoCode}
          onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
          placeholder="Enter code"
          className="w-full px-3.5 py-2.5 text-sm border border-(--light-grey) rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-orange) focus:border-(--primary-orange) transition-shadow"
        />
      </div>

      {/* Total breakdown */}
      <div className="rounded-brand border border-(--light-grey) bg-(--off-white)/80 p-4">
        {previewData ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Transfer subtotal</span>
              <span className="font-medium text-(--black) tabular-nums">
                {previewData.transferTotal} {previewData.currency}
              </span>
            </div>
            {previewData.extrasTotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Extras subtotal</span>
                <span className="font-medium text-(--black) tabular-nums">
                  {previewData.extrasTotal} {previewData.currency}
                </span>
              </div>
            )}
            {previewData.discountValue > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700 font-medium">Discount applied</span>
                <span className="font-semibold text-green-700 tabular-nums">
                  −{previewData.discountValue} {previewData.currency}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-(--light-grey)">
              <span className="text-base font-semibold text-(--black)">Total amount</span>
              <span className="text-xl font-bold text-(--accent-orange) tabular-nums">
                {previewData.total} {previewData.currency}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3 text-sm text-gray-500">
            Calculating…
          </div>
        )}
      </div>

      {/* Payment method selection */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">Choose Payment Method</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('Cash')}
            className={`
              relative flex items-center gap-3 p-4 rounded-brand border-2 text-left transition-all duration-200
              ${
                paymentMethod === 'Cash'
                  ? 'border-(--primary-orange) bg-[rgba(243,114,42,0.06)] shadow-[0_0_0_1px_var(--primary-orange)]'
                  : 'border-(--light-grey) bg-white hover:border-[#d1d3d6] hover:shadow-soft'
              }
            `}
          >
            <div
              className={`
                flex shrink-0 w-12 h-12 rounded-lg items-center justify-center
                ${paymentMethod === 'Cash' ? 'bg-(--primary-orange) text-white' : 'bg-(--light-grey) text-gray-500'}
              `}
            >
              <Banknote className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-(--black)">Cash</span>
              <p className="text-xs text-gray-600 mt-0.5">Pay driver directly</p>
            </div>
            {paymentMethod === 'Cash' && (
              <Check className="w-5 h-5 text-(--primary-orange) shrink-0" strokeWidth={2.5} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('CreditCard')}
            className={`
              relative flex items-center gap-3 p-4 rounded-brand border-2 text-left transition-all duration-200
              ${
                paymentMethod === 'CreditCard'
                  ? 'border-(--primary-orange) bg-[rgba(243,114,42,0.06)] shadow-[0_0_0_1px_var(--primary-orange)]'
                  : 'border-(--light-grey) bg-white hover:border-[#d1d3d6] hover:shadow-soft'
              }
            `}
          >
            <div
              className={`
                flex shrink-0 w-12 h-12 rounded-lg items-center justify-center
                ${paymentMethod === 'CreditCard' ? 'bg-(--primary-orange) text-white' : 'bg-(--light-grey) text-gray-500'}
              `}
            >
              <CreditCard className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-(--black)">Credit Card</span>
              <p className="text-xs text-gray-600 mt-0.5">Secure online payment</p>
            </div>
            {paymentMethod === 'CreditCard' && (
              <Check className="w-5 h-5 text-(--primary-orange) shrink-0" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
