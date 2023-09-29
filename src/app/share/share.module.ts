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
import { DaerahDdlComponent } from "./daerah-ddl.component";
import { TahunDdlComponent } from "./tahun-ddl.component";
import { TahunSingleDdlComponent } from "./tahun-single-ddl.component";
import { DropdownModule } from "primeng/dropdown";
import { PenyakitSingleDdlComponent } from "./penyakit-single-ddl.component";

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
    DropdownModule,
  ],
  declarations: [
    PenyakitDdlComponent,
    PilihanDdlComponent,
    ControlMessageComponent,
    FormControlStyleComponent,
    DaerahDdlComponent,
    TahunDdlComponent,
    TahunSingleDdlComponent,
    PenyakitSingleDdlComponent,
  ],
  exports: [
    PenyakitDdlComponent,
    PilihanDdlComponent,
    ControlMessageComponent,
    FormControlStyleComponent,
    DaerahDdlComponent,
    TahunDdlComponent,
    TahunSingleDdlComponent,
    PenyakitSingleDdlComponent,
  ],
})
export class ShareModule {}
