import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-grafik",
  templateUrl: "./grafik.component.html",
  styleUrls: ["./grafik.component.css"],
})
export class GrafikComponent implements OnInit, AfterViewInit {
  data = {
    labels: [],
    datasets: [],
  };
  title = "";
  pilihan;
  pilihanText = "";
  tahun = "";
  tahunAr = [];
  dataLineAr = [];
  daerah = [];
  dataTemp = {};

  constructor() {
    let dataLine = localStorage.getItem("dataLine");
    this.title = localStorage.getItem("titleLine");
    this.pilihan = localStorage.getItem("pilihan");
    this.pilihanText = this.pilihan == 1 ? "Penyakit" : "Daerah";
    if (dataLine != undefined || dataLine != null || dataLine != "") {
      this.dataLineAr = [];
      this.dataLineAr = JSON.parse(dataLine);
      this.data.labels = Object.keys(this.dataLineAr[0]).filter(
        (key) => key != "daerah_name"
      );

      const restructuredData = this.dataLineAr.map((item) => {
        const label = this.pilihan == 1 ? item.daerah_name : item.penyakit_name;
        const values = Object.keys(item)
          .filter((key) => key !== "daerah_name")
          .map((key) => item[key]);
        return { label, data: values };
      });

      this.data.datasets = restructuredData;
      this.dataTemp = JSON.parse(JSON.stringify(this.data));
    }
    console.log("dataLineAr", this.data);
  }
  ngAfterViewInit(): void {
    // localStorage.removeItem("dataLine");
    // localStorage.removeItem("titleLine");
  }

  ngOnInit(): void {
    this.tahunAr = this.getTahun(this.dataLineAr);
    this.tahun = this.tahunAr.join(", ");
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

  filterAll() {
    console.log("daerah", this.daerah);
    let dataT = JSON.parse(JSON.stringify(this.data));
    let filteredDatasets = dataT["datasets"].filter((dataset) =>
      this.daerah.includes(dataset.label)
    );

    // Create a new object with the filtered datasets
    let filteredData = {
      labels: this.dataTemp["labels"],
      datasets: filteredDatasets,
    };
    this.dataTemp = { ...filteredData };
    console.log("aaa", filteredData);
  }
}
