// src/pages/InitPage.tsx
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import { loadData, saveData } from "../store/slices/initSlice";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function InitPage() {
  const dispatch = useDispatch<AppDispatch>();
  const initStatus = useSelector((state: RootState) => state.init);
  const { loading, error } = initStatus || { loading: false, error: null };
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const jsonData = JSON.parse(content);
          // Валидация данных (желательно)
          dispatch(loadData(jsonData));
        } catch (err) {
          console.error("Ошибка при чтении файла:", err);
          alert("Ошибка при чтении файла JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveClick = () => {
    dispatch(saveData());
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Инициализация системы</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Загрузить данные</h3>
              <p className="text-sm text-slate-500 mb-3">
                Выберите файл JSON с начальными данными (пользователи, проекты,
                направления, часы).
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleLoadClick} disabled={loading}>
                {loading ? "Загрузка..." : "Загрузить JSON"}
              </Button>
              {fileName && (
                <p className="text-sm text-slate-500 mt-2">
                  Выбран файл: {fileName}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-lg font-medium mb-2">Сохранить данные</h3>
              <p className="text-sm text-slate-500 mb-3">
                Сохранить текущее состояние системы в файл JSON.
              </p>
              <Button onClick={handleSaveClick} disabled={loading}>
                {loading ? "Сохранение..." : "Сохранить JSON"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
