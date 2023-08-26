import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { DataComponent } from "app/data/data.component";
import { ShareModule } from "app/share/share.module";
import { UtilsModule } from "shared/utils/utils.module";
import { PenyakitService } from "app/services/penyakit.service";
import { HttpClientModule } from "@angular/common/http";
import { DynamicTableComponent } from "app/dynamic-table/dynamic-table.component";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectButtonModule } from "primeng/selectbutton";
import { HasilClusteringComponent } from "app/hasil-clustering/hasil-clustering.component";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { PetaComponent } from "app/peta/peta.component";
import { ChartModule } from "primeng/chart";
import { GrafikComponent } from "app/grafik/grafik.component";
import { PrediksiComponent } from "app/prediksi/prediksi.component";
import { PieClusterComponent } from "app/pie-cluster/pie-cluster.component";
import { AccordionModule } from "primeng/accordion";
import { InputDataComponent } from "app/input-data/input-data.component";
import { BulkInputComponent } from "app/bulk-input/bulk-input.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { UserService } from "app/services/user.service";
import { CalendarModule } from "primeng/calendar";
import { SliderModule } from "primeng/slider";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { ProgressBarModule } from "primeng/progressbar";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from "primeng/fileupload";
import { ToolbarModule } from "primeng/toolbar";
import { RatingModule } from "primeng/rating";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ToastModule } from "primeng/toast";
import { UserComponent } from "app/master/user/user.component";
import { RoleComponent } from "app/master/role/role.component";
import { DynamicPieComponent } from "app/dynamic-pie/dynamic-pie.component";
import { MatDatepickerModule } from "@angular/material/datepicker";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ShareModule,
    UtilsModule,
    MultiSelectModule,
    SelectButtonModule,
    TableModule,
    TooltipModule,
    ChartModule,
    AccordionModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    FormsModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    MatDatepickerModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    DataComponent,
    DynamicTableComponent,
    HasilClusteringComponent,
    PetaComponent,
    GrafikComponent,
    PrediksiComponent,
    PieClusterComponent,
    BulkInputComponent,
    InputDataComponent,
    UserComponent,
    RoleComponent,
    DynamicPieComponent,
  ],
  providers: [
    PenyakitService,
    UserService,
    MessageService,
    ConfirmationService,
  ],
})
export class AdminLayoutModule {}
