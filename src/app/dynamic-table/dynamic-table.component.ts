import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-dynamic-table",
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.css"],
})
export class DynamicTableComponent implements OnChanges, OnInit {
  @Input() data: any[];
  @Input() type: string;
  @Output() prosesClustering: EventEmitter<any> = new EventEmitter<any>();
  @Output() prosesDiagram: EventEmitter<any> = new EventEmitter<any>();
  years: string[];

  constructor() {
    this.years = [];
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.extractYears();
    }, 0);
  }

  extractYears() {
    let self = this;
    if (self.data.length > 0) {
      self.years = Object.keys(self.data[0].list_table[0]).filter(
        (key) => key !== "penyakit_name" && key !== "daerah_name"
      );
    }
  }

  proses(index) {
    this.prosesClustering.emit({
      idx: index,
      data: this.data[index].list_table,
    });
  }

  diagram(index) {
    this.prosesDiagram.emit({
      idx: index,
      data: this.data[index].list_table,
      title: this.data[index].penyakit_name,
    });
  }
}
