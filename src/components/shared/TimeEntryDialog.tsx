// src/components/shared/TimeEntryDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Clock, Info } from "lucide-react";
import { TimeEntry, Direction } from "../../entities/types";
import { TimeEntryForm } from "./TimeEntryForm";
import { ExistingEntryCard } from "./ExistingEntryCard";

interface TimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  direction: Direction | null;
  directions: Direction[];
  entries: { entry: TimeEntry; index: number }[];
  onAddEntry: (entry: TimeEntry) => void;
  onAddEntries?: (entries: TimeEntry[]) => void;
  onUpdateEntry: (id: string, entry: TimeEntry) => void; // ✅ Изменено: используем id вместо index
  onDeleteEntry: (id: string) => void; // ✅ Изменено: используем id вместо index
}

export function TimeEntryDialog({
  open,
  onOpenChange,
  date,
  direction,
  directions,
  entries,
  onAddEntry,
  onAddEntries,
  onUpdateEntry,
  onDeleteEntry,
}: TimeEntryDialogProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleFormSubmit = (
    entry: TimeEntry,
    dateRange?: { start: string; end: string; includeWeekends: boolean }
  ) => {
    if (dateRange) {
      const { start, end, includeWeekends } = dateRange;
      const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      };

      const dates: string[] = [];
      const startD = new Date(`${start}T00:00:00`);
      const endD = new Date(`${end}T00:00:00`);

      if (startD > endD) return;

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

      const newEntries: TimeEntry[] = dates.map((dayDate) => ({
        ...entry,
        date: dayDate,
      }));

      if (onAddEntries) {
        onAddEntries(newEntries);
      } else {
        newEntries.forEach((e) => onAddEntry(e));
      }
    } else {
      onAddEntry(entry);
    }
  };

  const handleUpdate = (index: number, entryData: TimeEntry) => {
    // ✅ Преобразуем index в id
    const entry = entries[index]?.entry;
    if (entry?.id) {
      onUpdateEntry(entry.id, entryData);
    }
  };

  const handleDelete = (index: number) => {
    // ✅ Преобразуем index в id
    const entry = entries[index]?.entry;
    if (entry?.id) {
      onDeleteEntry(entry.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div>Учет времени</div>
                <div className="text-sm text-slate-500">{formatDate(date)}</div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Entries */}
          {entries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm text-slate-700">Записи за этот день</h3>
              {entries.map(({ entry, index }) => {
                const dir = directions.find((d) => d.id === entry.directionId);
                return (
                  <ExistingEntryCard
                    key={index}
                    entry={entry}
                    direction={dir}
                    onUpdate={(updated) => handleUpdate(index, updated)}
                    onDelete={() => handleDelete(index)}
                  />
                );
              })}
            </div>
          )}

          {/* Add New Entry Form */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm text-slate-700 mb-4">
              {entries.length > 0 ? "Добавить запись" : "Новая запись"}
            </h3>

            <TimeEntryForm
              directions={directions}
              initialDirection={direction}
              initialDate={date}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
