export const DEFAULT_PLATFORM_NAME = '信扬供应链服务平台'

export function normalizePlatformName(value?: string | null) {
  return value?.trim() || DEFAULT_PLATFORM_NAME
}
