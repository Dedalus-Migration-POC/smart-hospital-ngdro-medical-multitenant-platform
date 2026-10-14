import { LocalizedText } from '../models/shared_model';

export interface TooltipConfig {
  enabled: boolean;
  tooltipLabel?: LocalizedText;
  tooltipClassName?: string;
}

export function getTooltipLabel(
  tooltip?: TooltipConfig,
  translate: (key: string) => string = (key) => key,
): string | null {
  if (!tooltip?.enabled || !tooltip.tooltipLabel) return null;

  return translate(tooltip.tooltipLabel);
}

export function getTooltipClassName(tooltip?: TooltipConfig): string | null {
  if (!tooltip?.enabled) return null;

  return tooltip.tooltipClassName ?? null;
}
