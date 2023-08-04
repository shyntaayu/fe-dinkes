import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleComponent } from "./role/role.component";
import { UserComponent } from "./user/user.component";

const routes: Routes = [
  {
    path: "user",
    component: UserComponent,
  },
  {
    path: "role",
    component: RoleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
