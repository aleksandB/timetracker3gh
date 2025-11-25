# Изменения: Фаза 1, День 1 - Исправление фильтрации по пользователям

## 📋 Описание проблемы

**Проблема:** Все записи времени хранились в одном массиве без разделения по пользователям. Когда разные пользователи проставляли часы, они записывались для всех пользователей и отображались у всех.

**Решение:** Добавлена фильтрация записей по `userId` с помощью Redux селекторов и автоматическое добавление `userId` при создании записей.

---

## 🔧 Внесенные изменения

### 1. Создан новый файл: `src/store/selectors/timeEntrySelectors.ts`

**Что это:**
- Селекторы для работы с записями времени (TimeEntry)
- В React/Redux селекторы - это функции, которые извлекают данные из store
- **Аналог в Vue:** computed свойства, которые фильтруют данные

**Основные селекторы:**
- `selectAllTimeEntries` - получить все записи
- `selectTimeEntriesByUserId(userId)` - получить записи конкретного пользователя ⭐ **ГЛАВНЫЙ**
- `selectCurrentUserTimeEntries` - получить записи текущего пользователя
- `selectTimeEntriesByDateAndUser` - получить записи по дате и пользователю
- `selectTimeEntriesByDirectionAndUser` - получить записи по направлению и пользователю

**Код:**
```typescript
// Пример селектора (аналог computed в Vue)
export const selectTimeEntriesByUserId = (userId: string) => {
  return (state: RootState): TimeEntry[] => {
    return state.timeEntries.filter((entry) => entry.userId === userId);
  };
};
```

---

### 2. Обновлен: `src/lib/hooks/useTimeTrackingData.ts`

**Что изменилось:**
- Добавлен обязательный параметр `currentUser: { id: string }`
- Вместо получения всех entries теперь используется селектор для фильтрации

**Было:**
```typescript
// ❌ Брались ВСЕ записи
const entries = useSelector((state: RootState) => state.timeEntries);
```

**Стало:**
```typescript
// ✅ Фильтруются только записи текущего пользователя
const entries = useSelector(selectTimeEntriesByUserId(currentUser.id));
```

**Объяснение для Vue разработчика:**
- В Vue это было бы: `computed(() => allEntries.filter(e => e.userId === currentUser.id))`
- В React используется `useSelector` с селектором, который автоматически пересчитывается при изменении store

---

### 3. Обновлен: `src/lib/hooks/useTimeTracking.ts`

**Что изменилось:**
- Теперь передает `currentUser` в `useTimeTrackingData` для фильтрации
- Также передает `currentUser` в `useTimeEntryManagement` для автоматического добавления userId

**Изменение:**
```typescript
// Передаем currentUser в оба хука
useTimeTrackingData({ initialDate, currentUser });
useTimeEntryManagement({ currentUser });
```

---

### 4. Обновлен: `src/lib/hooks/useTimeEntryManagement.ts`

**Что изменилось:**
- Добавлен обязательный параметр `currentUser: { id: string }`
- Автоматически добавляет `userId` к каждой создаваемой записи
- Автоматически генерирует `id` если его нет
- При обновлении сохраняет `userId` если его нет

**Было:**
```typescript
// ❌ entry мог не иметь userId
const addEntry = (entry: TimeEntry) => {
  dispatch(addTimeEntry(entry));
};
```

**Стало:**
```typescript
// ✅ Всегда добавляем userId и id
const addEntry = useCallback(
  (entry: TimeEntry) => {
    const entryWithUserId: TimeEntry = {
      ...entry,
      id: entry.id || `entry-${Date.now()}-${Math.random()...}`, // Генерируем id
      userId: currentUser.id, // Всегда добавляем userId
    };
    dispatch(addTimeEntry(entryWithUserId));
  },
  [dispatch, currentUser.id]
);
```

**Объяснение для Vue разработчика:**
- В Vue это было бы функция, которая принимает entry и добавляет к нему userId перед сохранением
- В React это хук (composable), который использует `useCallback` для мемоизации функции

---

## ✅ Результат

После этих изменений:

1. ✅ **Записи фильтруются по пользователю** - каждый пользователь видит только свои записи
2. ✅ **userId всегда устанавливается** - при создании записи автоматически добавляется userId текущего пользователя
3. ✅ **id всегда генерируется** - если entry не имеет id, он автоматически генерируется
4. ✅ **Приложение остается работоспособным** - все существующие функции продолжают работать

---

## 🧪 Как проверить

1. **Откройте приложение** и войдите как один пользователь
2. **Добавьте несколько записей времени**
3. **Переключитесь на другого пользователя** (через селектор в правом верхнем углу)
4. **Проверьте календарь** - должны отображаться только записи текущего пользователя
5. **Вернитесь к первому пользователю** - его записи должны остаться на месте

---

## 📝 Технические детали

### Redux селекторы (для Vue разработчика)

В Vue вы бы использовали:
```vue
<script setup>
const allEntries = ref([...])
const currentUserId = ref('user-1')

const userEntries = computed(() => 
  allEntries.value.filter(e => e.userId === currentUserId.value)
)
</script>
```

В React/Redux:
```typescript
// Селектор - это функция, которая извлекает и фильтрует данные
const userEntries = useSelector(selectTimeEntriesByUserId(currentUserId))
// useSelector автоматически подписывается на изменения store
// и пересчитывает значение при изменении state.timeEntries
```

### useCallback (для Vue разработчика)

В Vue вы бы использовали:
```vue
const addEntry = (entry) => {
  const entryWithUserId = { ...entry, userId: currentUser.id }
  // сохранить
}
```

В React:
```typescript
// useCallback мемоизирует функцию, чтобы она не пересоздавалась при каждом рендере
const addEntry = useCallback(
  (entry) => {
    const entryWithUserId = { ...entry, userId: currentUser.id }
    dispatch(addTimeEntry(entryWithUserId))
  },
  [dispatch, currentUser.id] // зависимости - функция пересоздается только если они изменились
)
```

---

## 🚀 Следующие шаги

После этого этапа можно переходить к:
- **День 2:** Исправление бага с выводом часов в таблицах
- **День 3:** Унификация компонента таблицы
- **День 4:** Исправление прав доступа

---

## ⚠️ Важные замечания

1. **Все изменения обратно совместимы** - старые записи без userId будут работать, но новые всегда будут иметь userId
2. **Селекторы оптимизированы** - Redux автоматически кэширует результаты селекторов
3. **Генерация id** - используется комбинация timestamp и random для уникальности

---

## 📚 Полезные ссылки

- [Redux Selectors](https://redux.js.org/usage/deriving-data-selectors)
- [React useCallback](https://react.dev/reference/react/useCallback)
- [React useSelector](https://react-redux.js.org/api/hooks/useselector)

