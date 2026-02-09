'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Returns minimum pickup date/time (now + 2 hours). */
function getDefaultMinDateTime(): Date {
  const d = new Date();
  d.setHours(d.getHours() + 2);
  d.setMinutes(0, 0, 0);
  return d;
}

/** Format Date to YYYY-MM-DDTHH:mm for form value. */
function toDateTimeLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

/** Parse YYYY-MM-DDTHH:mm string to Date (local). */
function parseDateTimeLocal(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Get start of day (local). */
function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

/** Is date strictly before another (by calendar day)? */
function isDayBefore(a: Date, b: Date): boolean {
  const a0 = startOfDay(a);
  const b0 = startOfDay(b);
  return a0.getTime() < b0.getTime();
}

/** Format time string for display (HH:mm). */
function formatTimeForDisplay(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDateTime?: Date;
  placeholder?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  minDateTime,
  placeholder = 'Select date and time',
  className = '',
  id,
  'aria-label': ariaLabel,
}: DateTimePickerProps) {
  const min = minDateTime ?? getDefaultMinDateTime();
  const minDate = startOfDay(min);

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseDateTimeLocal(value);
    if (parsed) return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    const m = new Date(min.getFullYear(), min.getMonth(), 1);
    return m;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    parseDateTimeLocal(value)
  );
  const [timeInput, setTimeInput] = useState(() => {
    const parsed = parseDateTimeLocal(value);
    return parsed
      ? formatTimeForDisplay(parsed.getHours(), parsed.getMinutes())
      : '';
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const parsedValue = parseDateTimeLocal(value);

  const displayLabel = parsedValue
    ? (() => {
        const dateStr = parsedValue.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const timeStr = parsedValue.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${dateStr} at ${timeStr}`;
      })()
    : placeholder;

  const handleOpen = () => {
    setIsOpen(true);
    const p = parseDateTimeLocal(value);
    if (p) {
      setSelectedDate(p);
      setViewDate(new Date(p.getFullYear(), p.getMonth(), 1));
      setTimeInput(formatTimeForDisplay(p.getHours(), p.getMinutes()));
    } else {
      setSelectedDate(null);
      setViewDate(new Date(min.getFullYear(), min.getMonth(), 1));
      setTimeInput('');
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex="0"]'
    );
    const first = focusables[0];
    if (first) first.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const list = Array.from(focusables);
      const current = document.activeElement as HTMLElement | null;
      const idx = current ? list.indexOf(current) : -1;
      if (e.shiftKey) {
        if (idx <= 0) {
          e.preventDefault();
          list[list.length - 1]?.focus();
        }
      } else {
        if (idx >= list.length - 1) {
          e.preventDefault();
          list[0]?.focus();
        }
      }
    }
    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const canPrevMonth = (() => {
    const lastDayOfPrev = new Date(year, month, 0);
    return lastDayOfPrev.getTime() >= minDate.getTime();
  })();
  const canNextMonth = true;

  const handleSelectDate = (day: number) => {
    const d = new Date(year, month, day);
    if (isDayBefore(d, minDate)) return;
    setSelectedDate(d);
    
    // If we have a valid time input, auto-apply
    if (timeInput.match(/^\d{2}:\d{2}$/)) {
      const [h, m] = timeInput.split(':').map(Number);
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        const combined = new Date(d);
        combined.setHours(h, m, 0, 0);
        if (combined.getTime() >= min.getTime()) {
          onChange(toDateTimeLocal(combined));
          handleClose();
        }
      }
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const handleApply = () => {
    if (!selectedDate) return;
    const match = timeInput.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h < 0 || h >= 24 || m < 0 || m >= 60) return;
    const d = new Date(selectedDate);
    d.setHours(h, m, 0, 0);
    if (d.getTime() < min.getTime()) return;
    onChange(toDateTimeLocal(d));
    handleClose();
  };

  const isDateDisabled = (day: number) => {
    const d = new Date(year, month, day);
    return isDayBefore(d, minDate);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isApplyDisabled = (() => {
    if (!selectedDate) return true;
    const match = timeInput.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return true;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h < 0 || h >= 24 || m < 0 || m >= 60) return true;
    const d = new Date(selectedDate);
    d.setHours(h, m, 0, 0);
    return d.getTime() < min.getTime();
  })();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={ariaLabel ?? placeholder}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-(--light-grey) bg-white text-left text-sm font-medium text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-(--primary-orange)/40 hover:shadow-[0_2px_12px_rgba(243,114,42,0.12)] focus:outline-none focus:ring-2 focus:ring-(--accent-orange) focus:ring-offset-2 focus:border-transparent transition-all duration-200 cursor-pointer"
      >
        <span className="shrink-0 text-(--accent-orange)">
          <Calendar className="w-5 h-5" aria-hidden />
        </span>
        <span className="flex-1 truncate">
          {displayLabel}
        </span>
        <Clock className="w-4 h-4 shrink-0 text-gray-400" aria-hidden />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Pick date and time"
          className="absolute z-50 mt-2 left-0 right-0 sm:right-auto sm:w-[280px] max-w-full rounded-xl border border-(--light-grey) bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-up space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canPrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg border border-(--light-grey) bg-white text-gray-600 hover:bg-(--off-white) hover:border-(--primary-orange)/40 focus:outline-none focus:ring-2 focus:ring-(--primary-orange) disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-xs font-semibold text-(--black)" tabIndex={-1}>
              {viewDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <button
              type="button"
              onClick={nextMonth}
              disabled={!canNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg border border-(--light-grey) bg-white text-gray-600 hover:bg-(--off-white) hover:border-(--primary-orange)/40 focus:outline-none focus:ring-2 focus:ring-(--primary-orange) transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label="Calendar">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="text-center text-[10px] font-medium text-gray-500 py-0.5"
                role="columnheader"
              >
                {wd}
              </div>
            ))}
            {days.map((day, i) =>
              day === null ? (
                <div key={`empty-${i}`} className="aspect-square" />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  disabled={isDateDisabled(day)}
                  aria-selected={isDateSelected(day)}
                  aria-label={`${day} ${viewDate.toLocaleDateString('en-US', { month: 'long' })} ${year}`}
                  role="gridcell"
                  className={`aspect-square min-w-[32px] flex items-center justify-center rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-1 focus:ring-(--primary-orange) focus:ring-inset ${
                    isDateDisabled(day)
                      ? 'text-gray-300 cursor-not-allowed'
                      : isDateSelected(day)
                        ? 'bg-(--primary-orange) text-white'
                        : 'text-gray-700 hover:bg-(--off-white)'
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="time-input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Time
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  id="time-input"
                  type="time"
                  value={timeInput}
                  onChange={handleTimeInputChange}
                  className="w-full px-3 py-2 text-sm border border-(--light-grey) rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-orange) focus:border-(--primary-orange) transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplyDisabled}
                className="px-4 py-2 text-xs font-semibold bg-(--primary-orange) text-white rounded-lg hover:bg-(--accent-orange) focus:outline-none focus:ring-2 focus:ring-(--primary-orange) disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
