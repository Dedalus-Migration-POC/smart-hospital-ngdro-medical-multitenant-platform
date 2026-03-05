import { createAction, props } from '@ngrx/store'

export const fetchAppConfig = createAction(
    '[InitializeApp] Fetch AppConfig',
)
export const fetchAppConfigSuccess = createAction(
    '[InitializeApp] Fetch AppConfig Success',
    props<{ data: any }>(),
)
export const fetchAppConfigFailure = createAction(
    '[InitializeApp] Fetch AppConfig Failure',
    props<{ error: any }>(),
)
