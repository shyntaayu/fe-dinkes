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

  constructor() {
    let dataLine = localStorage.getItem("dataLine");
    this.title = localStorage.getItem("titleLine");
    if (dataLine != undefined || dataLine != null || dataLine != "") {
      let dataLineAr = [];
      dataLineAr = JSON.parse(dataLine);
      this.data.labels = Object.keys(dataLineAr[0]).filter(
        (key) => key != "daerah_name"
      );

      const restructuredData = dataLineAr.map((item) => {
        const label = item.daerah_name;
        const values = Object.keys(item)
          .filter((key) => key !== "daerah_name")
          .map((key) => item[key]);
        return { label, data: values };
      });

      this.data.datasets = restructuredData;
    }
    console.log("dataLineAr", this.data);
  }
  ngAfterViewInit(): void {
    // localStorage.removeItem("dataLine");
    // localStorage.removeItem("titleLine");
  }

  ngOnInit(): void {}
}
