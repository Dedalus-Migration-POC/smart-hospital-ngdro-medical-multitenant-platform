import { HealthcareUnit } from 'src/app/pages/bookings/booking-a4h/state/model';

const SELECTED_STRUTTURA_STORAGE_KEY = 'booking-a4h:selectedStruttura';

export function loadSelectedStruttura(): HealthcareUnit | null {
  const storage = getLocalStorage();
  if (!storage) return null;

  const value = storage.getItem(SELECTED_STRUTTURA_STORAGE_KEY);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<HealthcareUnit>;
    return typeof parsed.id === 'string' && typeof parsed.name === 'string'
      ? (parsed as HealthcareUnit)
      : null;
  } catch {
    storage.removeItem(SELECTED_STRUTTURA_STORAGE_KEY);
    return null;
  }
}

export function saveSelectedStruttura(struttura: HealthcareUnit): void {
  getLocalStorage()?.setItem(SELECTED_STRUTTURA_STORAGE_KEY, JSON.stringify(struttura));
}

export function clearSelectedStrutturaStorage(): void {
  getLocalStorage()?.removeItem(SELECTED_STRUTTURA_STORAGE_KEY);
}

function getLocalStorage(): Storage | null {
  return typeof localStorage === 'undefined' ? null : localStorage;
}
