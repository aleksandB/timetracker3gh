//src/components/shared/DirectionSelector.tsx
import { Direction } from "../../entities/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface DirectionSelectorProps {
  directions: Direction[];
  selectedDirectionId: string;
  onDirectionChange: (id: string) => void;
}

export function DirectionSelector({
  directions,
  selectedDirectionId,
  onDirectionChange,
}: DirectionSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="direction">Направление</Label>
      <Select value={selectedDirectionId} onValueChange={onDirectionChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите направление" />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5 text-xs text-slate-500">
            Специальные направления
          </div>
          {directions
            .filter((d) => d.isSpecial)
            .map((dir) => (
              <SelectItem key={dir.id} value={dir.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: dir.color }}
                  />
                  <span>
                    {dir.name} ({dir.name.substring(0, 3).toUpperCase()})
                  </span>
                </div>
              </SelectItem>
            ))}
          <div className="px-2 py-1.5 text-xs text-slate-500 border-t mt-1 pt-2">
            Направления
          </div>
          {directions
            .filter((d) => !d.isSpecial)
            .map((dir) => (
              <SelectItem key={dir.id} value={dir.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: dir.color }}
                  />
                  <span>{dir.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
