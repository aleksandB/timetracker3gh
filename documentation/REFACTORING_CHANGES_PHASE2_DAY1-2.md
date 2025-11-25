# Изменения: Фаза 2, День 1-2 - Унификация типов и исправление типизации

## 📋 Описание проблемы

**Проблема:** 
- Было два типа: `User` (используется везде) и `Employee` (в `employeeSlice`, но не используется)
- Использование `any` в 21 месте вместо правильных типов
- TODO комментарии вместо реализации типов
- Слабая типизация в хуках и компонентах

**Решение:** 
1. Удален неиспользуемый `employeeSlice` и `Employee` тип
2. Везде используется единый тип `User`
3. Заменены все `any` на правильные типы
4. Убраны все TODO комментарии

---

## 🔧 Внесенные изменения

### 1. Удалены неиспользуемые файлы

**Удалено:**
- `src/store/slices/employeeSlice.ts` - не использовался, имел другую структуру (firstName, lastName)
- `src/lib/hooks/useDirectoryManagement.ts` - не использовался

**Обновлено:**
- `src/store/index.ts` - убран `employeeSlice` из store

**Причина:** Эти файлы не использовались в приложении. Везде используется `User` из `entities/user/types.ts`.

---

### 2. Создан новый файл: `src/lib/hooks/types.ts`

**Что это:**
- Типы для возвращаемых значений хуков
- Централизованные типы для статистики и разбивки данных

**Типы:**
```typescript
// Тип для статистики пользователя (totals)
export interface UserTotals {
  regular: number;
  overtime: number;
  specialDays: {
    vacation: number;
    sick: number;
    dayoff: number;
  };
}

// Тип для разбивки по направлениям (directionBreakdown)
export type UserDirectionBreakdown = Map<
  string, // directionId
  { regular: number; overtime: number }
>;
```

**Объяснение для Vue разработчика:**
- В Vue это было бы просто интерфейсы/типы в отдельном файле
- В React/TypeScript это то же самое - просто типы для переиспользования

---

### 3. Обновлен: `src/components/features/DirectoryManagement/hooks/useEmployeeManagement.ts`

**Что изменилось:**
- ✅ Добавлен импорт `User`
- ✅ Заменены `any` на `User`
- ✅ Убраны TODO комментарии
- ✅ Исправлена ошибка: `setCurrentUser` → `setCurrentEmployee`

**Было:**
```typescript
// ❌ Нет импорта User, используются any
currentEmployee: User | null; // TODO: Заменить any на EmployeeType
setCurrentEmployee: (user: User | null) => void; // TODO: Заменить any

// ❌ Ошибка: setCurrentUser вместо setCurrentEmployee
setCurrentUser(null);
```

**Стало:**
```typescript
// ✅ Правильный импорт и типы
import { User } from "../../../../entities/user/types";

currentEmployee: User | null; // ✅ Используем User
setCurrentEmployee: (user: User | null) => void; // ✅ Используем User

// ✅ Исправлено
setCurrentEmployee(null);
```

---

### 4. Обновлен: `src/components/features/DirectoryManagement/hooks/useProjectManagement.ts`

**Что изменилось:**
- ✅ Добавлен импорт `Project`
- ✅ Заменены `any` на `Project`
- ✅ Убраны TODO комментарии

**Было:**
```typescript
// ❌ Используются any
currentProject: any | null; // TODO: Заменить any на ProjectType
setCurrentProject: (project: any | null) => void; // TODO: Заменить any

const handleEdit = (project: any) => {
  // TODO: Заменить any
  setCurrentProject(project);
};
```

**Стало:**
```typescript
// ✅ Используем Project
import { Project } from "../../../../entities/project/types";

currentProject: Project | null; // ✅ Используем Project
setCurrentProject: (project: Project | null) => void; // ✅ Используем Project

const handleEdit = (project: Project) => {
  // ✅ Убрали TODO, используем правильный тип
  setCurrentProject(project);
};
```

---

### 5. Обновлен: `src/components/features/DirectoryManagement/ProjectManagementUI.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `Project` и `ProjectType`
- ✅ Заменены `any` на `Project`
- ✅ Исправлен `as any` на `as ProjectType`

**Было:**
```typescript
// ❌ Используются any
currentProject: any | null; // TODO: Заменить any на ProjectType

// ❌ Используется as any
type: value as any,
```

