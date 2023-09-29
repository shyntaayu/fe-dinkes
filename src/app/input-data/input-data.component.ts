import {
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
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
import { CookieService } from "ngx-cookie-service";
import { MainService } from "app/services/main.service";
import { finalize } from "rxjs/operators";

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
  tahunNumber;
  loading = false;
  user;
  constructor(
    private fb: FormBuilder,
    injector: Injector,
    private cookieService: CookieService,
    private _mainService: MainService
  ) {
    super(injector);
    this.profileForm = this.fb.group({
      penyakit: ["", Validators.required],
      jumlah: ["", Validators.required],
      tahun: [moment(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.tahun = moment();
    this.user = JSON.parse(this.cookieService.get("userMe"));
  }

  onSubmit(): void {
    let model = this.profileForm.value;
    model.daerah_id = this.user.daerah_id;
    model.tahun = this.tahunNumber;
    this.loading = true;

    this._mainService
      .createInput(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data) => {
          let result = data;
          this.showMessage(data.message, undefined, "success");
          this.profileForm.reset();
        },
        (error) => {
          this.showMessage("Eror!", error.message, "error");
        }
      );
  }

  @ViewChild("picker", { static: false })
  private picker!: MatDatepicker<Date>;

  chosenYearHandler(ev, input) {
    let { _d } = ev;

    this.tahun = _d;
    this.tahunNumber = ev._i.year;
    console.log("chosenYearHandler", this.tahunNumber);
    this.picker.close();
  }
}
