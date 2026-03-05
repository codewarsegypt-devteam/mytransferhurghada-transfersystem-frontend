"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Contact from "@/components/Contact";
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
  Plus,
  Minus,
  Tag,
  Package,
  ShoppingBag,
  User,
  Phone,
  ShoppingCartIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DateTimePicker from "@/components/ui/DateTimePicker";
import {
  getVehicleTypes,
  previewTransferBooking,
} from "@/lib/apis/transferApi";
import { getTripExtras } from '@/lib/apis/extras';

import { isApiError } from "@/lib/apis/apiErrors";
import type {
  VehicleTypeDto,
  TransferLegRequest,
  ExtraItemRequest,
  TransferPreviewData,
  ExtraDto,
} from "@/lib/types/bookingTypes";
import PageBanner from "@/components/pageBanner";
import type { TripExtraDto } from "@/lib/types/extrasTypes";
import { SignInButton, useAuth } from "@clerk/nextjs";
import ContactUsPage from "../(home)/contactus/page";

// Dynamic import for map component (client-only, no SSR)
const TransferMapPicker = dynamic(
  () => import("@/components/TransferMapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16 bg-(--off-white)/50 rounded-brand border border-(--light-grey)">
        <Loader2 className="w-8 h-8 animate-spin text-(--primary-orange)" />
      </div>
    ),
  },
);

// Step configuration
const STEPS = [
  { id: 1, name: "Route", icon: MapPin },
  { id: 2, name: "Date & Time", icon: Calendar },
  { id: 3, name: "Vehicle", icon: Car },
  { id: 4, name: "Payment", icon: CreditCard },
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
  name: string;
  phoneNumber: string;
  roomNumber: string;
  flightNumber: string;
};

function TransferBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "CreditCard" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [cashBookingConfirmed, setCashBookingConfirmed] = useState(false);
  const [cashBookingReference, setCashBookingReference] = useState<string>("");
  const [formData, setFormData] = useState<TransferFormData>({
    fromRegionId: null,
    fromRegionName: "",
    fromLat: null,
    fromLng: null,
    fromIsAirport: false,
    toRegionId: null,
    toRegionName: "",
    toLat: null,
    toLng: null,
    toIsAirport: false,
    pickupDateTime: "",
    vehicleTypeId: null,
    extras: [],
    promoCode: "",
    name: "",
    phoneNumber: "",
    roomNumber: "",
    flightNumber: "",
  });

  // Prefill from hero form (URL params from GetRegionIdByCoordinates)
  useEffect(() => {
    const fromRegionId = searchParams.get("fromRegionId");
    const toRegionId = searchParams.get("toRegionId");
    if (!fromRegionId || !toRegionId) return;
    setFormData((prev) => ({
      ...prev,
      fromRegionId: Number(fromRegionId) || null,
      fromRegionName: searchParams.get("fromRegionName") ?? prev.fromRegionName,
      fromLat: searchParams.get("fromLat")
        ? Number(searchParams.get("fromLat"))
        : null,
      fromLng: searchParams.get("fromLng")
        ? Number(searchParams.get("fromLng"))
        : null,
      fromIsAirport: searchParams.get("fromIsAirport") === "true",
      toRegionId: Number(toRegionId) || null,
      toRegionName: searchParams.get("toRegionName") ?? prev.toRegionName,
      toLat: searchParams.get("toLat")
        ? Number(searchParams.get("toLat"))
        : null,
      toLng: searchParams.get("toLng")
        ? Number(searchParams.get("toLng"))
        : null,
      toIsAirport: searchParams.get("toIsAirport") === "true",
      pickupDateTime: searchParams.get("date")
        ? `${searchParams.get("date")}T12:00:00`
        : prev.pickupDateTime,
    }));
  }, [searchParams]);

  // Fetch vehicle types
  const { data: vehicleTypesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () => getVehicleTypes(),
  });

  // Fetch extras (GET /api/Extra) for transfer
  const { data: extrasData, isLoading: extrasLoading } = useQuery({
    queryKey: ["extras"],
    queryFn: () => getTripExtras(1),
  });
  // console.log(extrasData?.data.data);
  const vehicleTypes: VehicleTypeDto[] = vehicleTypesData?.data?.data || [];
  const extrasOptions: TripExtraDto[] = extrasData?.data ?? [];
  console.log(extrasOptions);
  // Preview transfer booking
  const {
    data: previewData,
    isLoading: previewLoading,
    isError: previewIsError,
    error: previewError,
    refetch: refetchPreview,
  } = useQuery({
    queryKey: ["transferPreview", formData],
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
        return (
          paymentMethod != null &&
          formData.name.trim() !== "" &&
          formData.phoneNumber.trim() !== ""
        );
      default:
        return false;
    }
  }, [currentStep, formData, paymentMethod]);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Handle payment
      if (paymentMethod === "Cash") {
        await handleCashPayment();
      } else {
        await handleCreditCardPayment();
      }
    } else {
      try {
        setIsNextLoading(true);
        if (currentStep === 3) {
          // Fetch preview before going to payment step
          await refetchPreview();
        }
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      } finally {
        setIsNextLoading(false);
      }
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
      const response = await fetch("/api/transfer/booking/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleTypeId: formData.vehicleTypeId,
          legs: [leg],
          extras: formData.extras,
          promoCode: formData.promoCode,
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          roomNumber: formData.roomNumber.trim() || undefined,
          flightNumber: formData.flightNumber.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to create booking. Please try again.");
        return;
      }

      const result = await response.json();
      setCashBookingReference(result.bookingId || "N/A");
      setCashBookingConfirmed(true);
    } catch (error) {
      console.error("Cash payment error:", error);
      alert("An unexpected error occurred. Please try again.");
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
      const prepareResponse = await fetch("/api/booking/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: "transfer",
          vehicleTypeId: formData.vehicleTypeId,
          legs: [leg],
          extras: formData.extras,
          promoCode: formData.promoCode,
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          roomNumber: formData.roomNumber.trim() || undefined,
          flightNumber: formData.flightNumber.trim() || undefined,
        }),
      });

      if (!prepareResponse.ok) {
        const error = await prepareResponse.json();
        alert(error.message || "Failed to prepare booking. Please try again.");
        return;
      }

      const prepareResult = await prepareResponse.json();
      const { bookingId } = prepareResult;

      if (!bookingId) {
        alert("Failed to prepare booking. Please try again.");
        return;
      }

      // Step 2: Create payment
      const paymentResponse = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, redirectUrl: "/transfer/callback" }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        alert(error.message || "Failed to create payment. Please try again.");
        return;
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Redirect to Kashier payment page
        window.location.href = paymentResult.paymentUrl;
      } else {
        alert("Failed to create payment. Please try again.");
      }
    } catch (error) {
      console.error("Credit card payment error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  
  // If cash booking confirmed, show confirmation — luxury success screen
  if (cashBookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/90 via-white to-amber-50/70 py-8 pt-24 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-emerald-200/60 shadow-2xl shadow-slate-300/20 p-8 sm:p-10 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400" aria-hidden />
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2
                  className="w-14 h-14 text-white"
                  strokeWidth={2}
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-slate-600 mb-6">
              Your transfer has been booked. Please have cash ready for payment.
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60 rounded-2xl p-5 mb-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700/80 mb-1">
                Reference Number
              </p>
              <p className="text-2xl font-bold text-(--accent-orange) font-mono tracking-wide">
                {cashBookingReference}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-(--primary-orange) to-amber-500 text-white font-semibold rounded-2xl hover:from-(--accent-orange) hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all"
              >
                Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all"
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
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/50 to-white pb-10">
      {/* Decorative top gradient strip */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-(--primary-orange) to-amber-500" aria-hidden />
      <PageBanner
        subtitle="Transfer Booking"
        title="Book Your Transfer"
        description="Book your transfer with us and enjoy a smooth and comfortable journey to your destination."
        searchQuery={""}
        setSearchQuery={() => {}}
        placeholder="Search for a trip"
        searchBar={false}
        bgImageUrl="/assets/transfer.png"
        bgImageAlt="Transfer Image"
        bgOverlay={true}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-15 relative">
        {/* Step progress — luxury pill card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg shadow-amber-900/5 p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
                  <div
                    className={`
                      relative flex shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full items-center justify-center
                      transition-all duration-300 ease-out
                      ${
                        currentStep > step.id
                          ? "bg-gradient-to-br from-amber-500 to-(--accent-orange) text-white shadow-lg shadow-amber-500/30"
                          : currentStep === step.id
                            ? "bg-gradient-to-br from-(--primary-orange) to-amber-600 text-white ring-4 ring-amber-300/50 ring-offset-2 ring-offset-amber-50 shadow-xl shadow-orange-500/25"
                            : "bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <step.icon
                        className="w-6 h-6"
                        strokeWidth={currentStep === step.id ? 2.25 : 1.75}
                      />
                    )}
                  </div>
                  <span
                    className={`
                      ml-2 sm:ml-3 truncate hidden sm:inline font-semibold text-sm tracking-tight
                      ${
                        currentStep >= step.id
                          ? "text-slate-800"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1.5 mx-2 sm:mx-4 rounded-full shrink min-w-[12px] sm:min-w-[24px] transition-colors duration-300
                      ${currentStep > step.id ? "bg-gradient-to-r from-amber-400 to-(--primary-orange)" : "bg-slate-200"}
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    Select Your Route
                  </h2>
                  <TransferMapPicker
                    fromLocation={
                      formData.fromRegionId &&
                      formData.fromLat &&
                      formData.fromLng
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
                          fromRegionName: "",
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
                          toRegionName: "",
                          toLat: null,
                          toLng: null,
                          toIsAirport: false,
                        }));
                      }
                    }}
                  />
                </div>
              )}

              {currentStep === 2 && isSignedIn && isAuthLoaded && (
                <Step2DateTime formData={formData} setFormData={setFormData} />
              )}

              {currentStep === 3 && isSignedIn && isAuthLoaded && (
                <Step3Vehicle
                  vehicleTypes={vehicleTypes}
                  extrasOptions={extrasOptions}
                  extrasLoading={extrasLoading}
                  formData={formData}
                  setFormData={setFormData}
                  isLoading={vehiclesLoading}
                />
              )}

              {currentStep === 4 && isSignedIn && isAuthLoaded && (
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-10 pt-6 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-slate-700 font-semibold rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                  Back
                </button>

                {!isSignedIn && currentStep !== 4 ? (
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl={`/transfer?step=${currentStep}`}
                  >
                    <span
                      role="button"
                      tabIndex={0}
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-(--primary-orange) to-amber-500 text-white font-semibold rounded-2xl hover:from-(--accent-orange) hover:to-amber-600 active:scale-[0.98] shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
                    >
                      {isAuthLoaded ? "Sign in to Book" : "Book Now"}
                    </span>
                  </SignInButton>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed || isProcessing || isNextLoading}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-(--primary-orange) to-amber-500 text-white font-semibold rounded-2xl hover:from-(--accent-orange) hover:to-amber-600 active:scale-[0.98] shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : isNextLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : currentStep === 4 ? (
                      <>
                        {paymentMethod === "Cash" ? (
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
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary — luxury card */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-200/60 shadow-xl shadow-slate-200/50 p-5 sm:p-6 sticky top-24 lg:top-28 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-(--primary-orange) to-amber-500" aria-hidden />
              <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4 mt-1">
                Transfer Summary
              </h3>

              {formData.fromRegionName && formData.toRegionName && (
                <div className="mb-4 pb-4 border-b border-amber-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
                    Route
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-(--black)">
                      {formData.fromRegionName}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="font-medium text-(--black)">
                      {formData.toRegionName}
                    </span>
                  </div>
                </div>
              )}

              {formData.pickupDateTime && (
                <div className="mb-4 pb-4 border-b border-amber-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
                    Pickup
                  </p>
                  <p className="text-xs text-(--black) font-medium">
                    {new Date(formData.pickupDateTime).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}{" "}
                    at{" "}
                    {new Date(formData.pickupDateTime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              )}

              {formData.vehicleTypeId && vehicleTypes.length > 0 && (
                <div className="mb-4 pb-4 border-b border-amber-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
                    Vehicle
                  </p>
                  <p className="text-xs text-(--black) font-medium">
                    {
                      vehicleTypes.find((v) => v.id === formData.vehicleTypeId)
                        ?.title
                    }
                  </p>
                </div>
              )}

              {formData.extras.length > 0 && (
                <div className="mb-4 pb-4 border-b border-amber-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
                    Extras
                  </p>
                  <ul className="text-xs text-(--black) space-y-1">
                    {formData.extras.map((e) => {
                      const opt = extrasOptions.find(
                        (x) => Number(x.id) === e.extraId
                      );
                      return (
                        <li key={e.extraId} className="font-medium">
                          {opt?.title ?? `Extra #${e.extraId}`} × {e.quantity}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {formData.promoCode && (
                <div className="mb-4 pb-4 border-b border-amber-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
                    Promo
                  </p>
                  <p className="text-xs font-medium text-(--primary-orange)">
                    {formData.promoCode}
                  </p>
                </div>
              )}

              {previewData?.data && currentStep === 4 && (
                <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-(--accent-orange) tabular-nums">
                      {previewData.data.total} {previewData.data.currency}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-20 bg-white">
      <Contact/>
      </div> */}
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
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
        Select Pickup Date & Time
      </h2>

      <div className="max-w-md">
        <label
          htmlFor="pickupDateTime"
          className="block text-sm font-medium text-gray-600 mb-3"
        >
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
        <div className="bg-amber-50/80 border-2 border-amber-200/60 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
            Selected Pickup
          </p>
          <p className="text-base font-semibold text-(--black)">
            {new Date(formData.pickupDateTime).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            at{" "}
            {new Date(formData.pickupDateTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
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
  extrasOptions,
  extrasLoading,
  formData,
  setFormData,
  isLoading,
}: {
  vehicleTypes: VehicleTypeDto[];
  extrasOptions: ExtraDto[];
  extrasLoading: boolean;
  formData: TransferFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransferFormData>>;
  isLoading: boolean;
}) {
  const handleVehicleSelect = (vehicleId: number) => {
    setFormData((prev) => ({ ...prev, vehicleTypeId: vehicleId }));
  };

  const getExtraQuantity = (extraId: number) =>
    formData.extras.find((e) => e.extraId === extraId)?.quantity ?? 0;

  const setExtraQuantity = (extraId: number, quantity: number) => {
    setFormData((prev) => {
      const next = prev.extras.filter((e) => e.extraId !== extraId);
      if (quantity > 0) next.push({ extraId, quantity });
      return { ...prev, extras: next };
    });
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
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
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
                relative flex flex-col gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-amber-400 bg-amber-50/80 shadow-lg shadow-amber-500/15 ring-2 ring-amber-300/50 ring-offset-2 ring-offset-white"
                    : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-md"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex shrink-0 w-14 h-14 rounded-xl items-center justify-center
                    ${isSelected ? "bg-(--primary-orange) text-white" : "bg-(--light-grey) text-gray-500"}
                  `}
                >
                  <Car className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-(--black) text-base">
                    {vehicle.title}
                  </h3>
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

      {/* Extras (optional) – same UI as trips checkout */}
      <div className="pt-8 border-t border-amber-200/60">
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">
            Add Extras
          </h3>
          <p className="text-sm text-slate-600">Enhance your transfer (optional)</p>
        </div>
        {extrasLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-(--primary-orange)" />
            <p className="text-sm text-gray-500">Loading extras…</p>
          </div>
        ) : extrasOptions.length === 0 ? (
          <div className="rounded-2xl border-2 border-amber-200/50 bg-amber-50/50 py-12 px-6 text-center">
            <ShoppingBag className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">No extras available</p>
            <p className="text-sm text-slate-500 mt-1">You can continue to the next step</p>
          </div>
        ) : (
          <div className="space-y-3">
            {extrasOptions.map((extra) => {
              const extraId = Number(extra.id);
              const quantity = getExtraQuantity(extraId);
              const isPerBooking = extra.extraChargeType === "PerBooking";

              return (
                <div
                  key={extra.id}
                  className={`
                    flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-brand border bg-white
                    transition-all duration-200
                    ${quantity > 0
                      ? "border-(--primary-orange) shadow-[0_0_0_1px_var(--primary-orange)] bg-[rgba(243,114,42,0.03)]"
                      : "border-(--light-grey) hover:shadow-soft hover:border-[#d1d3d6]"
                    }
                  `}
                >
                  <div className="flex gap-4 min-w-0 flex-1">
                    <div
                      className={`
                        flex shrink-0 w-11 h-11 rounded-xl items-center justify-center
                        ${quantity > 0 ? "bg-(--primary-orange) text-white" : "bg-(--light-grey) text-gray-500"}
                      `}
                    >
                      <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-(--black) text-[20px]">
                        {extra.title}
                      </h3>
                      {extra.description && (
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {extra.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-base font-bold text-(--accent-orange)">
                          {extra.price?.amount != null
                            ? `${extra.price.amount} ${extra.price.currency ?? ""}`
                            : "—"}
                        </span>
                        <span
                          className={`
                            text-xs font-medium px-2 py-0.5 rounded-md
                            ${quantity > 0
                              ? "bg-(--primary-orange)/15 text-(--accent-orange)"
                              : "bg-(--light-grey) text-gray-600"
                            }
                          `}
                        >
                          {isPerBooking ? "Per booking" : "Per person"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isPerBooking ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExtraQuantity(extraId, quantity > 0 ? 0 : 1)
                      }
                      className={`
                        flex shrink-0 items-center justify-center gap-1.5 h-9 sm:w-auto w-full px-3 rounded-lg border transition-all duration-200 text-sm
                        ${quantity > 0
                          ? "border-(--primary-orange) bg-(--primary-orange) text-white"
                          : "border-(--light-grey) bg-white text-gray-600 hover:border-(--primary-orange) hover:text-(--accent-orange)"
                        }
                      `}
                    >
                      {quantity > 0 ? (
                        <>
                          <Check className="w-4 h-4" strokeWidth={2.5} />
                          <span className="font-medium">Added</span>
                        </>
                      ) : (
                        <span className="font-medium">Add</span>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center shrink-0 rounded-lg border border-(--light-grey) bg-(--off-white)/50 p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExtraQuantity(extraId, Math.max(0, quantity - 1))
                        }
                        disabled={quantity === 0}
                        className={`
                          flex w-8 h-8 rounded-md items-center justify-center transition-all duration-200
                          ${quantity > 0
                            ? "text-(--accent-orange) hover:bg-(--primary-orange) hover:text-white active:scale-95"
                            : "text-gray-300 cursor-not-allowed"
                          }
                        `}
                        aria-label={`Less ${extra.title}`}
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                      <span className="min-w-6 text-center font-semibold text-(--black) text-sm tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExtraQuantity(extraId, quantity + 1)}
                        className="flex w-8 h-8 rounded-md items-center justify-center text-(--accent-orange) hover:bg-(--primary-orange) hover:text-white active:scale-95 transition-all duration-200"
                        aria-label={`More ${extra.title}`}
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
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
  paymentMethod: "Cash" | "CreditCard" | null;
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<"Cash" | "CreditCard" | null>
  >;
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
    const message = isApiError(previewError)
      ? previewError.message
      : "Failed to load pricing.";
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50/80 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-red-900 text-sm">
              Preview unavailable
            </h3>
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
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
        Review & Payment
      </h2>

      {/* Passenger & trip details – required before booking */}
      <div className="rounded-2xl border-2 border-amber-200/60 bg-amber-50/30 p-4 sm:p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-(--primary-orange)" strokeWidth={2} />
          Passenger & trip details
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Required for your transfer. Room and flight help the driver find you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="transfer-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="transfer-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Full name"
              className="w-full px-3.5 py-2.5 text-sm border-2 border-amber-200/60 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
            />
          </div>
          <div>
            <label htmlFor="transfer-phone" className="block text-xs font-semibold text-slate-700 mb-1">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              id="transfer-phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              placeholder="+20 100 000 0000"
              className="w-full px-3.5 py-2.5 text-sm border-2 border-amber-200/60 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
            />
          </div>
          <div>
            <label htmlFor="transfer-room" className="block text-xs font-semibold text-slate-700 mb-1">
              Room number <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="transfer-room"
              type="text"
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, roomNumber: e.target.value }))
              }
              placeholder="e.g. for hotel pickup"
              className="w-full px-3.5 py-2.5 text-sm border-2 border-amber-200/60 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="transfer-flight" className="block text-xs font-semibold text-slate-700 mb-1">
              Flight number <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="transfer-flight"
              type="text"
              value={formData.flightNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, flightNumber: e.target.value }))
              }
              placeholder="e.g. for airport transfer"
              className="w-full px-3.5 py-2.5 text-sm border-2 border-amber-200/60 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Transfer Summary */}
      <div className="rounded-2xl border-2 border-amber-200/50 bg-white divide-y divide-amber-100">
        <div className="px-4 py-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700/80 mb-2">
            Transfer Details
          </h3>
          {previewData?.transferLegs && previewData.transferLegs.length > 0 && (
            <div className="space-y-2">
              {previewData.transferLegs.map((leg, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-(--black)">
                    {leg.fromRegionName}
                  </span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium text-(--black)">
                    {leg.toRegionName}
                  </span>
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
          className="block text-xs font-semibold uppercase tracking-wider text-amber-700/80 mb-2"
        >
          Promo Code{" "}
          <span className="text-slate-500 font-normal normal-case">
            (Optional)
          </span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" strokeWidth={2} />
            <input
              id="promoCode"
              type="text"
              value={formData.promoCode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, promoCode: e.target.value.trim() }))
              }
              placeholder="Enter code"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm border-2 border-amber-200/60 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-shadow"
            />
          </div>
          <button
            type="button"
            onClick={() => onRetryPreview()}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:border-amber-500 transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </div>
        {previewData?.discountValue != null && previewData.discountValue > 0 && (
          <p className="mt-2 text-sm text-green-700 font-medium">
            Discount applied: −{previewData.discountValue} {previewData.currency}
          </p>
        )}
      </div>

      {/* Total breakdown */}
      <div className="rounded-2xl border-2 border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
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
                <span className="text-green-700 font-medium">
                  Discount applied
                </span>
                <span className="font-semibold text-green-700 tabular-nums">
                  −{previewData.discountValue} {previewData.currency}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-amber-200/60">
              <span className="text-base font-semibold text-slate-800">
                Total amount
              </span>
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
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Choose Payment Method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("Cash")}
            className={`
              relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${
                paymentMethod === "Cash"
                  ? "border-amber-400 bg-amber-50/80 shadow-lg shadow-amber-500/15 ring-2 ring-amber-300/50 ring-offset-2"
                  : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-md"
              }
            `}
          >
            <div
              className={`
                flex shrink-0 w-12 h-12 rounded-xl items-center justify-center
                ${paymentMethod === "Cash" ? "bg-gradient-to-br from-(--primary-orange) to-amber-500 text-white" : "bg-slate-100 text-slate-400"}
              `}
            >
              <Banknote className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-(--black)">Cash</span>
              <p className="text-xs text-gray-600 mt-0.5">
                Pay driver directly
              </p>
            </div>
            {paymentMethod === "Cash" && (
              <Check
                className="w-5 h-5 text-(--primary-orange) shrink-0"
                strokeWidth={2.5}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("CreditCard")}
            className={`
              relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${
                paymentMethod === "CreditCard"
                  ? "border-amber-400 bg-amber-50/80 shadow-lg shadow-amber-500/15 ring-2 ring-amber-300/50 ring-offset-2"
                  : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-md"
              }
            `}
          >
            <div
              className={`
                flex shrink-0 w-12 h-12 rounded-xl items-center justify-center
                ${paymentMethod === "CreditCard" ? "bg-gradient-to-br from-(--primary-orange) to-amber-500 text-white" : "bg-slate-100 text-slate-400"}
              `}
            >
              <CreditCard className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-slate-800">Credit Card</span>
              <p className="text-xs text-slate-600 mt-0.5">
                Secure online payment
              </p>
            </div>
            {paymentMethod === "CreditCard" && (
              <Check
                className="w-5 h-5 text-(--primary-orange) shrink-0"
                strokeWidth={2.5}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransferBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-(--primary-orange)" />
        </div>
      }
    >
      <TransferBookingContent />
    </Suspense>
  );
}
