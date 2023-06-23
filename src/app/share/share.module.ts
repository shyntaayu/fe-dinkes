import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PenyakitDdlComponent } from "./penyakit-ddl.component";
import { PilihanDdlComponent } from "./pilihan-ddl.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilsModule } from "shared/utils/utils.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormControlStyleComponent } from "./form-control-style.component";
import { ControlMessageComponent } from "./control-message.component";
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    MultiSelectModule,
  ],
  declarations: [
    PenyakitDdlComponent,
    PilihanDdlComponent,
    ControlMessageComponent,
    FormControlStyleComponent,
  ],
  exports: [
    PenyakitDdlComponent,
    PilihanDdlComponent,
    ControlMessageComponent,
    FormControlStyleComponent,
  ],
})
export class ShareModule {}
