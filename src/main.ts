import {bootstrapApplication, BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {importProvidersFrom} from "@angular/core";
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig
} from "@angular/router";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AppRoutes} from "./app/routes/main.route";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {SpotifyInterceptor} from "./app/core/interceptors/spotify.interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(AppRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
      }), withRouterConfig({
        paramsInheritanceStrategy: 'always',
        onSameUrlNavigation: 'reload',
      })),
    provideHttpClient(
      withInterceptors([SpotifyInterceptor])
    ),
    provideAnimations(),
  ]
}).catch(err => console.error(err));

