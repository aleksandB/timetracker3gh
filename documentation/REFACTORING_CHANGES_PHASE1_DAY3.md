# Изменения: Фаза 1, День 3 - Унификация компонента таблицы

## 📋 Описание проблемы

**Проблема:** В проекте использовались два разных компонента для отображения таблицы календаря:
- `CalendarGrid` - для редактирования (использовался в `TimeTracker` и `EmployeeDetailedView`)
- Кастомная таблица в `EmployeeDetailsPanel` - для read-only режима (использовалась в `EmployeeSummaryCard`)

Это приводило к:
- Дублированию кода и логики
- Сложности поддержки (изменения нужно было делать в двух местах)
- Несогласованности интерфейсов

**Решение:** Унифицировать использование `CalendarGrid` везде с поддержкой режима `readOnly` и кнопкой для переключения режима.

---

## 🔧 Внесенные изменения

### 1. Обновлен: `src/components/features/TeamView/EmployeeDetailsPanel.tsx`

**Что изменилось:**
- ✅ Удалена кастомная таблица (строки 123-190 старого кода)
- ✅ Заменена на `CalendarGrid` с поддержкой `readOnly`
- ✅ Добавлено состояние для переключения между read-only и editable режимами
- ✅ Добавлена кнопка "Редактировать" / "Только просмотр" для переключения режима
- ✅ Упрощен интерфейс - убраны ненужные пропсы (`year`, `month`, `days`, `formatDate`, `getDirectionEntriesForDate`, `projectsWithDirectionsForUser`)
- ✅ Добавлены опциональные функции для редактирования (`onAddEntry`, `onUpdateEntry`, `onDeleteEntry`)

**Было:**
```typescript
// ❌ Кастомная таблица с ProjectRow и CalendarDirectionRow
<div className="overflow-x-auto">
  <table className="w-full border-collapse text-xs">
    <thead>...</thead>
    <tbody>
      {projectsWithDirectionsForUser?.map(({ project, directions }) => (
        <>
          <ProjectRow ... />
          {directions.map((direction) => (
            <CalendarDirectionRow ... />
          ))}
        </>
      ))}
    </tbody>
  </table>
</div>
```

**Стало:**
```typescript
// ✅ Единый компонент CalendarGrid
<div className="p-4 bg-white">
  <CalendarGrid
    currentDate={currentDate}
    entries={userEntries}
    directions={directions}
    onAddEntry={onAddEntry || (() => {})}
    onUpdateEntry={onUpdateEntry || (() => {})}
    onDeleteEntry={onDeleteEntry || (() => {})}
    readOnly={isReadOnly || !canEdit}
    userId={memberId}
  />
</div>
```

**Добавлена кнопка переключения режима:**
```typescript
// ✅ Состояние для переключения режима
const [isReadOnly, setIsReadOnly] = useState(initialReadOnly);

// ✅ Кнопка в заголовке
{canEdit && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => setIsReadOnly(!isReadOnly)}
  >
    {isReadOnly ? (
      <>
        <Edit2 className="w-4 h-4" />
        Редактировать
      </>
    ) : (
      <>
        <Lock className="w-4 h-4" />
        Только просмотр
      </>
    )}
  </Button>
)}
```

**Объяснение для Vue разработчика:**
- В Vue это было бы: `const isReadOnly = ref(true)` и `@click="isReadOnly = !isReadOnly"`
- В React используется `useState` для локального состояния компонента

---

### 2. Обновлен: `src/components/features/TeamView/EmployeeSummaryCard.tsx`

**Что изменилось:**
- ✅ Упрощен интерфейс - убраны ненужные пропсы
- ✅ Заменены `year`, `month`, `days` на `currentDate`
- ✅ Добавлены опциональные функции для редактирования

**Было:**
```typescript
interface EmployeeSummaryCardProps {
  // ...
  year: number;
  month: number;
  days: number[];
  projectsWithDirectionsForUser: {...}[];
  getDirectionEntriesForDate: (...);
  formatDate: (day: number) => string;
}
```

**Стало:**
```typescript
interface EmployeeSummaryCardProps {
  // ...
  currentDate: Date; // ✅ Один проп вместо трех
  // ✅ Убраны ненужные пропсы
  onAddEntry?: (entry: TimeEntry) => void; // ✅ Опциональные функции
  onUpdateEntry?: (index: number, entry: TimeEntry) => void;
  onDeleteEntry?: (index: number) => void;
}
```

---

### 3. Обновлен: `src/components/features/TeamView/TeamSummaryView.tsx`

**Что изменилось:**
- ✅ Упрощена передача пропсов в `EmployeeSummaryCard`
- ✅ Убраны ненужные вычисления `year`, `month`, `days` (они больше не нужны)

