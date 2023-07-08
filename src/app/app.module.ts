import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { UtilsModule } from "shared/utils/utils.module";
import { AppConfig } from "./model/app-config";
import { AppConfigService } from "shared/appconfig.service";
import { LoginComponent } from "./login/login.component";

export function initializerFn(jsonAppConfigService: AppConfigService) {
  return () => {
    return jsonAppConfigService.loadConfig();
  };
}
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    UtilsModule,
  ],
  declarations: [AppComponent, AdminLayoutComponent, LoginComponent],
  providers: [
    {
      provide: AppConfig,
      deps: [HttpClient],
      useExisting: AppConfigService,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: initializerFn,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
