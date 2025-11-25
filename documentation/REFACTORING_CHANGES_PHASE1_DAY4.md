# Изменения: Фаза 1, День 4 - Исправление прав доступа к табам

## 📋 Описание проблемы

**Проблема:** 
- `activeTab` не использовался в `App.tsx` (был вызов `setActiveTab`, но переменная не объявлена)
- При переключении между пользователями с разными ролями табы оставались доступными
- Неправильное отображение табов по ролям:
  - Employee: табы вообще не показывались
  - Manager: показывались "Мои часы" и "Часы команды" ✅
  - Admin: показывались "Мои часы", "Часы команды", "Справочники", "Инициализация" ❌ (должно быть без "Часы команды")

**Требования:**
- Employee: только "Мои часы"
- Manager: "Мои часы", "Часы команды"
- Admin: "Мои часы", "Справочники", "Инициализация" (БЕЗ "Часы команды")

**Решение:** Создана утилита для определения доступных табов по ролям и исправлена логика в `App.tsx`.

---

## 🔧 Внесенные изменения

### 1. Создан новый файл: `src/lib/utils/rolePermissions.ts`

**Что это:**
- Утилиты для работы с правами доступа по ролям
- Централизованная логика определения доступных табов
- Функции для работы с табами и путями

**Основные функции:**
- `getAvailableTabs(role)` - получить доступные табы для роли ⭐ **ГЛАВНАЯ**
- `isTabAvailable(role, tab)` - проверить доступность таба
- `getTabPath(tab)` - получить путь для таба
- `getActiveTabFromPath(pathname)` - определить активный таб по пути

**Код:**
```typescript
export function getAvailableTabs(role: UserRole): TabType[] {
  switch (role) {
    case "employee":
      return ["my-time"];
    case "manager":
      return ["my-time", "team-time"];
    case "admin":
      return ["my-time", "directory", "init"]; // ✅ БЕЗ "team-time"
    default:
      return ["my-time"];
  }
}
```

**Объяснение для Vue разработчика:**
- В Vue это было бы: `const availableTabs = computed(() => getAvailableTabs(user.role))`
- В React это функция, которая вызывается при рендере компонента

---

### 2. Обновлен: `src/app/App.tsx`

**Что изменилось:**
- ✅ Убран неиспользуемый `useState` для `activeTab`
- ✅ Используется `useLocation` из react-router-dom для получения текущего пути
- ✅ Используется `getAvailableTabs` для определения доступных табов
- ✅ Используется `getActiveTabFromPath` для определения активного таба
- ✅ Табы показываются для всех ролей (но с разными наборами)
- ✅ Убрана жестко закодированная логика показа табов
- ✅ Динамическое отображение табов на основе доступных

**Было:**
```typescript
// ❌ Неиспользуемый useState
const [activeTab, setActiveTab] = useState("");

// ❌ Жестко закодированная логика
{currentUser.role === "manager" || currentUser.role === "admin" ? (
  <Tabs>
    <TabsTrigger value="my-time">Мои часы</TabsTrigger>
    <TabsTrigger value="team-time">Часы команды</TabsTrigger>
    {currentUser.role === "admin" && (
      <>
        <TabsTrigger value="directory">Справочники</TabsTrigger>
        <TabsTrigger value="init">Инициализация</TabsTrigger>
      </>
    )}
  </Tabs>
) : null}
```

**Стало:**
```typescript
// ✅ Используем утилиту для получения доступных табов
const availableTabs = getAvailableTabs(currentUser.role);
const activeTab = getActiveTabFromPath(location.pathname);

// ✅ Динамическое отображение табов
{availableTabs.length > 0 && (
  <Tabs value={activeTab} onValueChange={handleTabChange}>
    <TabsList>
      {availableTabs.map((tab) => {
        const Icon = getTabIcon(tab);
        return (
          <TabsTrigger key={tab} value={tab}>
            <Icon className="w-4 h-4 mr-2" />
            {getTabLabel(tab)}
          </TabsTrigger>
        );
      })}
    </TabsList>
  </Tabs>
)}
```

**Объяснение для Vue разработчика:**
- В Vue это было бы: `v-for="tab in availableTabs" :key="tab"`
- В React используется `map` для создания массива элементов

