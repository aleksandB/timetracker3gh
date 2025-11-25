# Изменения: Фаза 1, День 2 - Исправление бага с выводом часов в таблицах

## 📋 Описание проблемы

**Проблема:** Часы не выводились в таблицах календаря, хотя данные передавались. Дашборды и история заполнялись, но таблицы оставались пустыми.

**Причина:** Несоответствие сигнатур функции `getDirectionEntriesForDate`:
- В `useCalendarGridLogic` функция принимала только `(day: number, directionId: string)`
- В `CalendarDirectionRow` и `ProjectRow` функция вызывалась с `userId`: `getDirectionEntriesForDate(userId, directionId, day)`
- `userId` не передавался в `CalendarGrid` и не использовался для фильтрации

**Решение:** Добавлена поддержка `userId` во всей цепочке компонентов и хуков.

---

## 🔧 Внесенные изменения

### 1. Обновлен: `src/lib/hooks/useCalendarGridLogic.ts`

**Что изменилось:**
- Добавлен параметр `userId` в интерфейс `UseCalendarGridLogicProps`
- Функция `getDirectionEntriesForDate` теперь принимает `userId` как первый параметр
- Добавлена фильтрация по `userId` в функции

**Было:**
```typescript
// ❌ Не принимал userId
const getDirectionEntriesForDate = (day: number, directionId: string) => {
  const date = formatDate(day);
  return entries.filter(
    (entry) => entry.date === date && entry.directionId === directionId
  );
};
```

**Стало:**
```typescript
// ✅ Принимает userId и фильтрует по нему
const getDirectionEntriesForDate = (
  userId: string,
  directionId: string,
  day: number
) => {
  const date = formatDate(day);
  return entries.filter(
    (entry) =>
      entry.userId === userId &&
      entry.date === date &&
      entry.directionId === directionId
  );
};
```

**Объяснение для Vue разработчика:**
- В Vue это было бы функция с параметрами: `(userId, directionId, day) => entries.filter(...)`
- В React это функция, которая возвращается из хука и используется в компонентах

---

### 2. Обновлен: `src/components/shared/CalendarGrid.tsx`

**Что изменилось:**
- Добавлен опциональный параметр `userId` в `CalendarGridProps`
- Если `userId` не передан, пытается получить его из `entries[0]?.userId` (для обратной совместимости)
- Передает `userId` в `useCalendarGridLogic`
- Передает `userId` в `ProjectRow` и `CalendarDirectionRow`

**Изменения:**
```typescript
interface CalendarGridProps {
  // ... другие props
  userId?: string; // ✅ Добавлен userId
}

export function CalendarGrid({
  // ... другие props
  userId,
}: CalendarGridProps) {
  // ✅ Получаем userId из props или из entries
  const effectiveUserId = userId || entries[0]?.userId || "";
  
  // ✅ Передаем userId в хук
  const { getDirectionEntriesForDate, ... } = useCalendarGridLogic({
    // ...
    userId: effectiveUserId,
  });
  
  // ✅ Передаем userId в дочерние компоненты
  <ProjectRow userId={effectiveUserId} ... />
  <CalendarDirectionRow userId={effectiveUserId} ... />
}
```

**Объяснение для Vue разработчика:**
- В Vue это было бы: `const effectiveUserId = computed(() => props.userId || entries.value[0]?.userId || '')`
- В React это просто переменная, которая вычисляется при каждом рендере

---

### 3. Обновлен: `src/components/features/TimeTracker/index.tsx`

**Что изменилось:**
- Передает `currentUser.id` в `CalendarGrid` как `userId`

**Изменение:**
```typescript
<CalendarGrid
  // ... другие props
  userId={currentUser.id} // ✅ Передаем userId
/>
```

---

### 4. Обновлен: `src/components/features/TeamView/EmployeeDetailedView.tsx`

**Что изменилось:**
- Передает `selectedEmployee` (который является `userId`) в `CalendarGrid`

