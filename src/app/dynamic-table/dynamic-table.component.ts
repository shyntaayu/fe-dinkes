import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dynamic-table",
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.css"],
})
export class DynamicTableComponent implements OnInit {
  @Input() data: any[];
  years: string[];

  constructor() {
    this.years = [];
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  ngOnChanges() {
    this.extractYears();
  }

  private extractYears() {
    if (this.data.length > 0) {
      this.years = Object.keys(this.data[0]).filter(
        (key) => key !== "penyakit_name" && key !== "daerah_name"
      );
    }
  }
}
