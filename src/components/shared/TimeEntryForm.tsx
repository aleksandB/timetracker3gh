//src/components/shared/TimeEntryForm.tsx
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus } from "lucide-react";
import { TimeEntry, Direction } from "../../entities/types";
import { DirectionSelector } from "./DirectionSelector";
import { DateRangeSelector } from "./DateRangeSelector";

interface TimeEntryFormProps {
  directions: Direction[];
  initialDirection?: Direction | null;
  initialDate: string;
  onSubmit: (
    entry: TimeEntry,
    dateRange?: { start: string; end: string; includeWeekends: boolean }
  ) => void;
}

export function TimeEntryForm({
  directions,
  initialDirection = null,
  initialDate,
  onSubmit,
}: TimeEntryFormProps) {
  const [selectedDirectionId, setSelectedDirectionId] = useState(
    initialDirection?.id || ""
  );
  const [regular, setRegular] = useState("");
  const [overtime, setOvertime] = useState("");
  const [description, setDescription] = useState("");

  // Новые поля для диапазона дат
  const [useDateRange, setUseDateRange] = useState(false);
  const [startDate, setStartDate] = useState(initialDate); // по умолчанию текущая дата
  const [endDate, setEndDate] = useState(initialDate);
  const [includeWeekends, setIncludeWeekends] = useState(false); // по умолчанию НЕ включать выходные

  useEffect(() => {
    if (initialDirection) {
      setSelectedDirectionId(initialDirection.id);

      // For special directions, auto-fill 8 hours
      if (initialDirection.isSpecial) {
        setRegular("8");
        setOvertime("0");
      }
    }
  }, [initialDirection]);

  const handleSubmit = () => {
    const regularHours = parseFloat(regular) || 0;
    const overtimeHours = parseFloat(overtime) || 0;

    if (regularHours === 0 && overtimeHours === 0) {
      alert("Укажите количество часов");
      return;
    }

    if (regularHours < 0 || overtimeHours < 0) {
      alert("Часы не могут быть отрицательными");
      return;
    }

    if (regularHours > 24 || overtimeHours > 24) {
      alert("Количество часов не может превышать 24");
      return;
    }

    // Если не используем диапазон, просто добавляем одну запись
    if (!useDateRange) {
      const entry: TimeEntry = {
        date: initialDate,
        directionId: selectedDirectionId,
        regular: regularHours,
        overtime: overtimeHours,
        description: description.trim() || undefined,
      };

      onSubmit(entry);
      resetForm();
      return;
    }

    // Если используем диапазон
    onSubmit(
      {
        date: initialDate, // будет проигнорировано, если есть dateRange
        directionId: selectedDirectionId,
        regular: regularHours,
        overtime: overtimeHours,
        description: description.trim() || undefined,
      },
      { start: startDate, end: endDate, includeWeekends }
    );

    resetForm();
  };

  const resetForm = () => {
    setRegular("");
    setOvertime("");
    setDescription("");
    setUseDateRange(false);
    setStartDate(initialDate);
    setEndDate(initialDate);
    setIncludeWeekends(false);
    if (initialDirection) {
      setSelectedDirectionId(initialDirection.id);
      if (initialDirection.isSpecial) {
        setRegular("8");
        setOvertime("0");
      }
    }
  };

  const selectedDirection = directions.find(
    (d) => d.id === selectedDirectionId
  );
  const isSpecialDirection = selectedDirection?.isSpecial;

  return (
    <div className="space-y-4">
      <DirectionSelector
        directions={directions}
        selectedDirectionId={selectedDirectionId}
        onDirectionChange={setSelectedDirectionId}
      />

      {/* Новый блок: Диапазон дат */}
      <DateRangeSelector
        useDateRange={useDateRange}
        setUseDateRange={setUseDateRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        includeWeekends={includeWeekends}
        setIncludeWeekends={setIncludeWeekends}
      />

      {isSpecialDirection && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-900">
            Для направления "{selectedDirection?.name}" автоматически
            проставляется 8 часов. Эти часы не учитываются в рабочем времени.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regular">Регулярные часы</Label>
          <Input
            id="regular"
            type="number"
            min="0"
            max="24"
            step="0.25"
            placeholder="0.0"
            value={regular}
            onChange={(e) => setRegular(e.target.value)}
            disabled={isSpecialDirection}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overtime">Сверхурочные часы</Label>
          <Input
            id="overtime"
            type="number"
            min="0"
            max="24"
            step="0.25"
            placeholder="0.0"
            value={overtime}
            onChange={(e) => setOvertime(e.target.value)}
            disabled={isSpecialDirection}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          placeholder="Описание работы..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Добавить запись
        {useDateRange && " за период"}
      </Button>
    </div>
  );
}
