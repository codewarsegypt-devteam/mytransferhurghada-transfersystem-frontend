'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, ArrowRightLeft, X } from 'lucide-react';
import { getRegionByCoordinates } from '@/lib/apis/transferApi';
import { isApiError } from '@/lib/apis/apiErrors';
import type { RegionDto } from '@/lib/types/bookingTypes';
import { useAuth } from '@clerk/nextjs';

// Fix for default marker icons in Leaflet with webpack/Next.js
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const stadiaApiKey = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY : undefined;
  const tileUrl = stadiaApiKey
    ? `https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${stadiaApiKey}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttribution = stadiaApiKey
    ? '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg) translate(11px, -11px);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const fromIcon = createCustomIcon('#F3722A'); // primary-orange
const toIcon = createCustomIcon('#F15A22'); // accent-orange

type LocationData = {
  lat: number;
  lng: number;
  regionId: number;
  regionName: string;
  isAirport: boolean;
};

interface TransferMapPickerProps {
  fromLocation: LocationData | null;
  toLocation: LocationData | null;
  onFromChange: (location: LocationData | null) => void;
  onToChange: (location: LocationData | null) => void;
}

// Component to provide map center getter function (uses ref so it's always current and sync)
function MapCenterProvider({ getCenterRef }: { getCenterRef: React.MutableRefObject<(() => { lat: number; lng: number } | null) | null> }) {
  const map = useMap();

  useEffect(() => {
    getCenterRef.current = () => {
      if (!map) return null;
      const center = map.getCenter();
      return { lat: center.lat, lng: center.lng };
    };
    return () => {
      getCenterRef.current = null;
    };
  }, [map, getCenterRef]);

  return null;
}

export default function TransferMapPicker({
  fromLocation,
  toLocation,
  onFromChange,
  onToChange,
}: TransferMapPickerProps) {
  const [mode, setMode] = useState<'from' | 'to'>('from');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getCenterRef = useRef<(() => { lat: number; lng: number } | null) | null>(null);

  const center: [number, number] = useMemo(() => [27.26, 33.81], []); // Hurghada

  const handleConfirmLocation = async () => {
    const getCenterFn = getCenterRef.current;
    if (typeof getCenterFn !== 'function') {
      setError('Map not ready. Please try again.');
      return;
    }

    const centerPos = getCenterFn();
    if (!centerPos) {
      setError('Could not get map center. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getRegionByCoordinates(centerPos.lat, centerPos.lng);
      
      if (response.succeeded && response.data) {
        const locationData: LocationData = {
          lat: centerPos.lat,
          lng: centerPos.lng,
          regionId: response.data.id,
          regionName: response.data.title,
          isAirport: response.data.isAirport,
        };

        if (mode === 'from') {
          onFromChange(locationData);
          // Auto-switch to "to" mode after selecting "from"
          setMode('to');
        } else {
          onToChange(locationData);
        }
      } else {
        setError('No region found for this location. Please choose a point within our service area.');
      }
    } catch (err) {
      console.error('Error resolving region:', err);
      const message = isApiError(err) 
        ? err.message 
        : 'Failed to resolve location. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    const tempFrom = fromLocation;
    onFromChange(toLocation);
    onToChange(tempFrom);
  };

  const handleClearFrom = () => {
    onFromChange(null);
    setMode('from');
  };

  const handleClearTo = () => {
    onToChange(null);
    setMode('to');
  };
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  return (
    <div className="space-y-2">
      {/* Mode selector — compact pill toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 flex gap-1.5 p-0.5 rounded-full bg-(--light-grey)/60 border border-(--light-grey)">
          <button
            type="button"
            onClick={() => setMode('from')}
            className={`
              flex-1 px-3 py-2 rounded-full font-medium text-xs transition-all duration-200
              ${mode === 'from'
                ? 'bg-(--primary-orange) text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Pick-up {fromLocation && '✓'}
          </button>
          <button
            type="button"
            onClick={() => setMode('to')}
            className={`
              flex-1 px-3 py-2 rounded-full font-medium text-xs transition-all duration-200
              ${mode === 'to'
                ? 'bg-(--accent-orange) text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Drop-off {toLocation && '✓'}
          </button>
        </div>
      </div>

      {/* Current selection — compact From/To cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* From */}
        <div
          className={`
            p-3 rounded-lg border transition-all duration-200
            ${mode === 'from' && !fromLocation
              ? 'border-(--primary-orange) bg-[rgba(243,114,42,0.06)]'
              : 'border-(--light-grey) bg-white'
            }
          `}
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`
                  flex shrink-0 w-8 h-8 rounded-md items-center justify-center
                  ${fromLocation ? 'bg-(--primary-orange) text-white' : 'bg-(--light-grey) text-gray-400'}
                `}
              >
                <MapPin className="w-4 h-4" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">
                  <span className="font-medium text-gray-600">Pick-up</span>
                  {fromLocation ? (
                    <> · <span className="font-semibold text-(--black)">{fromLocation.regionName}</span></>
                  ) : (
                    <span className="italic text-gray-400">{mode === 'from' ? 'Click map…' : 'Not set'}</span>
                  )}
                </p>
                {fromLocation?.isAirport && (
                  <span className="inline-block mt-0.5 text-[10px] bg-(--primary-orange)/10 text-(--accent-orange) px-1.5 py-0.5 rounded font-medium">
                    Airport
                  </span>
                )}
              </div>
            </div>
            {fromLocation && (
              <button
                type="button"
                onClick={handleClearFrom}
                className="shrink-0 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                title="Clear pick-up"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* To */}
        <div
          className={`
            p-3 rounded-lg border transition-all duration-200
            ${mode === 'to' && !toLocation
              ? 'border-(--accent-orange) bg-[rgba(241,90,34,0.06)]'
              : 'border-(--light-grey) bg-white'
            }
          `}
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`
                  flex shrink-0 w-8 h-8 rounded-md items-center justify-center
                  ${toLocation ? 'bg-(--accent-orange) text-white' : 'bg-(--light-grey) text-gray-400'}
                `}
              >
                <MapPin className="w-4 h-4" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">
                  <span className="font-medium text-gray-600">Drop-off</span>
                  {toLocation ? (
                    <> · <span className="font-semibold text-(--black)">{toLocation.regionName}</span></>
                  ) : (
                    <span className="italic text-gray-400">{mode === 'to' ? 'Click map…' : 'Not set'}</span>
                  )}
                </p>
                {toLocation?.isAirport && (
                  <span className="inline-block mt-0.5 text-[10px] bg-(--accent-orange)/10 text-(--accent-orange) px-1.5 py-0.5 rounded font-medium">
                    Airport
                  </span>
                )}
              </div>
            </div>
            {toLocation && (
              <button
                type="button"
                onClick={handleClearTo}
                className="shrink-0 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                title="Clear drop-off"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instruction + CTA — compact one-line hint, smaller button */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 text-center px-2">
          {mode === 'from'
            ? 'Move the map so the pin is on pick-up, then tap below.'
            : 'Move the map so the pin is on drop-off, then tap below.'}
        </p>
        <button
          type="button"
          onClick={handleConfirmLocation}
          disabled={isLoading}
          className={`
            w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm
            ${mode === 'from'
              ? 'bg-(--primary-orange) hover:bg-(--accent-orange) text-white'
              : 'bg-(--accent-orange) hover:bg-(--primary-orange) text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Setting location...</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              <span>{mode === 'from' ? 'Set Pick-up Location' : 'Set Drop-off Location'}</span>
            </>
          )}
        </button>
      </div>

      {/* Error — compact */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50/80">
          <div className="shrink-0 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">!</span>
          </div>
          <p className="text-xs text-red-800 font-medium flex-1 min-w-0">{error}</p>
        </div>
      )}

      {/* Map */}
      <div className="relative rounded-brand overflow-hidden border-2 border-(--light-grey) shadow-soft">
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '400px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            url={tileUrl}
            attribution={tileAttribution}
          />

          <MapCenterProvider getCenterRef={getCenterRef} />

          {/* From marker */}
          {fromLocation && (
            <Marker position={[fromLocation.lat, fromLocation.lng]} icon={fromIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-sm">Pick-up</p>
                  <p className="text-xs text-gray-600">{fromLocation.regionName}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* To marker */}
          {toLocation && (
            <Marker position={[toLocation.lat, toLocation.lng]} icon={toIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-sm">Drop-off</p>
                  <p className="text-xs text-gray-600">{toLocation.regionName}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Fixed center pin overlay */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-1000"
          style={{ marginTop: '-8px' }}
        >
          <div className="relative">
            {/* Pin drop shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
            
            {/* Animated pin icon */}
            <div 
              className={`
                transition-all duration-500 
                ${mode === 'from' ? 'text-(--primary-orange)' : 'text-(--accent-orange)'}
              `}
              style={{ 
                animationDuration: '2s',
                animationIterationCount: 'infinite'
              }}
            >
              <MapPin 
                className="w-10 h-10 drop-shadow-lg" 
                strokeWidth={2.5}
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-1001 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-(--primary-orange)" />
              <p className="text-sm text-gray-600 font-medium">Resolving location...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
