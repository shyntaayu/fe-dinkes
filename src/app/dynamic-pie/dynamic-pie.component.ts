import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-dynamic-pie",
  templateUrl: "./dynamic-pie.component.html",
  styleUrls: ["./dynamic-pie.component.css"],
})
export class DynamicPieComponent implements OnInit, AfterViewInit {
  @Input() dataDynamic: any;
  title = "";
  tahun = "";
  dataTable = [];
  dataPieAr = [];
  tahunAr = [];
  chartOptions: any;
  pilihanText = "";

  constructor() {
    // console.log(dataPie);
    // if (dataPie) {
    //   this.dataPieAr = JSON.parse(dataPie);
    //   const clusters = {};
    //   this.dataPieAr.forEach((item) => {
    //     const clusterLevel = item.clusterLevel;
    //     clusters[clusterLevel] = clusters[clusterLevel]
    //       ? clusters[clusterLevel] + 1
    //       : 1;
    //   });
    //   const sorted_object = Object.keys(clusters)
    //     .sort()
    //     .reduce((acc, key) => {
    //       acc[key] = clusters[key];
    //       return acc;
    //     }, {});

    //   const labels = Object.keys(sorted_object);
    //   const dataValues = Object.values(sorted_object);

    //   const restructuredData = {
    //     labels: labels,
    //     datasets: [
    //       {
    //         data: dataValues,
    //         backgroundColor: ["#66BB6A", "#FFA726", "#b22222"],
    //         hoverBackgroundColor: ["#81C784", "#FFB74D", "#d83131"],
    //       },
    //     ],
    //   };
    //   this.data = restructuredData;
    // }
    console.log("dataPieAr", this.dataDynamic);
  }
  ngAfterViewInit(): void {}

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

  getTahun(dataArray) {
    const years = dataArray.reduce((result, obj) => {
      const objKeys = Object.keys(obj).filter((key) => /^\d{4}$/.test(key));
      result.push(...objKeys);
      return result;
    }, []);

    const uniqueYears = [...new Set(years)];

    return uniqueYears;
  }
}
