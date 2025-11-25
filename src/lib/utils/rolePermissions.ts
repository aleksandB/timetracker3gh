// src/lib/utils/rolePermissions.ts
// Утилиты для работы с правами доступа по ролям

import { UserRole } from "../../entities/user/types";

/**
 * Типы табов в приложении
 */
export type TabType = "my-time" | "team-time" | "directory" | "init";

/**
 * Определяет доступные табы для роли пользователя
 * 
 * Правила:
 * - Employee: только "Мои часы"
 * - Manager: "Мои часы", "Часы команды"
 * - Admin: "Мои часы", "Справочники", "Инициализация" (БЕЗ "Часы команды")
 * 
 * В Vue это было бы computed свойство или функция в composable
 */
export function getAvailableTabs(role: UserRole): TabType[] {
  switch (role) {
    case "employee":
      return ["my-time"];
    case "manager":
      return ["my-time", "team-time"];
    case "admin":
      return ["my-time", "directory", "init"];
    default:
      return ["my-time"];
  }
}

/**
 * Проверяет, доступен ли таб для роли
 */
export function isTabAvailable(role: UserRole, tab: TabType): boolean {
  return getAvailableTabs(role).includes(tab);
}

/**
 * Получает путь для таба
 */
export function getTabPath(tab: TabType): string {
  switch (tab) {
    case "my-time":
      return "/";
    case "team-time":
      return "/team-time";
    case "directory":
      return "/directory";
    case "init":
      return "/init";
    default:
      return "/";
  }
}

/**
 * Определяет активный таб по текущему пути
 */
export function getActiveTabFromPath(pathname: string): TabType {
  if (pathname === "/directory") return "directory";
  if (pathname === "/init") return "init";
  if (pathname === "/team-time") return "team-time";
  return "my-time"; // по умолчанию
}