---

## ✅ Результат

После этих изменений:

1. ✅ **Правильные табы для каждой роли:**
   - Employee: только "Мои часы"
   - Manager: "Мои часы", "Часы команды"
   - Admin: "Мои часы", "Справочники", "Инициализация" (БЕЗ "Часы команды")

2. ✅ **Табы показываются для всех ролей** - не только для manager и admin

3. ✅ **Активный таб определяется правильно** - по текущему пути в URL

4. ✅ **При переключении пользователей** табы обновляются автоматически

5. ✅ **Централизованная логика** - все правила доступа в одном месте

---

## 🧪 Как проверить

1. **Войдите как Employee:**
   - Должен быть виден только таб "Мои часы"
   - Другие табы не должны отображаться

2. **Войдите как Manager:**
   - Должны быть видны табы: "Мои часы", "Часы команды"
   - Табы "Справочники" и "Инициализация" не должны отображаться

3. **Войдите как Admin:**
   - Должны быть видны табы: "Мои часы", "Справочники", "Инициализация"
   - Таб "Часы команды" НЕ должен отображаться ✅

4. **Переключите пользователя:**
   - Используйте селектор в правом верхнем углу
   - Табы должны обновляться автоматически в зависимости от роли

5. **Проверьте навигацию:**
   - Клик по табу должен переводить на правильную страницу
   - Активный таб должен подсвечиваться

---

## 📝 Технические детали

### Определение активного таба (для Vue разработчика)

**В Vue:**
```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = computed(() => {
  if (route.path === '/directory') return 'directory'
  if (route.path === '/init') return 'init'
  if (route.path === '/team-time') return 'team-time'
  return 'my-time'
})
</script>
```

**В React:**
```typescript
import { useLocation } from 'react-router-dom'

const location = useLocation()
const activeTab = getActiveTabFromPath(location.pathname)
// или можно использовать useMemo для мемоизации
```

### Динамическое отображение табов

**Логика:**
1. Получаем доступные табы для роли через `getAvailableTabs`
2. Маппим их в компоненты `TabsTrigger`
3. Каждый таб получает свою иконку и название

**В коде:**
```typescript
{availableTabs.map((tab) => {
  const Icon = getTabIcon(tab);
  return (
    <TabsTrigger key={tab} value={tab}>
      <Icon className="w-4 h-4 mr-2" />
      {getTabLabel(tab)}
    </TabsTrigger>
  );
})}
```

### Централизация логики

**Преимущества:**
- Все правила доступа в одном месте (`rolePermissions.ts`)
- Легко изменить права доступа - нужно править только один файл
- Легко тестировать - можно написать unit-тесты для функций
- Легко расширять - можно добавить новые роли или табы

---

## 🔍 Отладка (если что-то не работает)

Если табы не отображаются или отображаются неправильно:

1. **Проверьте роль пользователя:**
   ```typescript
   console.log('Current user role:', currentUser.role);
   ```

2. **Проверьте доступные табы:**
   ```typescript
   console.log('Available tabs:', getAvailableTabs(currentUser.role));
   ```

3. **Проверьте активный таб:**
   ```typescript
   console.log('Active tab:', activeTab);
   console.log('Current path:', location.pathname);
   ```

4. **Проверьте что табы рендерятся:**
   ```typescript
   console.log('Tabs to render:', availableTabs);
   ```

---

## 🚀 Следующие шаги

После этого этапа завершена **Фаза 1** (критические баги). Можно переходить к:
- **Фаза 2:** Унификация типов и исправление типизации
- **Фаза 3:** Создание слоя сервисов

---

## ⚠️ Важные замечания

1. **Обратная совместимость** - старые пользователи продолжат работать, но с правильными табами
2. **Безопасность** - права доступа проверяются на клиенте, но для production нужно добавить проверку на сервере
3. **Расширяемость** - легко добавить новые роли или табы, просто обновив `getAvailableTabs`

---

## 📚 Полезные ссылки

- [React Router useLocation](https://reactrouter.com/en/main/hooks/use-location)
- [TypeScript Enums and Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [React Conditional Rendering](https://react.dev/learn/conditional-rendering)



