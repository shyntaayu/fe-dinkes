import { Component, Injector, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppComponentBase } from "shared/app-component-base";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from "moment";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY",
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

@Component({
  selector: "app-input-data",
  templateUrl: "./input-data.component.html",
  styleUrls: ["./input-data.component.css"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class InputDataComponent extends AppComponentBase implements OnInit {
  profileForm: FormGroup;
  penyakit;
  tahun;
  jumlah;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
    this.profileForm = this.fb.group({
      penyakit: ["", Validators.required],
      jumlah: ["", Validators.required],
      tahun: [moment(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.tahun = moment();
  }

  onSubmit(): void {}

  chosenYearHandler(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.tahun;
    ctrlValue.year(normalizedMonthAndYear.year());
    this.tahun.setValue(ctrlValue);
    datepicker.close();
    console.log(this.tahun, ctrlValue);
  }
}
