import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { TahunService } from "app/services/tahun.service";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-prediksi",
  templateUrl: "./prediksi.component.html",
  styleUrls: ["./prediksi.component.css"],
})
export class PrediksiComponent extends AppComponentBase implements OnInit {
  profileForm: FormGroup;
  loading = false;
  listPenyakit = [];
  listPenyakitTemp = [];
  penyakit = [];
  daerah = [];
  tahun = [];
  tahunTemp = [];
  pilihan = 1;
  tahunMulai;
  tahunAkhir;

  constructor(
    private fb: FormBuilder,
    private _mainService: MainService,
    private _tahunService: TahunService,
    private _router: Router,
    injector: Injector
  ) {
    super(injector);
    this.profileForm = this.fb.group({
      penyakit: ["", Validators.required],
      daerah: ["", Validators.required],
      tahunMulai: ["", Validators.required],
      tahunAkhir: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    this.getListPenyakit();
    this.getTahun();
  }
  onSubmit() {
    console.log(this.profileForm.value);
    this.getListPenyakit(this.profileForm.value);
  }

  resetFilter() {
    this.tahun = [];
    this.daerah = [];
    this.penyakit = [];
  }

  getListPenyakit(param?) {
    this.pilihan = 1;
    this.resetFilter();
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
    console.log("tahunTemp---", this.tahunTemp);
    let tahun = ["2017", "2018", "2019", "2020", "2021"];
    const startIndex = tahun.indexOf(this.tahunMulai);
    if (startIndex !== -1) {
      tahun.splice(0, startIndex);
    }
    console.log("tahun----", tahun);
    const clonedListPenyakit = this.listPenyakit.slice();
    let filteredData = [];
    if (this.pilihan == 1)
      filteredData = this.filterByPenyakit(clonedListPenyakit, tahun);
    if (this.pilihan == 2)
      filteredData = this.filterByDaerah(clonedListPenyakit, tahun);
    this.listPenyakitTemp = filteredData;
    console.log("filter", filteredData);
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
          let index = 0;
          if (this.pilihan == 1)
            index = this.listPenyakitTemp.findIndex(
              (e) => e.penyakit_name == param.penyakit_name
            );
          if (this.pilihan == 2)
            index = this.listPenyakitTemp.findIndex(
              (e) => e.daerah_name == param.daerah_name
            );
          this.listPenyakitTemp[index].list_table = res;
          // this.listPenyakitTemp = this.listPenyakit;
          // this.listPenyakit = [...this.listPenyakit];
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

  getListDaerah(param?) {
    this.pilihan = 2;
    this.resetFilter();
    let model = param;
    this.loading = true;
    this._mainService
      .getMain("daerah", "penyakit", "tahun")
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data) => {
          this.listPenyakit = [];
          let result = data;

          let mappedArray = result.map((item) => {
            let mappedItem = {
              daerah_name: item.daerah_name,
              list_table: item.list_baris.map((daerah) => {
                let mappedDaerah = {
                  penyakit_name: daerah.penyakit_name,
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

  filterByPenyakit(clonedListPenyakit, tahun) {
    const filtered = clonedListPenyakit
      .map((item) => {
        const filteredListTable = item.list_table
          .filter(
            (row) =>
              this.daerah.includes(row.daerah_name) &&
              this.penyakit.includes(item.penyakit_name)
          )
          .map((row) => {
            const filteredRow = { daerah_name: row.daerah_name };
            tahun.forEach((year) => {
              if (row.hasOwnProperty(year)) {
                filteredRow[year] = row[year];
              }
            });
            return filteredRow;
          });

        if (filteredListTable.length > 0) {
          return {
            penyakit_name: item.penyakit_name,
            list_table: filteredListTable,
          };
        }

        return null;
      })
      .filter((item) => item !== null);
    return filtered;
  }
  filterByDaerah(clonedListPenyakit, tahun) {
    const filtered = clonedListPenyakit
      .map((item) => {
        const filteredListTable = item.list_table
          .filter(
            (row) =>
              this.daerah.includes(item.daerah_name) &&
              this.penyakit.includes(row.penyakit_name)
          )
          .map((row) => {
            const filteredRow = { penyakit_name: row.penyakit_name };
            tahun.forEach((year) => {
              if (row.hasOwnProperty(year)) {
                filteredRow[year] = row[year];
              }
            });
            return filteredRow;
          });

        if (filteredListTable.length > 0) {
          return {
            daerah_name: item.daerah_name,
            list_table: filteredListTable,
          };
        }

        return null;
      })
      .filter((item) => item !== null);
    return filtered;
  }

  getListTahun(param?) {
    this.pilihan = 3;
    this.resetFilter();
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
          console.log(result);
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

          let a = this.filterByPenyakit(mappedArray, this.tahun);
          this.listPenyakit = a;
          this.listPenyakitTemp = a;

          let restructuredData = [];

          mappedArray.forEach((item) => {
            item.list_table.forEach((row) => {
              Object.keys(row).forEach((year) => {
                if (year !== "daerah_name") {
                  let existingYearEntry = restructuredData.find(
                    (entry) => entry.tahun === year
                  );

                  if (!existingYearEntry) {
                    existingYearEntry = { tahun: year, list_penyakit: [] };
                    restructuredData.push(existingYearEntry);
                  }

                  let existingPenyakitEntry =
                    existingYearEntry.list_penyakit.find(
                      (entry) => entry.penyakit_name === item.penyakit_name
                    );

                  if (!existingPenyakitEntry) {
                    existingPenyakitEntry = {
                      penyakit_name: item.penyakit_name,
                      list_table: [],
                    };
                    existingYearEntry.list_penyakit.push(existingPenyakitEntry);
                  }

                  const newRow = {
                    [year]: row[year],
                    daerah_name: row.daerah_name,
                  };
                  existingPenyakitEntry.list_table.push(newRow);
                }
              });
            });
          });

          console.log(restructuredData);
          // this.clusterProcess(restructuredData)
          // console.log(this.listPenyakit);
        },
        (error) => {
          this.showMessage("Eror!", error.message, "error");
        }
      );
  }

  prediksiProcess(param) {
    console.log(param);
    if (!this.tahunAkhir) {
      this.showMessage(
        "Peringatan",
        "Silahkan pilih prediksi sampai tahun",
        "warning"
      );
      return false;
    }
    // Get all the keys (years) from the object
    const keys = Object.keys(param.data[0]);

    // Filter out keys that are not years (assuming years are numeric)
    const years = keys.filter((key) => !isNaN(+key));
    if (years.length < 3) {
      this.showMessage(
        "Peringatan",
        "Silahkan pilih tahun mulai minimal 3 tahun terakhir",
        "warning"
      );
      return false;
    }
    this.loading = true;
    // Find the maximum year (last year)
    const lastYear = years.reduce(
      (maxYear, year) => Math.max(maxYear, parseInt(year)),
      0
    );

    let tahunAwal = lastYear + 1;
    let data = {
      data: param.data,
      tahunAkhir: this.tahunAkhir,
      tahunAwal: tahunAwal,
    };
    this._mainService
      .processPrediksi(data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (res) => {
          console.log("hasil----", res);
          let index = 0;
          if (this.pilihan == 1)
            index = this.listPenyakitTemp.findIndex(
              (e) => e.penyakit_name == param.penyakit_name
            );
          if (this.pilihan == 2)
            index = this.listPenyakitTemp.findIndex(
              (e) => e.daerah_name == param.daerah_name
            );
          this.listPenyakitTemp[index].list_table = res;
          // this.listPenyakitTemp = this.listPenyakit;
          // this.listPenyakit = [...this.listPenyakit];
          this.listPenyakitTemp = [...this.listPenyakitTemp];
          if (res.status == 0) {
            this.showMessage("Eror!", res.message, "error");
          } else {
            this.showMessage(
              "Sukses!",
              "Berhasil menghitung prediksi",
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
    localStorage.setItem("dataLine", JSON.stringify(param.data));
    localStorage.setItem("titleLine", param.title);
    this._router.navigate(["grafik"]);
  }

  getTahun() {
    this._tahunService.getAllTahun().subscribe(
      (result) => {
        this.tahunTemp = result.map((obj) => obj.tahun);
        this.tahun = this.tahunTemp;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }
}
