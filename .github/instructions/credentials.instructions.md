---
description: "Use when changing local credentials login, OTP confirmation, registration, authentication effects, mocks or tests in the multitenant application."
applyTo: "src/app/pages/auth/components/credentials/**"
---

# Credentials Workflow

- Preserve the contracts in [actions](../../src/app/pages/auth/components/credentials/state/credentials.actions.ts), [reducer](../../src/app/pages/auth/components/credentials/state/credentials.reducer.ts) and [effects](../../src/app/pages/auth/components/credentials/state/credentials.effects.ts).
- The login effect returns `loginSuccess` for a successful first step. If the response has `step: 'OTP'`, it also dispatches `loginOtpRequired` before emitting that success. Do not remove this dispatch or let `loginSuccess` overwrite the pending OTP challenge.
- `loginSuccess` is not proof of completed authentication: use `loginStep === 'AUTHENTICATED'`. Preserve separate login and confirmation loading/success/error fields and the distinct `confirmLoginSuccess` action.
- An invalid OTP (`406`, including the backend body's `errorCode`) clears the challenge/deadline and returns to credentials. Other confirmation failures retain the pending challenge for retry.
- Keep login and OTP confirmation notifications separate. A `404` from `login-confirm` must not display the login's user-not-found message; use the dedicated OTP translation keys.
- `expires_in` is a duration in seconds. Compute an absolute deadline once when the response arrives and use the existing countdown's `expireOn` contract; do not restart the countdown on confirmation retries.
- Keep passwords, entered OTP values and access/refresh/ID tokens out of the reducer state. Clear sensitive form values when changing steps; authentication tokens are managed by backend cookies.
- Use relative `/oauth/api/wrapper/...` URLs. [HttpHeadersInterceptor](../../src/app/interceptors/http-headers-interceptor.ts) provides `Accept-Language`; same-origin login calls do not need an explicit `withCredentials` option.
- Inspect [CredentialsService](../../src/app/pages/auth/components/credentials/state/credentials.service.ts) and [mocks](../../src/app/pages/auth/components/credentials/state/credentials.mock.ts) before testing: `IS_DEV` can replace requests. Do not send a mock challenge code to a real confirmation endpoint and claim a successful end-to-end test.
- Mock only the endpoints requested by the user. For real HTTP unit tests, disable the mock on the test instance, not in application code; for UI simulations, clearly distinguish browser mocks from backend verification.
- Reuse [InputComponent](../../src/app/components/input/input.component.ts) for credentials/OTP fields. Keep OTP as a string so leading zeroes survive.
- Extend [state tests](../../src/app/pages/auth/components/credentials/state/credentials.spec.ts) and [component tests](../../src/app/pages/auth/components/credentials/login/credentials-login.spec.ts) rather than creating duplicate suites. Follow their `provideMockStore`, translation and design-kit mock setup.