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
import * as XLSX from "xlsx";

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
  selector: "app-bulk-input",
  templateUrl: "./bulk-input.component.html",
  styleUrls: ["./bulk-input.component.css"],
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
export class BulkInputComponent extends AppComponentBase implements OnInit {
  profileForm: FormGroup;
  penyakit;
  tahun;
  dataExcel = [];
  tahunNumber;
  loading = false;
  user;
  sheetToJson: string;
  invalid: boolean = true;
  constructor(
    private fb: FormBuilder,
    injector: Injector,
    private cookieService: CookieService,
    private _mainService: MainService
  ) {
    super(injector);
    this.profileForm = this.fb.group({
      penyakit: ["", Validators.required],
      tahun: ["", Validators.required],
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.tahun = moment();
    this.user = JSON.parse(this.cookieService.get("userMe"));
  }

  onSubmit(): void {
    let model = this.dataExcel;

    this._mainService
      .createBulk(model)
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

  downloadTemplate() {
    const url = "/assets/template/template-daerah.xls";
    window.open(url, "_blank");
  }

  loadFile(event) {
    // console.log(event);
    if (this.r_nilai_TF(event)) {
      this.dataExcel = [];
      let reader = new FileReader();
      reader.addEventListener("load", this.loadTable, false);
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  loadTable: (any) => void = (event: any): void => {
    let data = event.target.result;
    let workbook = XLSX.read(data, {
      type: "binary",
    });
    this.sheetToJson = this.to_json(workbook);
    console.log(this.sheetToJson);
    var first_sheet_name = workbook.SheetNames[0];
    let jsonObject = JSON.parse(this.sheetToJson)[first_sheet_name];
    console.log(jsonObject);
    if (this.r_nilai_TF(jsonObject)) {
      if (jsonObject[0].length == 2) {
        let records = [];
        for (var i = 1; i < jsonObject.length; i++) {
          let message = "-";
          let isValid: boolean;
          if (this.r_nilai_TF(jsonObject[i].length)) {
            if (!this.r_nilai_TF(jsonObject[i][0])) {
              isValid = false;
              message = "Kabupaten/kota diperlukan";
            } else if (
              !this.r_nilai_TF(jsonObject[i][1]) ||
              isNaN(jsonObject[i][1]) ||
              Number(jsonObject[i][1]) <= 0
            ) {
              isValid = false;
              message = "Jumlah diperlukan";
            }
            var dataUpload = {
              daerah_name: jsonObject[i][0] ? jsonObject[i][0] : "-",
              jumlah: isNaN(jsonObject[i][1]) ? 0 : Number(jsonObject[i][1]),
              penyakit: this.penyakit,
              tahun: this.tahunNumber,
            };
            records.push(dataUpload);
          }
        }
        this.dataExcel = records;
        console.log(records);
        if (records.length < 1)
          this.showMessage(
            "Silakan isi format excel terlebih dahulu",
            null,
            "error"
          );
        else this.invalid = false;
      } else {
        this.invalid = true;
        this.showMessage(
          "Excel tidak sesuai dengan format yang telah disediakan",
          null,
          "error"
        );
      }
    } else {
      this.showMessage(
        "Jenis file salah atau excel tidak sesuai dengan format yang telah disediakan",
        null,
        "error"
      );
    }
  };

  to_json(workbook: any) {
    var result = {};
    workbook.SheetNames.forEach(function (sheetName) {
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });
      if (roa.length) result[sheetName] = roa;
    });
    return JSON.stringify(result);
  }
}
