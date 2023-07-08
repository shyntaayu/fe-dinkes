import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pie-cluster",
  templateUrl: "./pie-cluster.component.html",
  styleUrls: ["./pie-cluster.component.css"],
})
export class PieClusterComponent implements OnInit, AfterViewInit {
  data: any;

  chartOptions: any;
  title = "";
  dataTable = [];
  dataPieAr = [];

  constructor() {
    let dataPie = localStorage.getItem("dataPie");
    this.title = localStorage.getItem("titlePie");
    if (dataPie != undefined || dataPie != null || dataPie != "") {
      this.dataPieAr = JSON.parse(dataPie);
      const clusters = {};

      this.dataPieAr.forEach((item) => {
        const clusterLevel = item.clusterLevel;
        clusters[clusterLevel] = clusters[clusterLevel]
          ? clusters[clusterLevel] + 1
          : 1;
      });

      const labels = Object.keys(clusters);
      const dataValues = Object.values(clusters);

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
    }
    console.log("dataPieAr", this.data);
  }
  ngAfterViewInit(): void {
    // localStorage.removeItem("dataPie");
    // localStorage.removeItem("titlePie");
  }

  ngOnInit(): void {
    this.mappingDataTable();
  }

  mappingDataTable() {
    const restructuredData = [];
    const clusters = {};

    this.dataPieAr.forEach((item) => {
      const cluster = item.cluster;
      const daerahName = item.daerah_name;

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
}