**Стало:**
```typescript
// ✅ Используем Project
import { Project, ProjectType } from "../../../entities/project/types";

currentProject: Project | null; // ✅ Используем Project

// ✅ Используем ProjectType
type: value as ProjectType,
```

---

### 6. Обновлен: `src/components/features/DirectoryManagement/hooks/useDirectionManagement.ts`

**Что изменилось:**
- ✅ Добавлен импорт `Direction`
- ✅ Заменены `any` на `Direction`
- ✅ Убраны TODO комментарии

**Было:**
```typescript
// ❌ Используются any
currentDirection: any | null; // TODO: Заменить any на DirectionType
setCurrentDirection: (direction: any | null) => void; // TODO: Заменить any

const handleEdit = (direction: any) => {
  // TODO: Заменить any
  setCurrentDirection(direction);
};
```

**Стало:**
```typescript
// ✅ Используем Direction
import { Direction } from "../../../../entities/project/types";

currentDirection: Direction | null; // ✅ Используем Direction
setCurrentDirection: (direction: Direction | null) => void; // ✅ Используем Direction

const handleEdit = (direction: Direction) => {
  // ✅ Убрали TODO, используем правильный тип
  setCurrentDirection(direction);
};
```

---

### 7. Обновлен: `src/components/features/DirectoryManagement/DirectionManagementUI.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `Direction` и `DirectionType`
- ✅ Заменены `any` на `Direction`
- ✅ Исправлен `as any` на `as DirectionType`

**Было:**
```typescript
// ❌ Используются any
currentDirection: any | null; // TODO: Заменить any на DirectionType

// ❌ Используется as any
type: value as any,
```

**Стало:**
```typescript
// ✅ Используем Direction
import { Direction, DirectionType } from "../../../entities/project/types";

currentDirection: Direction | null; // ✅ Используем Direction

// ✅ Используем DirectionType
type: value as DirectionType,
```

---

### 8. Обновлен: `src/components/features/DirectoryManagement/index.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `Project` и `Direction`
- ✅ Заменены `any` на правильные типы
- ✅ Исправлен `as any` на правильный тип

**Было:**
```typescript
// ❌ Используются any
const [currentDirection, setCurrentDirection] = useState<any>(null);
const [currentProject, setCurrentProject] = useState<any>(null);

// ❌ Используется as any
onValueChange={(value) => setActiveTab(value as any)}
```

**Стало:**
```typescript
// ✅ Используем правильные типы
import { Project, Direction } from "../../../entities/types";

const [currentDirection, setCurrentDirection] = useState<Direction | null>(null);
const [currentProject, setCurrentProject] = useState<Project | null>(null);

// ✅ Используем правильный тип
onValueChange={(value) => setActiveTab(value as "employees" | "directions" | "projects")}
```

---

### 9. Обновлен: `src/components/features/TeamView/EmployeeSummaryCard.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `UserTotals` и `UserDirectionBreakdown`
- ✅ Заменены `any` на правильные типы

**Было:**
```typescript
// ❌ Используются any
totals: any;
directionBreakdown: any;
```

**Стало:**
```typescript
// ✅ Используем правильные типы
import { UserTotals, UserDirectionBreakdown } from "../../../lib/hooks/types";

totals: UserTotals; // ✅ Используем UserTotals
directionBreakdown: UserDirectionBreakdown; // ✅ Используем UserDirectionBreakdown
```

---

### 10. Обновлен: `src/components/features/TeamView/TeamSummaryView.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `UserTotals` и `UserDirectionBreakdown`
- ✅ Заменены `any` на правильные типы

**Было:**
```typescript
// ❌ Используются any
getUserTotals: (userId: string) => any;
getUserDirectionBreakdown: (userId: string) => any;
```

**Стало:**
```typescript
// ✅ Используем правильные типы
import { UserTotals, UserDirectionBreakdown } from "../../../lib/hooks/types";

getUserTotals: (userId: string) => UserTotals; // ✅ Используем UserTotals
getUserDirectionBreakdown: (userId: string) => UserDirectionBreakdown; // ✅ Используем UserDirectionBreakdown
```

---

### 11. Обновлен: `src/components/features/TeamView/EmployeeDetailedView.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `Project`
- ✅ Заменен `any` на правильный тип

**Было:**
```typescript
// ❌ Используется any
addProject: (project: any) => void;
```

**Стало:**
```typescript
// ✅ Используем Project
import { Project } from "../../../entities/types";

addProject: (project: Omit<Project, "directionIds" | "shortName">) => void; // ✅ Используем Project
```

---

