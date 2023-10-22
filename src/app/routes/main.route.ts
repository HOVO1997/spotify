import {Routes} from "@angular/router";
export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard.route').then((m) => m.DashboardRoute),
  },
];
