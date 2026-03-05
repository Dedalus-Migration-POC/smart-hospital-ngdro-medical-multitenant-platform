import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InitializeAppService } from "./service";
import { SmartHospitalState } from "../../store/reducers";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, concatMap, map, switchMap, take } from 'rxjs/operators'
import { of } from 'rxjs'
import * as InitializeAppActions from './actions'


@Injectable()
export class InitializeAppEffects {

    private actions$ = inject(Actions);
    private initializeAppService = inject(InitializeAppService);

    fetchAppConfig$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InitializeAppActions.fetchAppConfig),
            switchMap((action) =>
                this.initializeAppService.fetchAppConfig().pipe(
                    map((data) => {
                        return InitializeAppActions.fetchAppConfigSuccess({ data })
                    }),
                    catchError((error) => {
                        return of(InitializeAppActions.fetchAppConfigFailure({ error }))
                    }),
                ),
            ),
        ),
    )

}