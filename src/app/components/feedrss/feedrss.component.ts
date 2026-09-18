import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Observable,
  catchError,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
// import { BadgeComponent } from '../badge/badge.component'
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectFirebaseObject } from 'src/app/store/remote-config/remote-config.selectors';
import { FeedCategoryConfig, FeedItem, FeedRssConnectionData, FeedRssProps } from './model';
import { LanguageService } from 'src/app/initialize/state/services/language.service';
import { ImageBlock } from '../image-block/image-block';
import { Link } from '../link/link';
import { getTextClasses } from 'src/app/shared/utility/text.utils';
import { getFlexLayoutClasses, getSizeStyles } from 'src/app/shared/utility/layout.utils';
import {
  getBackgroundPaletteClass,
  getBackgroundStyles,
  getBorderStyles,
  getSpacingStyles,
  getTextStyles,
} from 'src/app/shared/utility/style.utils';
import { LinkConfig } from 'src/app/shared/models/shared_model';

@Component({
  selector: 'app-feedrss',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule, ImageBlock, Link],
  templateUrl: './feedrss.component.html',
  styleUrls: ['./feedrss.component.scss'],
})
export class FeedrssComponent {
  readonly config = input<FeedRssProps | null>(null);

  private readonly http = inject(HttpClient);
  private readonly store = inject(Store<SmartHospitalState>);
  private langService = inject(LanguageService);

  private readonly config$ = toObservable(this.config);
  lang = this.langService.lang;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getSizeStyles = getSizeStyles;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getBackgroundPaletteClass = getBackgroundPaletteClass;
  protected readonly getBackgroundStyles = getBackgroundStyles;
  protected readonly getBorderStyles = getBorderStyles;
  protected readonly getSpacingStyles = getSpacingStyles;

  getCategoryBackgroundClass(category?: FeedCategoryConfig): string {
    if (category?.isBadge === false) {
      return '';
    }

    return category?.background ? getBackgroundPaletteClass(category) : 'bg-secondary';
  }

  getReadMoreLink(item: FeedItem, readMore: FeedRssProps['itemConfig']['readMore']): LinkConfig {
    return {
      text: readMore.text,
      url: item.link,
      external: true,
      target: '_blank',
      icon: readMore.icon,
      style: readMore.style,
    };
  }

  readonly feedsRss = toSignal(
    this.getConnectionData$().pipe(switchMap((feedRssConfig) => this.getFeeds(feedRssConfig))),
    { initialValue: [] as FeedItem[] },
  );

  readonly hasFeeds = computed(() => this.feedsRss().length > 0);

  private getConnectionData$(): Observable<FeedRssConnectionData> {
    return this.config$.pipe(
      filter((config): config is FeedRssProps => Boolean(config)),
      switchMap((config) => {
        const connectionData = config.feedRssConnectionData;

        if (connectionData !== 'getFromFirebase') {
          return of(connectionData);
        }

        return this.store.select(selectFirebaseObject('feedRss')).pipe(
          filter((feedRssConfig): feedRssConfig is FeedRssConnectionData => Boolean(feedRssConfig)),
          distinctUntilChanged(
            (prev, curr) =>
              prev.baseUrl === curr.baseUrl &&
              prev.apiKey === curr.apiKey &&
              prev.domainName === curr.domainName,
          ),
          take(1),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getFeedCategories(connectData: FeedRssConnectionData): Observable<unknown> {
    const url = connectData.baseUrl + `categories/rss`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${connectData.apiKey}`,
    });
    const params = new HttpParams().set('domainName', connectData.domainName);

    return this.http.get<unknown>(url, { headers, params }).pipe(
      take(1),
      catchError((error) => {
        console.error('Errore durante il fetch delle categorie RSS:', error);
        return of(null);
      }),
    );
  }

  getFeeds(connectData: FeedRssConnectionData): Observable<FeedItem[]> {
    const url = connectData.baseUrl + `aggregation-items/rss`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${connectData.apiKey}`,
    });
    const params = new HttpParams()
      .set('domainName', connectData.domainName)
      .set('categoryUrl', 'asl-comunica');

    return this.http.get(url, { headers, params, responseType: 'text' }).pipe(
      take(1),
      map((xmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'application/xml');
        const items = Array.from(doc.querySelectorAll('item'));
        return items.map((item) => ({
          title: item.querySelector('title')?.textContent ?? '',
          link: item.querySelector('link')?.textContent ?? '',
          description: item.querySelector('description')?.textContent ?? '',
          pubDate: item.querySelector('pubDate')?.textContent ?? '',
          category: item.querySelector('category')?.textContent ?? '',
        }));
      }),
      catchError((error) => {
        console.error('Errore durante il fetch del feed RSS:', error);
        // Restituiamo array vuoto invece di far crashare lo stream
        return of([] as FeedItem[]);
      }),
    );
  }
}
