import { Injectable, inject } from '@angular/core';
import { getApps } from 'firebase/app';
import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
  isSupported,
  RemoteConfig,
} from 'firebase/remote-config';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { update } from './remote-config.actions';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private store = inject(Store<SmartHospitalState>);
  private remoteConfig: RemoteConfig | null = null;

  public async initialize() {
    if (getApps().length === 0) {
      return;
    }

    const appConfig = await firstValueFrom(this.store.select(selectAppConfig));
    const keys = appConfig?.firebaseConfig?.keys ?? [];
    if (!keys.length) {
      return;
    }

    const supported = await isSupported();
    if (!supported) {
      return;
    }

    this.remoteConfig ??= getRemoteConfig();
    this.remoteConfig.settings.minimumFetchIntervalMillis = 0;

    try {
      await fetchAndActivate(this.remoteConfig);
      keys.forEach((path: string) => {
        try {
          const config = getString(this.remoteConfig as RemoteConfig, path);
          const value =
            config.startsWith('{') || config.startsWith('[') ? JSON.parse(config) : config;
          this.store.dispatch(update({ path, value }));
        } catch (e) {
          console.error('Error while retrieving remote config at key: ', path, 'Error: ', e);
        }
      });
    } catch (e) {
      console.error('Error while activating Firebase Remote Config', e);
    }
  }
}
