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
  pilihan = 1;
  restructuredDataPie = [];
  restructuredDataPieTemp = [];
  loadingPie = false;

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
    console.log("pilihan----", this.pilihan);
    const clonedListPenyakit = this.listPenyakit.slice();
    let filteredData = [];
    if (this.pilihan == 1)
      filteredData = this.filterByPenyakit(clonedListPenyakit);
    if (this.pilihan == 2)
      filteredData = this.filterByDaerah(clonedListPenyakit);
    if (this.pilihan == 3) {
      debugger;
      let data = this.restructuredDataPieTemp.slice();
      filteredData = this.filterByTahun(data);
      this.restructuredDataPie = filteredData;
    }

    if (this.pilihan != 3) this.listPenyakitTemp = filteredData;
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
        (result) => {
          let res = result["data"];
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

          if (this.pilihan != 3) {
            this.listPenyakitTemp[index].list_table = res;
            this.listPenyakitTemp[index].iterasi = result["iterations"];
            this.listPenyakitTemp = [...this.listPenyakitTemp];
          } else {
            this.restructuredDataPie.map((restructured) => {
              if (restructured.tahun == param.tahun) {
                restructured.list_penyakit[param.idx].list_cluster = res;

                const clusters = {};
                res.forEach((item) => {
                  const clusterLevel = item.clusterLevel;
                  clusters[clusterLevel] = clusters[clusterLevel]
                    ? clusters[clusterLevel] + 1
                    : 1;
                });
                const sorted_object = Object.keys(clusters)
                  .sort()
                  .reduce((acc, key) => {
                    acc[key] = clusters[key];
                    return acc;
                  }, {});

                const labels = Object.keys(sorted_object);
                const dataValues = Object.values(sorted_object);

                const restructuredData = {
                  labels: labels,
                  datasets: [
                    {
                      data: dataValues,
                      backgroundColor: ["#66BB6A", "#FFA726", "#b22222"],
                      hoverBackgroundColor: ["#81C784", "#FFB74D", "#d83131"],
                    },
                  ],
                };
                restructured.list_penyakit[param.idx].data_pie =
                  restructuredData;

                // list-datatable
                const restructuredDataT = [];
                const clustersT = {};

                res.forEach((item) => {
                  const cluster = item.cluster;
                  const daerahName = item.daerah_name;

                  if (!clustersT[cluster]) {
                    clustersT[cluster] = {
                      cluster: item.clusterLevel,
                      list_daerah: [{ daerah_name: daerahName }],
                    };
                  } else {
                    clustersT[cluster].list_daerah.push({
                      daerah_name: daerahName,
                    });
                  }
                });

                Object.values(clustersT).forEach((cluster) => {
                  restructuredDataT.push(cluster);
                });

                restructured.list_penyakit[param.idx].data_table =
                  restructuredDataT;
              }
            });
          }

          console.log("listPenyakit", this.listPenyakitTemp);
          console.log("listPie", this.restructuredDataPie);
          this.restructuredDataPieTemp = this.restructuredDataPie.slice();
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

  filterByPenyakit(clonedListPenyakit) {
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
            this.tahun.forEach((year) => {
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
  filterByDaerah(clonedListPenyakit) {
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
            this.tahun.forEach((year) => {
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
    this.loadingPie = true;
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

          let a = this.filterByPenyakit(mappedArray);
          this.listPenyakit = a;
          this.listPenyakitTemp = a;

          this.restructuredDataPie = [];

          mappedArray.forEach((item) => {
            item.list_table.forEach((row) => {
              Object.keys(row).forEach((year) => {
                if (year !== "daerah_name") {
                  let existingYearEntry = this.restructuredDataPie.find(
                    (entry) => entry.tahun === year
                  );

                  if (!existingYearEntry) {
                    existingYearEntry = { tahun: year, list_penyakit: [] };
                    this.restructuredDataPie.push(existingYearEntry);
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

          console.log(this.restructuredDataPie);

          this.restructuredDataPie.map((restructured) => {
            restructured.list_penyakit.map((p, i) => {
              let param = {
                data: p.list_table,
                idx: i,
                penyakit_name: p.penyakit_name,
                tahun: restructured.tahun,
              };
              this.clusterProcess(param);
              this.loadingPie = false;
            });
          });
        },
        (error) => {
          this.showMessage("Eror!", error.message, "error");
        }
      );
  }

  filterByTahun(clonedListPenyakit) {
    console.log(this.penyakit);
    const filtered = clonedListPenyakit
      .filter((item) => {
        return this.tahun.includes(item.tahun);
      })
      .map((item) => {
        item.list_penyakit = item.list_penyakit.filter((a) =>
          this.penyakit.includes(a.penyakit_name)
        );
        return item;
      });
    console.log("filtered----", filtered);
    return filtered;
  }
}
