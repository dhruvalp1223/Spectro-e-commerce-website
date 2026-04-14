import { Component, DestroyRef, inject, OnInit, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { DefaultLayoutService } from './layout/default-layout/default-layout.service';
import { DOCUMENT } from '@angular/common';
import { CommonService } from './shared/common.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'Build Your XRF – Custom XRF Analyzer Solutions';

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);
  readonly #document = inject(DOCUMENT);
  constructor(private defaultLayoutService: DefaultLayoutService,
        public commonService: CommonService,
  ) {


    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {
    this.getGeneralSetting();
    this.#router.events.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();

      
  }

  getGeneralSetting() {
    this.defaultLayoutService.getGeneralSetting().subscribe((Response: any) => {
      if (Response.data.faviconIcon) {
        const fullFaviconUrl = this.commonService.rootData.uploadsUrl + Response.data.faviconIcon;
        this.setFavicon(fullFaviconUrl);
      }
      console.log(Response.data.faviconIcon);
    }, error => {
      console.error('Error fetching favicon:', error);
    });
  }
  
  setFavicon(faviconUrl: string): void {
    let link = this.#document.getElementById('dynamic-favicon') as HTMLLinkElement;
  
    if (!link) {
      link = this.#document.createElement('link');
      link.id = 'dynamic-favicon';
      link.rel = 'icon';
      link.type = 'image/x-icon';
      this.#document.head.appendChild(link);
    }
  
    link.href = faviconUrl; // ✅ Set full URL for favicon
  }
  
}
