// src/lib/hooks/types.ts
// Типы для возвращаемых значений хуков

/**
 * Тип для статистики пользователя (totals)
 * Возвращается из getUserTotals
 */
export interface UserTotals {
  regular: number;
  overtime: number;
  specialDays: {
    vacation: number;
    sick: number;
    dayoff: number;
  };
}

/**
 * Тип для разбивки по направлениям (directionBreakdown)
 * Возвращается из getUserDirectionBreakdown
 */
export type UserDirectionBreakdown = Map<
  string, // directionId
  { regular: number; overtime: number }
>;