### 12. Обновлен: `src/components/features/TeamView/TeamDashboardView.tsx`

**Что изменилось:**
- ✅ Добавлен импорт `TeamMember`
- ✅ Заменен `any[]` на `TeamMember[]`

**Было:**
```typescript
// ❌ Используется any
teamMembers: any[]; // или TeamMember[]
```

**Стало:**
```typescript
// ✅ Используем TeamMember
import { TeamMember } from "./types";

teamMembers: TeamMember[]; // ✅ Используем TeamMember[]
```

---

### 13. Обновлен: `src/store/slices/initSlice.ts`

**Что изменилось:**
- ✅ Добавлены комментарии о временном использовании `any`
- ⚠️ Оставлены `any` для `dispatch` и `getState` - будут исправлены в Фазе 3 с использованием `createAsyncThunk`

**Причина:** Эти функции будут переделаны в Фазе 3 при создании слоя сервисов.

---

## ✅ Результат

После этих изменений:

1. ✅ **Единый тип User** - везде используется `User` из `entities/user/types.ts`
2. ✅ **Удалены неиспользуемые типы** - `Employee` из `employeeSlice` удален
3. ✅ **Исправлены все `any`** - осталось только 2 в `initSlice` (будут исправлены в Фазе 3)
4. ✅ **Убраны все TODO** - все комментарии заменены на правильные типы
5. ✅ **Строгая типизация** - все компоненты и хуки имеют правильные типы

**Статистика:**
- Было: 21 место с `any`
- Стало: 2 места с `any` (в `initSlice`, будут исправлены в Фазе 3)
- Убрано: 19 `any` ✅

---

## 🧪 Как проверить

1. **Проверьте компиляцию TypeScript:**
   ```bash
   npm run build
   ```
   Не должно быть ошибок типизации

2. **Проверьте работу приложения:**
   - Все функции должны работать как раньше
   - Не должно быть ошибок в консоли

3. **Проверьте автодополнение в IDE:**
   - При работе с `currentProject`, `currentDirection`, `currentEmployee` должны быть подсказки
   - Типы должны определяться автоматически

---

## 📝 Технические детали

### Удаление неиспользуемого кода

**Почему удалили `employeeSlice`:**
- Не использовался в приложении
- Имел другую структуру (firstName, lastName) чем `User` (name)
- Везде используется `User` из `entities/user/types.ts`

**В Vue это было бы:**
- Просто удалили бы неиспользуемый файл
- В React/Redux то же самое - удалили неиспользуемый slice

### Создание типов для хуков

**Почему создали `src/lib/hooks/types.ts`:**
- Централизованное место для типов возвращаемых значений хуков
- Легко переиспользовать в разных компонентах
- Легко поддерживать - изменения в одном месте

**В Vue это было бы:**
```typescript
// types.ts
export interface UserTotals { ... }
export type UserDirectionBreakdown = Map<...>
```

### Замена any на правильные типы

**Примеры замен:**

1. **Project:**
   ```typescript
   // ❌ Было
   currentProject: any | null;
   
   // ✅ Стало
   currentProject: Project | null;
   ```

2. **Direction:**
   ```typescript
   // ❌ Было
   currentDirection: any | null;
   
   // ✅ Стало
   currentDirection: Direction | null;
   ```

3. **UserTotals:**
   ```typescript
   // ❌ Было
   totals: any;
   
   // ✅ Стало
   totals: UserTotals;
   ```

---

## 🔍 Отладка (если что-то не работает)

Если есть ошибки типизации:

1. **Проверьте импорты:**
   ```typescript
   // Убедитесь что все импорты правильные
   import { Project } from "../../../entities/project/types";
   import { User } from "../../../entities/user/types";
   ```

2. **Проверьте типы в IDE:**
   - Наведите курсор на переменную
   - Должен показываться правильный тип

3. **Проверьте компиляцию:**
   ```bash
   npm run build
   ```

---

## 🚀 Следующие шаги

После этого этапа можно переходить к:
- **Фаза 3:** Создание слоя сервисов (где исправим оставшиеся `any` в `initSlice`)

---

## ⚠️ Важные замечания

1. **Обратная совместимость** - все изменения обратно совместимы, функциональность не изменилась
2. **Оставшиеся any** - 2 `any` в `initSlice` оставлены намеренно, будут исправлены в Фазе 3
3. **Типы для хуков** - создан файл `types.ts` для централизованного хранения типов

---

## 📚 Полезные ссылки

- [TypeScript Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)



