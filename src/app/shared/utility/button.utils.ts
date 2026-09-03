// Merge e stili per ButtonStyle: la config del componente sovrascrive il tema generale,
// le proprietà mancanti ereditano dal tema.
import {
  BootstrapButtonStyle,
  BorderConfig,
  ButtonStyle,
  CustomButtonStyle,
  TextStyle,
} from '../models/shared_model';
import { getSpacingStyles, getTextColorHex } from './style.utils';
import { mergeTextStyles } from './text.utils';

function mergeBorderConfig(theme?: BorderConfig, action?: BorderConfig): BorderConfig | undefined {
  if (!theme && !action) return undefined;

  return {
    ...theme,
    ...action,
    color: { ...theme?.color, ...action?.color },
  };
}

export function mergeButtonStyle(theme?: ButtonStyle, config?: ButtonStyle): ButtonStyle {
  const mode = config?.mode ?? theme?.mode ?? 'bootstrap';

  const common = {
    textStyle: mergeTextStyles(theme?.textStyle, config?.textStyle),
    border: mergeBorderConfig(theme?.border, config?.border),
    padding: { ...theme?.padding, ...config?.padding },
    size: { ...theme?.size, ...config?.size },
    radius: config?.radius ?? theme?.radius,
    icon: config?.icon ?? theme?.icon,
  };

  if (mode === 'custom') {
    return { ...theme, ...config, mode: 'custom', ...common } as CustomButtonStyle;
  }

  return {
    ...theme,
    ...config,
    mode: 'bootstrap',
    ...common,
    palette:
      config?.mode === 'bootstrap'
        ? config.palette
        : theme?.mode === 'bootstrap'
          ? theme.palette
          : undefined,
  } as BootstrapButtonStyle;
}

export function getButtonPaletteClasses(config: ButtonStyle): string[] {
  if (config.mode === 'custom') return [];

  const palette = config.palette ?? 'primary';
  return [config.outline ? `btn-outline-${palette}` : `btn-${palette}`];
}

// In modalita bootstrap il colore del testo e gestito dalla classe btn-*.
export function getButtonTextStyle(config: ButtonStyle): TextStyle {
  return config.mode === 'custom' ? (config.textStyle ?? {}) : { ...config.textStyle, color: undefined };
}

export function getButtonStyles(config: ButtonStyle): Record<string, string> {
  const styles: Record<string, string> = {};
  const borderColor = getTextColorHex({ color: config.border?.color });

  if (borderColor) styles['--bs-btn-border-color'] = borderColor;
  if (config.border?.width) styles['border-width'] = config.border.width;
  if (config.border?.style) styles['border-style'] = config.border.style;
  if (config.radius) styles['border-radius'] = config.radius;

  Object.assign(styles, getSpacingStyles(config.padding, 'padding'));

  if (config.size?.width) styles['width'] = config.size.width;
  if (config.size?.height) styles['height'] = config.size.height;
  if (config.size?.minWidth) styles['min-width'] = config.size.minWidth;
  if (config.size?.minHeight) styles['min-height'] = config.size.minHeight;

  if (config.mode === 'custom') {
    const textColor = getTextColorHex(config.textStyle);
    if (textColor) styles['--bs-btn-color'] = textColor;
  }

  return styles;
}
