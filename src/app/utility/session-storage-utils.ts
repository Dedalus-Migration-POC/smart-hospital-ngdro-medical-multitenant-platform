export enum SessionStorageKey {
  nre = 'bookings.nre',
  bookingStep = 'bookings.bookingStep',
  availability = 'bookings.availability',
  bookingType = 'bookings.bookingType',
  privateBooking = 'bookings.privateBooking',
  privateDoctor = 'bookings.privateDoctor',
}

export class SessionStorageUtils {
  static getItem(key: SessionStorageKey): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static setItem(key: SessionStorageKey, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // no-op: storage can be unavailable in restricted browser contexts
    }
  }

  static removeItem(key: SessionStorageKey): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // no-op: storage can be unavailable in restricted browser contexts
    }
  }
}
