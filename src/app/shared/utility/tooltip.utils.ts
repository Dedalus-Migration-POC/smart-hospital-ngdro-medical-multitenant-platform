import { LocalizedText } from '../models/shared_model';

export interface TooltipConfig {
  enabled: boolean;
  tooltipLabel?: LocalizedText;
  tooltipClassName?: string;
}

export function getTooltipLabel(
  tooltip?: TooltipConfig,
  lang?: keyof LocalizedText,
): string | null {
  if (!tooltip?.enabled || !lang) return null;

  return tooltip.tooltipLabel?.[lang] ?? null;
}

export function getTooltipClassName(tooltip?: TooltipConfig): string | null {
  if (!tooltip?.enabled) return null;

  return tooltip.tooltipClassName ?? null;
}
