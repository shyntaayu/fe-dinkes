import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MainService } from "app/services/main.service";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"],
})
export class DataComponent extends AppComponentBase implements OnInit {
  profileForm: FormGroup;
  loading = false;
  listPenyakit = [];
  listPenyakitTemp = [];
  penyakit;
  baris;
  kolom;

  constructor(
    private fb: FormBuilder,
    private _mainService: MainService,
    injector: Injector
  ) {
    super(injector);
    this.profileForm = this.fb.group({
      penyakit: ["", Validators.required],
      baris: ["", Validators.required],
      kolom: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.getListPenyakit();
  }

  onSubmit() {
    console.log(this.profileForm.value);
    this.getListPenyakit(this.profileForm.value);
  }

  getListPenyakit(param?) {
    let model = param;
    this.loading = true;
    this._mainService
      .getMain("penyakit", "daerah", "tahun")
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data) => {
          this.listPenyakit = [];
          let result = data;
          let hasil = result
            .map((item) => {
              const result = [];
              item.list_baris.forEach((daerah) => {
                const obj = {
                  penyakit_name: item.penyakit_name,
                  daerah_name: daerah.daerah_name,
                };
                daerah.list_kolom.forEach((tahun) => {
                  obj[tahun.tahun] = tahun.jumlah;
                });
                result.push(obj);
              });
              return result;
            })
            .flat();
          this.listPenyakit = hasil;
          this.listPenyakitTemp = hasil;
          console.log(this.listPenyakit);
        },
        (error) => {
          this.showMessage("Eror!", error.message, "error");
        }
      );
  }

  filterPenyakit(param) {
    console.log(param);
    // Clone the array using slice()
    const clonedListPenyakit = this.listPenyakit.slice();

    // Filter the cloned array
    const filteredListPenyakit = clonedListPenyakit.filter(
      (penyakit) => penyakit.penyakit_name == param
    );
    this.listPenyakitTemp = filteredListPenyakit;
  }
}
