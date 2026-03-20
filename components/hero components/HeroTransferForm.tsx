"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  CalendarDays,
  ArrowRight,
  Loader2,
  ArrowDownUp,
} from "lucide-react";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { getRegionByCoordinates } from "@/lib/apis/transferApi";

type HeroTransferFormValues = {
  from: string;
  fromPlaceId: string;
  fromLat: number | null;
  fromLon: number | null;
  to: string;
  toPlaceId: string;
  toLat: number | null;
  toLon: number | null;
  date: string;
};

const REGION_ERROR_MESSAGE =
  "We don't serve transfers for one or both of these locations yet. Please choose a pickup and destination within our service region (e.g. Hurghada, Cairo, Red Sea area).";

type HeroTransferFormProps = {
  /** Thick gold frame + green search CTA (home landing) */
  variant?: "default" | "landing";
};

export const HeroTransferForm = ({ variant = "default" }: HeroTransferFormProps) => {
  const router = useRouter();
  const {
    register,
    control,
    setValue,
    getValues,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeroTransferFormValues>({
    defaultValues: {
      from: "",
      fromPlaceId: "",
      fromLat: null,
      fromLon: null,
      to: "",
      toPlaceId: "",
      toLat: null,
      toLon: null,
      date: "",
    },
    mode: "onSubmit",
  });

  const submit = async (values: HeroTransferFormValues) => {
    const fromLat = values.fromLat ?? 0;
    const fromLon = values.fromLon ?? 0;
    const toLat = values.toLat ?? 0;
    const toLon = values.toLon ?? 0;
    if (!values.fromPlaceId || !values.toPlaceId) return;

    try {
      const [fromRegionRes, toRegionRes] = await Promise.all([
        getRegionByCoordinates(fromLat, fromLon),
        getRegionByCoordinates(toLat, toLon),
      ]);
      const fromRegion = fromRegionRes.data;
      const toRegion = toRegionRes.data;
      const params = new URLSearchParams({
        fromRegionId: String(fromRegion.id),
        fromRegionName: fromRegion.title,
        fromLat: String(fromLat),
        fromLng: String(fromLon),
        fromIsAirport: String(fromRegion.isAirport),
        toRegionId: String(toRegion.id),
        toRegionName: toRegion.title,
        toLat: String(toLat),
        toLng: String(toLon),
        toIsAirport: String(toRegion.isAirport),
        date: values.date,
      });
      router.push(`/transfer?${params.toString()}`);
    } catch {
      setError("root", { message: REGION_ERROR_MESSAGE });
    }
  };

  const swapLocations = () => {
    const from = getValues("from");
    const fromPlaceId = getValues("fromPlaceId");
    const fromLat = getValues("fromLat");
    const fromLon = getValues("fromLon");
    const to = getValues("to");
    const toPlaceId = getValues("toPlaceId");
    const toLat = getValues("toLat");
    const toLon = getValues("toLon");

    setValue("from", to, { shouldValidate: true });
    setValue("fromPlaceId", toPlaceId, { shouldValidate: true });
    setValue("fromLat", toLat, { shouldValidate: true });
    setValue("fromLon", toLon, { shouldValidate: true });
    setValue("to", from, { shouldValidate: true });
    setValue("toPlaceId", fromPlaceId, { shouldValidate: true });
    setValue("toLat", fromLat, { shouldValidate: true });
    setValue("toLon", fromLon, { shouldValidate: true });
  };

  const isLanding = variant === "landing";
  const shellClass = isLanding
    ? "rounded-2xl border-4 border-[#DDB96A] shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white"
    : "rounded-2xl bg-white/80 backdrop-blur-md";

  return (
    <motion.form
      onSubmit={handleSubmit(submit)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="md:mt-10 w-full max-w-5xl"
    >
      {errors.root?.message && (
        <p className="mb-3 text-center text-sm text-amber-200 bg-amber-900/40 rounded-lg px-4 py-2">
          {errors.root.message}
        </p>
      )}
      <div
        className={[
          "w-full overflow-hidden flex flex-col sm:flex-row",
          shellClass,
        ].join(" ")}
      >
        {/* FROM */}
        <div className="flex-1 min-w-0 flex items-center border-b sm:border-b-0 sm:border-r border-slate-200/90">
          <div className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 min-w-0 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-main/10 text-main shrink-0">
              <MapPin className="w-4 h-4" />
            </span>

            <Controller
              name="from"
              control={control}
              rules={{
                required: "Pickup location is required",
                validate: () =>
                  // أهم سطر: لازم يكون في اختيار (placeId)
                  (Boolean(document as any) && true) || true, // ignore (we validate via fromPlaceId below)
              }}
              render={({ field }) => (
                <AddressAutocomplete
                  value={field.value}
                  onChange={(value, result) => {
                    field.onChange(value);
                    if (
                      result?.place_id != null &&
                      result?.lat != null &&
                      result?.lon != null
                    ) {
                      setValue("fromPlaceId", result.place_id, {
                        shouldValidate: true,
                      });
                      setValue("fromLat", result.lat, { shouldValidate: true });
                      setValue("fromLon", result.lon, { shouldValidate: true });
                    } else {
                      setValue("fromPlaceId", "", { shouldValidate: true });
                      setValue("fromLat", null, { shouldValidate: true });
                      setValue("fromLon", null, { shouldValidate: true });
                    }
                  }}
                  onBlur={field.onBlur}
                  placeholder="Pickup location"
                  label={undefined}
                  error={errors.fromPlaceId?.message || errors.from?.message}
                  id="from"
                  name="from"
                />
              )}
            />

            <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
          </div>
        </div>

        {/* Swap (desktop: between columns) */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-slate-200/90 bg-slate-50/80 py-2 sm:w-12 sm:border-b-0 sm:border-r sm:border-slate-200/90 sm:bg-white sm:py-0">
          <button
            type="button"
            onClick={swapLocations}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-main shadow-sm transition hover:bg-main hover:text-white"
            aria-label="Swap pickup and destination"
          >
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>

        {/* TO */}
        <div className="flex-1 min-w-0 flex items-center border-b sm:border-b-0 sm:border-r border-slate-200/90">
          <div className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 min-w-0 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-main/10 text-main shrink-0">
              <MapPin className="w-4 h-4" />
            </span>

            <Controller
              name="to"
              control={control}
              rules={{ required: "Destination is required" }}
              render={({ field }) => (
                <AddressAutocomplete
                  value={field.value}
                  onChange={(value, result) => {
                    field.onChange(value);
                    if (
                      result?.place_id != null &&
                      result?.lat != null &&
                      result?.lon != null
                    ) {
                      setValue("toPlaceId", result.place_id, {
                        shouldValidate: true,
                      });
                      setValue("toLat", result.lat, { shouldValidate: true });
                      setValue("toLon", result.lon, { shouldValidate: true });
                    } else {
                      setValue("toPlaceId", "", { shouldValidate: true });
                      setValue("toLat", null, { shouldValidate: true });
                      setValue("toLon", null, { shouldValidate: true });
                    }
                  }}
                  onBlur={field.onBlur}
                  placeholder="Destination"
                  label={undefined}
                  error={errors.toPlaceId?.message || errors.to?.message}
                  id="to"
                  name="to"
                />
              )}
            />

            <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
          </div>
        </div>

        {/* DATE */}
        <div className="flex-1 min-w-0 flex items-center sm:flex-[0.85] border-b sm:border-b-0 sm:border-r border-slate-200/90">
          <div className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 min-w-0 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-main/10 text-main shrink-0">
              <CalendarDays className="w-4 h-4" />
            </span>

            <div className="min-w-0 flex-1">
              <label className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                className="block w-full text-sm font-medium text-gray-800 bg-transparent outline-none"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
          </div>
        </div>

        {/* SUBMIT */}
        <div
          className={[
            "shrink-0 p-2.5 sm:p-3 flex items-center justify-center",
            isLanding ? "bg-emerald-600" : "bg-main",
          ].join(" ")}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className={[
              "w-full sm:w-auto flex items-center justify-center gap-2 font-semibold px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-sm transition",
              isLanding
                ? "bg-white text-emerald-800 hover:bg-emerald-50"
                : "bg-white/95 hover:bg-white text-gray-900",
            ].join(" ")}
          >
            {isLanding ? "Search" : "Book transfer"}
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* ✅ هنا الـ validation الحقيقي */}
        <input
          type="hidden"
          {...register("fromPlaceId", {
            required: "Please select a pickup from the list",
          })}
        />
        <input
          type="hidden"
          {...register("toPlaceId", {
            required: "Please select a destination from the list",
          })}
        />
      </div>
    </motion.form>
  );
};
