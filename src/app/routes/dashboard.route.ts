import {Routes} from "@angular/router";
import {DashboardLayoutComponent} from "../layouts/dashboard-layout/dashboard-layout.component";
import {MusicListComponent} from "../dashboard/music-list/music-list.component";

export const DashboardRoute: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: MusicListComponent
      }
    ]
  },
];
