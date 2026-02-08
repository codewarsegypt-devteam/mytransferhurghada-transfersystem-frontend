'use client';

import { Suspense, useState, useMemo, useRef, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  Users,
  ShoppingBag,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Check,
  Clock,
  MapPin,
  Minus,
  Plus,
  User,
  Baby
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPublicTripBySlug } from '@/lib/apis/tripsApi';
import { getTripExtras } from '@/lib/apis/extras';
import { previewTripBooking } from '@/lib/apis/bookingApi';
import { isApiError } from '@/lib/apis/apiErrors';
import type { TripSlotDto, PublicTripDto } from '@/lib/types/tripsTypes';
import type { TripExtraDto } from '@/lib/types/extrasTypes';
import type { ExtraItemRequest, BookingPreviewData } from '@/lib/types/bookingTypes';

// Step configuration
const STEPS = [
  { id: 1, name: 'Date & Time', icon: Calendar },
  { id: 2, name: 'Participants', icon: Users },
  { id: 3, name: 'Extras', icon: ShoppingBag },
  { id: 4, name: 'Review', icon: CreditCard },
];

type BookingFormData = {
  bookingType: 'trip';
  tripSlotId: number | null;
  date: string;
  adults: number;
  children: number;
  enfants: number;
  extras: ExtraItemRequest[];
  promoCode: string;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripSlug = searchParams.get('trip') ?? searchParams.get('slug');

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<TripSlotDto | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    bookingType: 'trip',
    tripSlotId: null,
    date: '',
    adults: 1,
    children: 0,
    enfants: 0,
    extras: [],
    promoCode: '',
  });

  // Fetch trip details
  const { data: tripData, isLoading: tripLoading, error: tripError } = useQuery({
    queryKey: ['trip', tripSlug],
    queryFn: () => getPublicTripBySlug(tripSlug!),
    enabled: !!tripSlug,
  });

  const trip: PublicTripDto | undefined = tripData?.data;

  // Fetch extras
  const { data: extrasData, isLoading: extrasLoading } = useQuery({
    queryKey: ['extras', trip?.id],
    queryFn: () => getTripExtras(trip!.id),
    enabled: !!trip?.id,
  });

  const extras: TripExtraDto[] = extrasData?.data || [];

  // Preview booking (manual trigger on step 3→4 and before payment)
  const {
    data: previewData,
    isLoading: previewLoading,
    isError: previewIsError,
    error: previewError,
    refetch: refetchPreview,
  } = useQuery({
    queryKey: ['preview', formData],
    queryFn: () => previewTripBooking({
      tripSlotId: formData.tripSlotId!,
      date: formData.date,
      // date: "2026-02-04",
      adults: formData.adults,
      children: formData.children,
      enfants: formData.enfants,
      extras: formData.extras,
      promoCode: formData.promoCode,
    }),
    enabled: false, // Manual trigger
  });

  // When user clicks "Apply" for promo, we update formData then refetch after state has committed
  const promoJustAppliedRef = useRef(false);
  const onPromoApplyDoneRef = useRef<(() => void) | null>(null);
  const applyPromoCodeAndRefetch = useCallback((promoCode: string, onDone?: () => void) => {
    onPromoApplyDoneRef.current = onDone ?? null;
    promoJustAppliedRef.current = true;
    setFormData((prev) => ({ ...prev, promoCode: promoCode.trim() }));
  }, []);
  useEffect(() => {
    if (promoJustAppliedRef.current) {
      promoJustAppliedRef.current = false;
      refetchPreview().then(() => {
        onPromoApplyDoneRef.current?.();
        onPromoApplyDoneRef.current = null;
      });
    }
  }, [formData.promoCode, refetchPreview]);

  // Calculate available dates for selected slot
  const availableDates = useMemo(() => {
    if (!selectedSlot || !trip) return [];

    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get next 90 days
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Check if this date matches the selected slot's day
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (dayName === selectedSlot.day) {
        dates.push(date);
      }
    }

    return dates;
  }, [selectedSlot, trip]);

  // Validation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: {
        const hasSlot = formData.tripSlotId != null || selectedSlot != null;
        const hasDate = Boolean(formData.date?.trim());
        console.log('hasSlot', hasSlot, formData.tripSlotId);
        console.log('hasDate', hasDate, formData.date);
        return hasSlot && hasDate;
      }
      case 2:
        const totalParticipants = formData.adults + formData.children + formData.enfants;
        return totalParticipants > 0 && totalParticipants <= (selectedSlot?.capacity || 0);
      case 3:
        return true; // Extras are optional
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData, selectedSlot]);

  const handleNext = async () => {
    if (currentStep === 4) {
      const result = await refetchPreview();
      if (result.isError) return; // Don't proceed to payment on preview error
      handlePayment();
    } else {
      if (currentStep === 3) {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        const result = await refetchPreview();
        if (result.isError) return; // Don't advance to review on preview error
      }
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePayment = async () => {
    try {
      console.log('Starting payment flow with form data:', formData);

      // Step 1: Prepare the booking (store securely on server)
      const prepareResponse = await fetch('/api/booking/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Prepare response status:', prepareResponse.status, prepareResponse.ok);

      if (!prepareResponse.ok) {
        const error = await prepareResponse.json();
        console.error('Failed to prepare booking:', error);
        alert(error.message || 'Failed to prepare booking. Please try again.');
        return;
      }

      const prepareResult = await prepareResponse.json();
      console.log('Prepare result:', prepareResult);
      const { bookingId } = prepareResult;

      if (!bookingId) {
        console.error('No booking ID returned from prepare result:', prepareResult);
        alert('Failed to prepare booking. Please try again.');
        return;
      }

      console.log('Booking ID received:', bookingId);

      // Step 2: Create payment with the secure booking ID
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, redirectUrl: "/payment/callback" }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        console.error('Failed to create payment:', error);
        alert(error.message || 'Failed to create payment. Please try again.');
        return;
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Redirect to Kashier payment page
        window.location.href = paymentResult.paymentUrl;
      } else {
        console.error('Invalid payment response:', paymentResult);
        alert('Failed to create payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Loading state
  if (tripLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[--primary-orange] mx-auto mb-4" />
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (tripError || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t find the trip you&apos;re looking for.</p>
          <button
            onClick={() => router.push('/trips')}
            className="px-6 py-3 bg-[--primary-orange] text-white rounded-lg hover:bg-[--accent-orange] transition-colors"
          >
            Browse All Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5E6D8] py-8 pt-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Step progress – Fox Travel identity */}
        <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
                  <div
                    className={`
                      relative flex shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center
                      transition-all duration-300 ease-out
                      ${currentStep > step.id
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
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={currentStep === step.id ? 2.25 : 1.75} />
                    )}
                  </div>
                  <span
                    className={`
                      ml-2 sm:ml-3 truncate hidden sm:inline font-semibold text-sm tracking-tight
                      ${currentStep > step.id
                        ? 'text-(--black)'
                        : currentStep === step.id
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
          {/* Main Content – on-brand card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-6 sm:p-8">
              {currentStep === 1 && (
                <Step1SlotAndDate
                  trip={trip}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  formData={formData}
                  setFormData={setFormData}
                  availableDates={availableDates}
                />
              )}

              {currentStep === 2 && (
                <Step2Participants
                  formData={formData}
                  setFormData={setFormData}
                  selectedSlot={selectedSlot}
                />
              )}

              {currentStep === 3 && (
                <Step3Extras
                  extras={extras}
                  formData={formData}
                  setFormData={setFormData}
                  isLoading={extrasLoading}
                />
              )}

              {currentStep === 4 && (
                <Step4Review
                  trip={trip}
                  selectedSlot={selectedSlot}
                  formData={formData}
                  previewData={previewData?.data ?? undefined}
                  isLoading={previewLoading}
                  previewError={previewIsError ? previewError : null}
                  onRetryPreview={refetchPreview}
                  onApplyPromoCode={applyPromoCodeAndRefetch}
                />
              )}

              {/* Navigation – modern, on-brand buttons */}
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
                  disabled={!canProceed}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-(--primary-orange) text-white font-semibold rounded-xl hover:bg-(--accent-orange) active:scale-[0.98] shadow-[0_2px_8px_rgba(243,114,42,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {currentStep === 4 ? (
                    <>
                      <CreditCard className="w-4 h-4" strokeWidth={2.5} />
                      Proceed to Payment
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

          {/* Sidebar – compact, modern summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-brand border border-(--light-grey) shadow-soft p-5 sm:p-6 sticky top-24 lg:top-28">
              <h3 className="text-base font-semibold text-(--black) tracking-tight mb-4">
                Booking Summary
              </h3>

              {trip.images[0] && (
                <div className="relative w-full h-36 mb-4 rounded-xl overflow-hidden ring-1 ring-(--light-grey)">
                  <Image
                    src={trip.images.find(img => img.isCoverImage)?.imageURL || trip.images[0].imageURL}
                    alt={trip.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h4 className="font-semibold text-(--black) text-sm mb-3">{trip.title}</h4>

              <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-4 border-b border-(--light-grey)">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                  <span>{trip.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                  <span>{trip.durationHours}h</span>
                </div>
              </div>

              {selectedSlot && formData.date && (
                <div className="mb-4 pb-4 border-b border-(--light-grey)">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Selected Schedule
                  </p>
                  <p className="text-xs text-(--black) font-medium">{selectedSlot.day} at {selectedSlot.startsAt}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}

              {(formData.adults > 0 || formData.children > 0 || formData.enfants > 0) && (
                <div className="mb-4 pb-4 border-b border-(--light-grey)">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2.5">
                    Participants
                  </p>
                  <div className="space-y-1.5">
                    {formData.adults > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">Adults <span className="text-gray-500">× {formData.adults}</span></span>
                        <span className="font-semibold text-(--black) tabular-nums">
                          {formData.adults * trip.price.adult} {trip.price.currency.currencyCode}
                        </span>
                      </div>
                    )}
                    {formData.children > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">Children <span className="text-gray-500">× {formData.children}</span></span>
                        <span className="font-semibold text-(--black) tabular-nums">
                          {formData.children * trip.price.child} {trip.price.currency.currencyCode}
                        </span>
                      </div>
                    )}
                    {formData.enfants > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">Infants <span className="text-gray-500">× {formData.enfants}</span></span>
                        <span className="font-semibold text-(--black) tabular-nums">
                          {formData.enfants * trip.price.enfant} {trip.price.currency.currencyCode}
                        </span>
                      </div>
                    )}
                  </div>
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

// Step 1: Slot and Date Selection
function Step1SlotAndDate({
  trip,
  selectedSlot,
  setSelectedSlot,
  formData,
  setFormData,
  availableDates,
}: {
  trip: PublicTripDto;
  selectedSlot: TripSlotDto | null;
  setSelectedSlot: (slot: TripSlotDto) => void;
  formData: BookingFormData;
  setFormData: Dispatch<SetStateAction<BookingFormData>>;
  availableDates: Date[];
}) {
  const handleSlotSelect = (slot: TripSlotDto) => {
    setSelectedSlot(slot);
    setFormData((prev) => ({ ...prev, tripSlotId: slot.id, date: '' })); // Reset date when slot changes
  };

  // Format date as YYYY-MM-DD in local time (toISOString() would shift to UTC and can change the calendar day)
  const formatDateLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({ ...prev, date: formatDateLocal(date) }));
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight">
        Select Date & Time
      </h2>

      {/* Time slot selection – card style, on-brand */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-4">
          Choose a time slot
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trip.tripSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSlotSelect(slot)}
                className={`
                  relative flex items-center gap-4 p-4 sm:p-5 rounded-brand border-2 text-left
                  transition-all duration-200 ease-out
                  ${isSelected
                    ? 'border-(--primary-orange) bg-[rgba(243,114,42,0.06)] shadow-[0_0_0_1px_var(--primary-orange)]'
                    : 'border-(--light-grey) bg-white hover:border-[#d1d3d6] hover:shadow-soft'
                  }
                `}
              >
                <div
                  className={`
                    flex shrink-0 w-12 h-12 rounded-xl items-center justify-center
                    ${isSelected ? 'bg-(--primary-orange) text-white' : 'bg-(--light-grey) text-gray-500'}
                  `}
                >
                  <Clock className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-(--black)">{slot.day}</span>
                    <span
                      className={`
                        text-xs font-medium px-2 py-0.5 rounded-md shrink-0
                        ${isSelected ? 'bg-(--primary-orange)/10 text-(--accent-orange)' : 'bg-(--light-grey) text-gray-600'}
                      `}
                    >
                      {slot.capacity} seats
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Starts at <span className="font-medium text-gray-800">{slot.startsAt}</span>
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 text-(--primary-orange)">
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date picker – minimal strip, only when slot chosen */}
      {selectedSlot && (
        <div className="pt-2 border-t border-(--light-grey)">
          <p className="text-sm font-medium text-gray-600 mb-3">
            Pick a date <span className="text-gray-400 font-normal">({selectedSlot.day}s only)</span>
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-72 overflow-y-auto overscroll-contain py-1 -mx-1 px-1">
            {availableDates.map((date) => {
              const dateString = formatDateLocal(date);
              const isSelected = formData.date === dateString;

              return (
                <button
                  key={dateString}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className={`
                    flex flex-col items-center justify-center min-h-17 py-2.5 px-2 rounded-xl
                    border transition-all duration-200 ease-out
                    ${isSelected
                      ? 'border-(--primary-orange) bg-(--primary-orange) text-white shadow-[0_2px_8px_rgba(243,114,42,0.25)]'
                      : 'border-(--light-grey) bg-white text-(--black) hover:border-gray-300 hover:bg-(--off-white)'
                    }
                  `}
                >
                  <span
                    className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-gray-500'}`}
                  >
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className={`text-lg sm:text-xl font-bold mt-0.5 tabular-nums ${isSelected ? 'text-white' : 'text-(--black)'}`}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2: Participants – custom counter, on-brand
function Step2Participants({
  formData,
  setFormData,
  selectedSlot,
}: {
  formData: BookingFormData;
  setFormData: Dispatch<SetStateAction<BookingFormData>>;
  selectedSlot: TripSlotDto | null;
}) {
  const totalParticipants = formData.adults + formData.children + formData.enfants;
  const capacity = selectedSlot?.capacity || 0;
  const remainingSeats = capacity - totalParticipants;

  const updateCount = (field: 'adults' | 'children' | 'enfants', delta: number) => {
    const newValue = Math.max(0, formData[field] + delta);
    const newTotal = totalParticipants - formData[field] + newValue;

    if (newTotal <= capacity) {
      setFormData({ ...formData, [field]: newValue });
    }
  };

  type ParticipantRow = {
    field: 'adults' | 'children' | 'enfants';
    label: string;
    ageRange: string;
    value: number;
    icon: typeof User;
  };

  const rows: ParticipantRow[] = [
    { field: 'adults', label: 'Adults', ageRange: 'Age 13+', value: formData.adults, icon: Users },
    { field: 'children', label: 'Children', ageRange: 'Age 6–12', value: formData.children, icon: User },
    { field: 'enfants', label: 'Infants', ageRange: 'Age 0–5', value: formData.enfants, icon: Baby },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight mb-1">
          Number of Participants
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
            Available seats
          </span>
          <span
            className={`
              inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-lg text-sm font-semibold tabular-nums
              ${remainingSeats > 0
                ? 'bg-(--primary-orange)/10 text-(--accent-orange)'
                : 'bg-(--light-grey) text-gray-500'
              }
            `}
          >
            {remainingSeats} / {capacity}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(({ field, label, ageRange, value, icon: Icon }) => {
          const canDecrement = value > 0;
          const canIncrement = totalParticipants < capacity;

          return (
            <div
              key={field}
              className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-brand border border-(--light-grey) bg-white transition-shadow hover:shadow-soft"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex shrink-0 w-11 h-11 rounded-xl bg-(--light-grey) items-center justify-center text-gray-600">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-semibold text-(--black)">{label}</h4>
                  <p className="text-sm text-gray-500">{ageRange}</p>
                </div>
              </div>

              <div className="flex items-center shrink-0 rounded-xl border border-(--light-grey) bg-(--off-white)/50 p-0.5">
                <button
                  type="button"
                  onClick={() => updateCount(field, -1)}
                  disabled={!canDecrement}
                  className={`
                    flex w-10 h-10 rounded-lg items-center justify-center transition-all duration-200
                    ${canDecrement
                      ? 'text-(--accent-orange) hover:bg-(--primary-orange) hover:text-white active:scale-95'
                      : 'text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <Minus className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span className="min-w-9 text-center font-bold text-(--black) text-lg tabular-nums">
                  {value}
                </span>
                <button
                  type="button"
                  onClick={() => updateCount(field, 1)}
                  disabled={!canIncrement}
                  className={`
                    flex w-10 h-10 rounded-lg items-center justify-center transition-all duration-200
                    ${canIncrement
                      ? 'text-(--accent-orange) hover:bg-(--primary-orange) hover:text-white active:scale-95'
                      : 'text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalParticipants === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-brand border border-amber-200 bg-amber-50/80">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            Please select at least one participant to continue.
          </p>
        </div>
      )}
    </div>
  );
}

// Step 3: Extras – on-brand cards, custom counter & checkbox
function Step3Extras({
  extras,
  formData,
  setFormData,
  isLoading,
}: {
  extras: TripExtraDto[];
  formData: BookingFormData;
  setFormData: Dispatch<SetStateAction<BookingFormData>>;
  isLoading: boolean;
}) {
  const updateExtra = (extraId: number, quantity: number) => {
    const existingExtras = formData.extras.filter(e => e.extraId !== extraId);

    if (quantity > 0) {
      setFormData({
        ...formData,
        extras: [...existingExtras, { extraId, quantity }],
      });
    } else {
      setFormData({ ...formData, extras: existingExtras });
    }
  };

  const getExtraQuantity = (extraId: number) => {
    return formData.extras.find(e => e.extraId === extraId)?.quantity || 0;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-(--primary-orange)" />
        <p className="text-sm text-gray-500">Loading extras…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-(--black) tracking-tight mb-1">
          Add Extras
        </h2>
        <p className="text-sm text-gray-600">Enhance your experience (optional)</p>
      </div>

      {extras.length === 0 ? (
        <div className="rounded-brand border border-(--light-grey) bg-(--off-white)/50 py-12 px-6 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No extras for this trip</p>
          <p className="text-sm text-gray-500 mt-1">You can continue to review</p>
        </div>
      ) : (
        <div className="space-y-3">
          {extras.map((extra) => {
            const quantity = getExtraQuantity(extra.id);
            const isPerBooking = extra.extraChargeType === 'PerBooking';

            return (
              <div
                key={extra.id}
                className={`
                  flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-brand border bg-white
                  transition-all duration-200
                  ${quantity > 0
                    ? 'border-(--primary-orange) shadow-[0_0_0_1px_var(--primary-orange)] bg-[rgba(243,114,42,0.03)]'
                    : 'border-(--light-grey) hover:shadow-soft hover:border-[#d1d3d6]'
                  }
                `}
              >
                <div className="flex gap-4 min-w-0 flex-1">
                  <div
                    className={`
                      flex shrink-0 w-11 h-11 rounded-xl items-center justify-center
                      ${quantity > 0 ? 'bg-(--primary-orange) text-white' : 'bg-(--light-grey) text-gray-500'}
                    `}
                  >
                    <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-(--black)">{extra.title}</h3>
                    {extra.description && (
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{extra.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-base font-bold text-(--accent-orange)">
                        {extra.price.amount} {extra.price.currency}
                      </span>
                      <span
                        className={`
                          text-xs font-medium px-2 py-0.5 rounded-md
                          ${quantity > 0
                            ? 'bg-(--primary-orange)/15 text-(--accent-orange)'
                            : 'bg-(--light-grey) text-gray-600'
                          }
                        `}
                      >
                        {isPerBooking ? 'Per booking' : 'Per person'}
                      </span>
                    </div>
                  </div>
                </div>

                {isPerBooking ? (
                  <button
                    type="button"
                    onClick={() => updateExtra(extra.id, quantity > 0 ? 0 : 1)}
                    className={`
                      flex shrink-0 items-center justify-center gap-2 sm:w-auto w-full min-h-12 px-5 rounded-xl border-2 transition-all duration-200
                      ${quantity > 0
                        ? 'border-(--primary-orange) bg-(--primary-orange) text-white'
                        : 'border-(--light-grey) bg-white text-gray-600 hover:border-(--primary-orange) hover:text-(--accent-orange)'
                      }
                    `}
                  >
                    {quantity > 0 ? (
                      <>
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                        <span className="font-semibold">Added</span>
                      </>
                    ) : (
                      <span className="font-semibold">Add</span>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center shrink-0 rounded-xl border border-(--light-grey) bg-(--off-white)/50 p-0.5">
                    <button
                      type="button"
                      onClick={() => updateExtra(extra.id, quantity - 1)}
                      disabled={quantity === 0}
                      className={`
                        flex w-10 h-10 rounded-lg items-center justify-center transition-all duration-200
                        ${quantity > 0
                          ? 'text-(--accent-orange) hover:bg-(--primary-orange) hover:text-white active:scale-95'
                          : 'text-gray-300 cursor-not-allowed'
                        }
                      `}
                    >
                      <Minus className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <span className="min-w-9 text-center font-bold text-(--black) text-lg tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateExtra(extra.id, quantity + 1)}
                      className="flex w-10 h-10 rounded-lg items-center justify-center text-(--accent-orange) hover:bg-(--primary-orange) hover:text-white active:scale-95 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Step 4: Review – compact, on-brand, invoice-style
function Step4Review({
  trip,
  selectedSlot,
  formData,
  previewData,
  isLoading,
  previewError,
  onRetryPreview,
  onApplyPromoCode,
}: {
  trip: PublicTripDto;
  selectedSlot: TripSlotDto | null;
  formData: BookingFormData;
  previewData: BookingPreviewData | undefined;
  isLoading: boolean;
  previewError: Error | null;
  onRetryPreview: () => void;
  onApplyPromoCode: (promoCode: string, onDone?: () => void) => void;
}) {
  // Local state for promo code input (not applied yet)
  const [promoCodeInput, setPromoCodeInput] = useState(formData.promoCode || '');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromoCode = () => {
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);
    onApplyPromoCode(promoCodeInput.trim(), () => setIsApplyingPromo(false));
  };
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-(--primary-orange)" />
        <p className="text-sm text-gray-500">Calculating total…</p>
      </div>
    );
  }

  if (previewError) {
    const message = isApiError(previewError) ? previewError.message : 'Failed to load booking preview.';
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
        Review Your Booking
      </h2>

      {/* Booking summary – compact, invoice-style */}
      <div className="rounded-brand border border-(--light-grey) bg-white divide-y divide-(--light-grey)">
        {/* Date & Time */}
        <div className="px-4 py-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Date & Time</h3>
          <p className="text-sm font-medium text-(--black)">
            {selectedSlot?.day}, {new Date(formData.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">Starts at {selectedSlot?.startsAt}</p>
        </div>

        {/* Participants */}
        <div className="px-4 py-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">Participants</h3>
          <div className="space-y-1.5">
            {formData.adults > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Adults <span className="text-gray-500">× {formData.adults}</span></span>
                <span className="font-semibold text-(--black) tabular-nums">
                  {previewData?.tripPriceAdult || (formData.adults * trip.price.adult)} {trip.price.currency.currencyCode}
                </span>
              </div>
            )}
            {formData.children > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Children <span className="text-gray-500">× {formData.children}</span></span>
                <span className="font-semibold text-(--black) tabular-nums">
                  {previewData?.tripPriceChild || (formData.children * trip.price.child)} {trip.price.currency.currencyCode}
                </span>
              </div>
            )}
            {formData.enfants > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Infants <span className="text-gray-500">× {formData.enfants}</span></span>
                <span className="font-semibold text-(--black) tabular-nums">
                  {previewData?.tripPriceEnfant || (formData.enfants * trip.price.enfant)} {trip.price.currency.currencyCode}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Extras */}
        {previewData?.extras && previewData.extras.length > 0 && (
          <div className="px-4 py-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">Extras</h3>
            <div className="space-y-1.5">
              {previewData.extras.map((extra) => (
                <div key={extra.extraId} className="flex items-start justify-between text-sm gap-2">
                  <div className="min-w-0">
                    <span className="text-gray-700 wrap-break-word">{extra.title}</span>
                    {extra.quantity > 1 && (
                      <span className="text-gray-500"> × {extra.quantity}</span>
                    )}
                    <span className="text-[10px] uppercase text-gray-400 ml-1.5">
                      ({extra.extraChargeType === 'PerBooking' ? 'Per booking' : 'Per person'})
                    </span>
                  </div>
                  <span className="font-semibold text-(--black) shrink-0 tabular-nums">{extra.totalPrice} {previewData.currency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Promo code – modern, compact input with Apply button */}
      <div>
        <label htmlFor="promoCode" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Promo Code <span className="text-gray-400 font-normal normal-case">(Optional)</span>
        </label>
        <div className="flex gap-2">
          <input
            id="promoCode"
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            placeholder="Enter code"
            className="flex-1 px-3.5 py-2.5 text-sm border border-(--light-grey) rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-orange) focus:border-(--primary-orange) transition-shadow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && promoCodeInput.trim()) {
                handleApplyPromoCode();
              }
            }}
          />
          <button
            type="button"
            onClick={handleApplyPromoCode}
            disabled={!promoCodeInput.trim() || isApplyingPromo || isLoading}
            className="px-6 py-2.5 text-sm font-semibold bg-(--primary-orange) text-white rounded-lg hover:bg-(--accent-orange) active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center min-w-[80px]"
          >
            {isApplyingPromo ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </div>

      {/* Total breakdown – polished card */}
      <div className="rounded-brand border border-(--light-grey) bg-(--off-white)/80 p-4">
        {previewData ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trip subtotal</span>
              <span className="font-medium text-(--black) tabular-nums">{previewData.tripTotal} {previewData.currency}</span>
            </div>
            {previewData.extrasTotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Extras subtotal</span>
                <span className="font-medium text-(--black) tabular-nums">{previewData.extrasTotal} {previewData.currency}</span>
              </div>
            )}
            {previewData.discountValue > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700 font-medium">Discount applied</span>
                <span className="font-semibold text-green-700 tabular-nums">−{previewData.discountValue} {previewData.currency}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-(--light-grey)">
              <span className="text-base font-semibold text-(--black)">Total amount</span>
              <span className="text-xl font-bold text-(--accent-orange) tabular-nums">{previewData.total} {previewData.currency}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3 text-sm text-gray-500">
            Calculating…
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6]">
          <Loader2 className="w-12 h-12 animate-spin text-[--primary-orange]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}