**Было:**
```typescript
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

<EmployeeSummaryCard
  year={year}
  month={month}
  days={days}
  // ... другие пропсы
/>
```

**Стало:**
```typescript
// ✅ Убраны вычисления - они больше не нужны
<EmployeeSummaryCard
  currentDate={currentDate} // ✅ Просто передаем currentDate
  // ... другие пропсы
/>
```

---

## ✅ Результат

После этих изменений:

1. ✅ **Единый компонент таблицы** - `CalendarGrid` используется везде
2. ✅ **Поддержка read-only режима** - таблица может быть read-only или editable
3. ✅ **Кнопка переключения режима** - пользователь может переключаться между режимами
4. ✅ **Упрощенный код** - убрано дублирование, меньше пропсов
5. ✅ **Легче поддерживать** - изменения нужно делать только в одном месте

---

## 🧪 Как проверить

1. **Откройте приложение** и войдите как менеджер или админ
2. **Перейдите на вкладку "Часы команды"**
3. **Раскройте карточку сотрудника** (нажмите на стрелку)
4. **Проверьте таблицу** - должна отображаться таблица календаря в read-only режиме
5. **Проверьте кнопку "Редактировать"** - если функции редактирования переданы, должна быть кнопка для переключения режима
6. **Проверьте секции** - "Распределение по направлениям" и "Последние записи" должны остаться

**Что должно работать:**
- Таблица отображается корректно
- Часы показываются в ячейках
- В read-only режиме нельзя редактировать (нет клика по ячейкам)
- Кнопка переключает режим (если функции редактирования переданы)

---

## 📝 Технические детали

### Состояние компонента (для Vue разработчика)

**В Vue:**
```vue
<script setup>
const isReadOnly = ref(true)

const toggleMode = () => {
  isReadOnly.value = !isReadOnly.value
}
</script>

<template>
  <button @click="toggleMode">
    {{ isReadOnly ? 'Редактировать' : 'Только просмотр' }}
  </button>
</template>
```

**В React:**
```typescript
const [isReadOnly, setIsReadOnly] = useState(true);

const toggleMode = () => {
  setIsReadOnly(!isReadOnly);
};

return (
  <button onClick={toggleMode}>
    {isReadOnly ? 'Редактировать' : 'Только просмотр'}
  </button>
);
```

### Условная передача функций

**Логика:**
- Если функции редактирования переданы (`onAddEntry`, `onUpdateEntry`, `onDeleteEntry`) - можно редактировать
- Если не переданы - таблица всегда read-only
- Кнопка переключения показывается только если функции переданы

**В коде:**
```typescript
const canEdit = !!(onAddEntry && onUpdateEntry && onDeleteEntry);

// Кнопка показывается только если можно редактировать
{canEdit && (
  <Button onClick={() => setIsReadOnly(!isReadOnly)}>
    {isReadOnly ? 'Редактировать' : 'Только просмотр'}
  </Button>
)}
```

### Упрощение интерфейса

**Было:**
- Нужно было передавать `year`, `month`, `days`, `formatDate`, `getDirectionEntriesForDate`, `projectsWithDirectionsForUser`
- Все это вычислялось в родительском компоненте

**Стало:**
- Передаем только `currentDate`
- `CalendarGrid` сам вычисляет все необходимое внутри

**Преимущества:**
- Меньше пропсов
- Меньше вычислений в родительском компоненте
- Проще использовать компонент

---

## 🔍 Отладка (если что-то не работает)

Если таблица не отображается или работает неправильно:

1. **Проверьте что `currentDate` передается:**
   ```typescript
   console.log('currentDate:', currentDate);
   ```

2. **Проверьте что `entries` не пустой:**
   ```typescript
   console.log('userEntries:', userEntries);
   ```

3. **Проверьте что `directions` не пустой:**
   ```typescript
   console.log('directions:', directions);
   ```

4. **Проверьте режим read-only:**
   ```typescript
   console.log('isReadOnly:', isReadOnly);
   console.log('canEdit:', canEdit);
   ```

---

## 🚀 Следующие шаги

После этого этапа можно переходить к:
- **День 4:** Исправление прав доступа к табам по ролям

---

## ⚠️ Важные замечания

1. **Обратная совместимость** - старые компоненты, которые не передают функции редактирования, будут работать в read-only режиме
2. **Секции сохранены** - "Распределение по направлениям" и "Последние записи" остались, они полезны
3. **Производительность** - `CalendarGrid` теперь используется везде, что упрощает оптимизацию

---

## 📚 Полезные ссылки

- [React useState](https://react.dev/reference/react/useState)
- [React Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [TypeScript Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)

