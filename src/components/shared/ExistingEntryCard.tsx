//src/components/shared/ExistingEntryCard.tsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Trash2 } from "lucide-react";
import { TimeEntry, Direction } from "../../entities/types";

interface ExistingEntryCardProps {
  entry: TimeEntry;
  direction: Direction | undefined;
  onUpdate: (entry: TimeEntry) => void;
  onDelete: () => void;
}

export function ExistingEntryCard({
  entry,
  direction,
  onUpdate,
  onDelete,
}: ExistingEntryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [regular, setRegular] = useState(entry.regular.toString());
  const [overtime, setOvertime] = useState(entry.overtime.toString());
  const [description, setDescription] = useState(entry.description || "");

  const handleSave = () => {
    const regularHours = parseFloat(regular) || 0;
    const overtimeHours = parseFloat(overtime) || 0;

    if (regularHours === 0 && overtimeHours === 0) {
      alert("Укажите количество часов");
      return;
    }

    onUpdate({
      ...entry,
      regular: regularHours,
      overtime: overtimeHours,
      description: description.trim() || undefined,
    });
    setIsEditing(false);
  };

  if (!direction) return null;

  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: direction.color }}
          />
          <div>
            <div className="text-sm text-slate-900">{direction.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Badge variant="secondary">{entry.regular}ч</Badge>
              {entry.overtime > 0 && (
                <Badge className="bg-orange-500">+{entry.overtime}ч</Badge>
              )}
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              max="24"
              step="0.25"
              placeholder="Регулярные"
              value={regular}
              onChange={(e) => setRegular(e.target.value)}
              disabled={direction.isSpecial}
            />
            <Input
              type="number"
              min="0"
              max="24"
              step="0.25"
              placeholder="Сверхурочные"
              value={overtime}
              onChange={(e) => setOvertime(e.target.value)}
              disabled={direction.isSpecial}
            />
          </div>
          <Textarea
            placeholder="Описание..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Сохранить
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <>
          {entry.description && (
            <div className="text-sm text-slate-600 mt-2">
              {entry.description}
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="w-3 h-3 mr-1" />
              Удалить
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
