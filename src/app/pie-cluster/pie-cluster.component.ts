import { AfterViewInit, Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-pie-cluster",
  templateUrl: "./pie-cluster.component.html",
  styleUrls: ["./pie-cluster.component.css"],
})
export class PieClusterComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit
{
  data: any;

  chartOptions: any;
  title = "";
  tahun = "";
  dataTable = [];
  dataPieAr = [];
  tahunAr = [];
  pilihan;
  pilihanText = "";
  pilihanKet = "";

  constructor(injector: Injector, private router: Router) {
    super(injector);
    let dataPie = localStorage.getItem("dataPie");
    this.title = localStorage.getItem("titlePie");
    this.pilihan = localStorage.getItem("pilihan");
    console.log(this.pilihan, typeof this.pilihan, dataPie, typeof dataPie);
    this.pilihanText = this.pilihan == 1 ? "Penyakit" : "Daerah";
    this.pilihanKet = this.pilihan == 2 ? "Penyakit" : "Daerah";
    if (dataPie != undefined && dataPie != null && dataPie != "") {
      this.dataPieAr = JSON.parse(dataPie);
      const clusters = {};
      this.dataPieAr.forEach((item) => {
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
      this.data = restructuredData;
    } else {
      this.showMessage(
        "Informasi",
        "Silakan ke menu clustering dulu untuk melihat diagram cluster",
        "info"
      );
    }
    console.log("dataPieAr", this.data);
  }
  ngAfterViewInit(): void {
    // localStorage.removeItem("dataPie");
    // localStorage.removeItem("titlePie");
  }

  ngOnInit(): void {
    this.mappingDataTable();
    this.tahunAr = this.getTahun(this.dataPieAr);
    this.tahun = this.tahunAr.join(", ");
  }

  mappingDataTable() {
    const restructuredData = [];
    const clusters = {};

    this.dataPieAr.forEach((item) => {
      const cluster = item.cluster;
      const daerahName =
        this.pilihan == 1 ? item.daerah_name : item.penyakit_name;

      if (!clusters[cluster]) {
        clusters[cluster] = {
          cluster: item.clusterLevel,
          list_daerah: [{ daerah_name: daerahName }],
        };
      } else {
        clusters[cluster].list_daerah.push({ daerah_name: daerahName });
      }
    });

    Object.values(clusters).forEach((cluster) => {
      restructuredData.push(cluster);
    });

    this.dataTable = restructuredData;
    console.log(this.dataTable);
  }

  getTahun(dataArray) {
    const years = dataArray.reduce((result, obj) => {
      const objKeys = Object.keys(obj).filter((key) => /^\d{4}$/.test(key));
      result.push(...objKeys);
      return result;
    }, []);

    const uniqueYears = [...new Set(years)];

    return uniqueYears;
  }

  toClustering() {
    this.router.navigate(["data"]);
  }
}
