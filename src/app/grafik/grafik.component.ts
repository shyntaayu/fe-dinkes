import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-grafik",
  templateUrl: "./grafik.component.html",
  styleUrls: ["./grafik.component.css"],
})
export class GrafikComponent implements OnInit {
  data: any;

  constructor() {
    this.data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          // fill: true,
          borderColor: "#42A5F5",
          tension: 0.4,
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
  }

  ngOnInit(): void {}
}
