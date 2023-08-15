import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { DataComponent } from "app/data/data.component";
import { HasilClusteringComponent } from "app/hasil-clustering/hasil-clustering.component";
import { GrafikComponent } from "app/grafik/grafik.component";
import { PrediksiComponent } from "app/prediksi/prediksi.component";
import { PieClusterComponent } from "app/pie-cluster/pie-cluster.component";
import { InputDataComponent } from "app/input-data/input-data.component";
import { BulkInputComponent } from "app/bulk-input/bulk-input.component";
import { AuthGuard } from "app/helpers/auth.guard";
import { UserComponent } from "app/master/user/user.component";
import { RoleComponent } from "app/master/role/role.component";

export const AdminLayoutRoutes: Routes = [
  // {
  //   path: '',
  //   children: [ {
  //     path: 'dashboard',
  //     component: DashboardComponent
  // }]}, {
  // path: '',
  // children: [ {
  //   path: 'userprofile',
  //   component: UserProfileComponent
  // }]
  // }, {
  //   path: '',
  //   children: [ {
  //     path: 'icons',
  //     component: IconsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'notifications',
  //         component: NotificationsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'maps',
  //         component: MapsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'typography',
  //         component: TypographyComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'upgrade',
  //         component: UpgradeComponent
  //     }]
  // }
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  { path: "user-profile", component: UserProfileComponent },
  { path: "table-list", component: TableListComponent },
  { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "upgrade", component: UpgradeComponent },
  {
    path: "data",
    component: DataComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  {
    path: "hasil",
    component: HasilClusteringComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  {
    path: "grafik",
    component: GrafikComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  {
    path: "prediksi",
    component: PrediksiComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  {
    path: "diagram",
    component: PieClusterComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  {
    path: "input",
    component: InputDataComponent,
    canActivate: [AuthGuard],
    data: { permission: [1, 2] },
  },
  {
    path: "upload-bulk",
    component: BulkInputComponent,
    canActivate: [AuthGuard],
    data: { permission: [1] },
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { permission: [1] },
  },
  {
    path: "role",
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: { permission: [1] },
  },
];