**Изменение:**
```typescript
<CalendarGrid
  // ... другие props
  userId={selectedEmployee || undefined} // ✅ Передаем userId
/>
```

---

## ✅ Результат

После этих изменений:

1. ✅ **Часы отображаются в таблицах** - `getDirectionEntriesForDate` правильно фильтрует записи по `userId`
2. ✅ **Сигнатуры функций совпадают** - все компоненты используют одинаковую сигнатуру
3. ✅ **Фильтрация работает корректно** - записи фильтруются и по `userId`, и по `directionId`, и по дате
4. ✅ **Обратная совместимость** - если `userId` не передан, он берется из `entries`

---

## 🧪 Как проверить

1. **Откройте приложение** и войдите как пользователь
2. **Добавьте несколько записей времени** для разных направлений
3. **Откройте календарь** - должны отображаться часы в ячейках таблицы
4. **Проверьте разные направления** - часы должны отображаться для каждого направления
5. **Проверьте итоговые суммы** - в колонке "Итого" должны быть правильные суммы

**Что должно отображаться:**
- В ячейках таблицы: регулярные часы (например, "8.0") и сверхурочные (например, "+2.0")
- В колонке "Итого": суммарные часы по направлению
- В строке проекта: суммарные часы по всем направлениям проекта

---

## 📝 Технические детали

### Проблема с сигнатурами функций

**Проблема была в том, что:**
```typescript
// В useCalendarGridLogic
getDirectionEntriesForDate(day, directionId) // ❌ 2 параметра

// В CalendarDirectionRow
getDirectionEntriesForDate(userId, directionId, day) // ❌ 3 параметра, другой порядок
```

**Решение:**
```typescript
// Теперь везде одинаково
getDirectionEntriesForDate(userId, directionId, day) // ✅ 3 параметра, правильный порядок
```

### Фильтрация записей

**Логика фильтрации:**
1. Сначала фильтруем по `userId` (чтобы показать только записи текущего пользователя)
2. Затем фильтруем по `directionId` (чтобы показать только записи для этого направления)
3. Затем фильтруем по `date` (чтобы показать только записи за этот день)

**В коде:**
```typescript
entries.filter(
  (entry) =>
    entry.userId === userId &&        // 1. По пользователю
    entry.date === date &&            // 2. По дате
    entry.directionId === directionId // 3. По направлению
)
```

### Обратная совместимость

**Для случаев, когда `userId` не передан:**
```typescript
const effectiveUserId = userId || entries[0]?.userId || "";
```

**Это работает потому что:**
- Если `userId` передан явно - используем его
- Если нет - берем из первой записи (все записи уже отфильтрованы по userId благодаря селектору)
- Если записей нет - используем пустую строку (не будет совпадений, что правильно)

---

## 🔍 Отладка (если что-то не работает)

Если часы все еще не отображаются, проверьте:

1. **Проверьте что `userId` передается:**
   ```typescript
   console.log('userId:', userId);
   console.log('entries:', entries);
   ```

2. **Проверьте что записи имеют `userId`:**
   ```typescript
   console.log('entries with userId:', entries.filter(e => e.userId));
   ```

3. **Проверьте что `getDirectionEntriesForDate` вызывается правильно:**
   ```typescript
   const result = getDirectionEntriesForDate(userId, directionId, day);
   console.log('Filtered entries:', result);
   ```

---

## 🚀 Следующие шаги

После этого этапа можно переходить к:
- **День 3:** Унификация компонента таблицы (единый CalendarGrid)
- **День 4:** Исправление прав доступа к табам

---

## ⚠️ Важные замечания

1. **Все изменения обратно совместимы** - старые компоненты, которые не передают `userId`, будут работать (userId берется из entries)
2. **Фильтрация теперь более точная** - записи фильтруются по userId, что предотвращает показ чужих записей
3. **Производительность** - фильтрация происходит при каждом рендере, но это нормально для небольших объемов данных

---

## 📚 Полезные ссылки

- [React Function Components](https://react.dev/learn/your-first-component)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Function Signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html)

