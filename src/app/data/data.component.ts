import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
  penyakit = [];
  daerah = [];
  tahun = [];

  constructor(
    private fb: FormBuilder,
    private _mainService: MainService,
    private _router: Router,
    injector: Injector
  ) {
    super(injector);
    this.profileForm = this.fb.group({
      penyakit: ["", Validators.required],
      daerah: ["", Validators.required],
      tahun: ["", Validators.required],
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
          // start flat semua
          // let hasil = result
          //   .map((item) => {
          //     const result = [];
          //     item.list_baris.forEach((daerah) => {
          //       const obj = {
          //         penyakit_name: item.penyakit_name,
          //         daerah_name: daerah.daerah_name,
          //       };
          //       daerah.list_kolom.forEach((tahun) => {
          //         obj[tahun.tahun] = tahun.jumlah;
          //       });
          //       result.push(obj);
          //     });
          //     return result;
          //   })
          //   .flat();
          //end flat

          let mappedArray = result.map((item) => {
            let mappedItem = {
              penyakit_name: item.penyakit_name,
              list_table: item.list_baris.map((daerah) => {
                let mappedDaerah = {
                  daerah_name: daerah.daerah_name,
                };
                daerah.list_kolom.forEach((tahun) => {
                  mappedDaerah[tahun.tahun] = tahun.jumlah;
                });
                return mappedDaerah;
              }),
            };
            return mappedItem;
          });
          this.listPenyakit = mappedArray;
          this.listPenyakitTemp = mappedArray;
          console.log(this.listPenyakit);
        },
        (error) => {
          this.showMessage("Eror!", error.message, "error");
        }
      );
  }

  filterAll() {
    // Clone the array using slice()
    console.log(this.tahun);
    const clonedListPenyakit = this.listPenyakit.slice();
    const filteredData = clonedListPenyakit.map((item) => {
      const filteredTable = item.list_table.filter((row) => {
        return (
          // this.daerah.includes(row.daerah_name) &&
          // this.penyakit.includes(item.penyakit_name) &&
          Object.keys(row)
            .filter((key) => this.tahun.includes(key))
            .reduce((obj, key) => {
              obj[key] = obj[key];
              return obj;
            }, {})
        );
      });

      return { penyakit_name: item.penyakit_name, list_table: filteredTable };
    });

    // const filteredData = clonedListPenyakit.map((item) => ({
    //   penyakit_name: item.penyakit_name,
    //   list_table: item.list_table.filter((data) => {
    //     Object.keys(data)
    //       .filter((key) => this.tahun.includes(key))
    //       .reduce((obj, key) => {
    //         obj[key] = obj[key];
    //         return obj;
    //       }, {});
    //     // this.daerah.includes(obj.daerah_name) &&
    //     // this.penyakit.includes(item.penyakit_name)
    //   }),
    // }));

    this.listPenyakitTemp = filteredData;
    console.log("filter", this.listPenyakitTemp);
  }

  clusterProcess(param) {
    console.log(param);
    this.loading = true;
    this._mainService
      .processClustering(param.data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (res) => {
          console.log("hasil----", res);
          this.listPenyakit[param.idx].list_table = res;
          this.listPenyakitTemp = this.listPenyakit;
          this.listPenyakit = [...this.listPenyakit];
          this.listPenyakitTemp = [...this.listPenyakitTemp];

          console.log("listPenyakit", this.listPenyakitTemp);
          if (res.status == 0) {
            this.showMessage("Eror!", res.message, "error");
          } else {
            this.showMessage(
              "Sukses!",
              "Berhasil menghitung cluster",
              "success"
            );
          }
        },
        (error) => {
          this.showMessage("Eror!", error, "error");
        }
      );
  }

  diagramProcess(param) {
    console.log(param);
    this.loading = true;
    localStorage.setItem("dataPie", JSON.stringify(param.data));
    localStorage.setItem("titlePie", param.title);
    this._router.navigate(["diagram"]);
  }
}
