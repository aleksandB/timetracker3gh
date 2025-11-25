//src/components/shared/DateRangeSelector.tsx
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CalendarRange as CalendarRangeIcon } from "lucide-react";

interface DateRangeSelectorProps {
  useDateRange: boolean;
  setUseDateRange: (use: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  includeWeekends: boolean;
  setIncludeWeekends: (include: boolean) => void;
}

export function DateRangeSelector({
  useDateRange,
  setUseDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  includeWeekends,
  setIncludeWeekends,
}: DateRangeSelectorProps) {
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const generateDateRange = (
    start: string,
    end: string,
    includeWeekends: boolean
  ): string[] => {
    const dates: string[] = [];
    const startD = new Date(`${start}T00:00:00`);
    const endD = new Date(`${end}T00:00:00`);

    if (startD > endD) return [];

    const current = new Date(startD);
    while (current <= endD) {
      if (includeWeekends || !isWeekend(current)) {
        const dateStr =
          current.getFullYear() +
          "-" +
          String(current.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(current.getDate()).padStart(2, "0");
        dates.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="useDateRange"
          checked={useDateRange}
          onChange={(e) => setUseDateRange(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="useDateRange" className="cursor-pointer">
          Проставить за период
        </Label>
        <CalendarRangeIcon className="w-4 h-4 text-slate-500" />
      </div>

      {useDateRange && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Начало</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Конец</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-weekends"
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="include-weekends" className="cursor-pointer">
              Включить выходные дни
            </Label>
          </div>

          {(() => {
            const dates = generateDateRange(
              startDate,
              endDate,
              includeWeekends
            );
            return (
              <div className="p-2 bg-slate-50 rounded text-xs text-slate-600">
                Будет создано записей: {dates.length}{" "}
                {dates.length > 0 &&
                  `(${dates[0]} - ${dates[dates.length - 1]})`}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
