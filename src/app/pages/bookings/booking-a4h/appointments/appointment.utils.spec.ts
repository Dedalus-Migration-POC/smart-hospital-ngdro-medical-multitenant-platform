import { describe, expect, it, vi } from 'vitest';
import { AppointmentDto, LockCause } from './state/model';
import { checkInHintCode } from './appointment.utils';

function makeAppointment(overrides: Partial<AppointmentDto> = {}): AppointmentDto {
  return {
    id: 'appointment-1',
    location: { name: 'Clinic' },
    lockCause: 'privacy',
    checkInStatus: 'NOT_ALLOWED',
    paymentStatus: 'PAID',
    scheduledOn: '2025-02-10T18:00:00.000Z',
    description: 'Appointment',
    contract: 'SOLV',
    ...overrides,
  };
}

describe('checkInHintCode', () => {
  it.each([
    ['too-early', 'TOO-EARLY'],
    ['privacy', 'PRIVACY'],
    ['mobile-payment-not-allowed', 'MOBILE-PAYMENT-NOT-ALLOWED'],
    ['user-not-verified', 'USER-NOT-VERIFIED'],
    ['unknown', 'UNKNOWN'],
    ['too-late', 'TOO-LATE'],
  ] as const)('maps lockCause %s to hint code %s', (lockCause, expectedCode) => {
    expect(checkInHintCode(makeAppointment({ lockCause }), 24)).toBe(expectedCode);
  });

  it('returns no hint for completed appointments', () => {
    expect(
      checkInHintCode(makeAppointment({ checkInStatus: 'DONE', lockCause: 'privacy' }), 24),
    ).toBeNull();
  });

  it('returns a to-pay hint within the check-in window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-10T10:00:00.000Z'));

    expect(
      checkInHintCode(
        makeAppointment({ lockCause: 'to-pay', scheduledOn: '2025-02-10T18:00:00.000Z' }),
        24,
      ),
    ).toBe('TO-PAY');

    vi.useRealTimers();
  });

  it('returns no to-pay hint outside the check-in window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-10T10:00:00.000Z'));

    expect(
      checkInHintCode(
        makeAppointment({ lockCause: 'to-pay', scheduledOn: '2025-02-12T18:00:00.000Z' }),
        24,
      ),
    ).toBeNull();

    vi.useRealTimers();
  });

  it('returns a fallback code for an unrecognized lock cause', () => {
    expect(checkInHintCode(makeAppointment({ lockCause: 'unexpected' as LockCause }), 24)).toBe(
      'UNKNOWN',
    );
  });

  it('returns NOT-EDITABLE for appointments that cannot be changed in details mode', () => {
    expect(
      checkInHintCode(
        makeAppointment({
          lockCause: 'privacy',
          paymentStatus: 'PAID',
          scheduledOn: '2025-02-12T18:00:00.000Z',
        }),
        24,
        true,
      ),
    ).toBe('NOT-EDITABLE');
  });
});
