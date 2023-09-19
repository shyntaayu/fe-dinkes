import { AfterViewInit, Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-grafik",
  templateUrl: "./grafik.component.html",
  styleUrls: ["./grafik.component.css"],
})
export class GrafikComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit
{
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
  penyakit = [];
  isData = false;

  constructor(injector: Injector) {
    super(injector);
    let dataLine = localStorage.getItem("dataLine");
    this.title = localStorage.getItem("titleLine");
    this.pilihan = localStorage.getItem("pilihan");
    this.pilihanText = this.pilihan == 1 ? "Penyakit" : "Daerah";
    if (dataLine != undefined && dataLine != null && dataLine != "") {
      this.isData = true;
      this.dataLineAr = [];
      this.dataLineAr = JSON.parse(dataLine);

      let labels = Object.keys(this.dataLineAr[0]).filter((key) => {
        return key != (this.pilihan == 2 ? "penyakit_name" : "daerah_name");
      });
      this.data.labels = labels;
      const restructuredData = this.dataLineAr.map((item) => {
        const label = this.pilihan == 1 ? item.daerah_name : item.penyakit_name;
        const values = Object.keys(item)
          .filter((key) => key !== "daerah_name")
          .map((key) => item[key]);
        return { label, data: values };
      });

      this.data.datasets = restructuredData;
      this.dataTemp = JSON.parse(JSON.stringify(this.data));
    } else {
      this.isData = false;
      this.showMessage(
        "Informasi",
        "Silakan ke menu prediksi dulu untuk melihat grafik prediksi",
        "info"
      );
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
    console.log("daerah", this.daerah, this.penyakit);
    let dataT = JSON.parse(JSON.stringify(this.data));
    let filteredDatasets = dataT["datasets"].filter((dataset) => {
      if (this.pilihan == 1) return this.daerah.includes(dataset.label);
      else return this.penyakit.includes(dataset.label);
    });

    // Create a new object with the filtered datasets
    let filteredData = {
      labels: this.dataTemp["labels"],
      datasets: filteredDatasets,
    };
    this.dataTemp = { ...filteredData };
    console.log("aaa", filteredData);
  }
}
