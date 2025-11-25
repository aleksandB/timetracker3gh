import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  monthNames?: string[]; // Можно передать кастомный список, если хочется гибкости
}

const defaultMonthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export function MonthNavigation({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  monthNames = defaultMonthNames,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onPrevious}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="min-w-[200px] text-center">
        <span className="text-slate-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onNext}>
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onToday}>
        Сегодня
      </Button>
    </div>
  );
}
