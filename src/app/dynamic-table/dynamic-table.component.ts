import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-dynamic-table",
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.css"],
})
export class DynamicTableComponent
  extends AppComponentBase
  implements OnChanges, OnInit
{
  @Input() data: any[];
  @Input() type: any;
  @Input() pilihan: any;
  @Output() prosesClustering: EventEmitter<any> = new EventEmitter<any>();
  @Output() prosesDiagram: EventEmitter<any> = new EventEmitter<any>();
  years: string[];

  constructor(injector: Injector) {
    super(injector);
    this.years = [];
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
    console.log("data-table", this.data);
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

  proses(index, header) {
    let obj = {
      idx: index,
      data: this.data[index].list_table,
    };
    if (this.pilihan == 1) obj["penyakit_name"] = header.penyakit_name;
    if (this.pilihan == 2) obj["daerah_name"] = header.daerah_name;
    this.prosesClustering.emit(obj);
  }

  diagram(index, header) {
    let obj = {
      idx: index,
      data: this.data[index].list_table,
      title: this.data[index].penyakit_name,
    };
    if (this.pilihan == 1) obj["penyakit_name"] = header.penyakit_name;
    if (this.pilihan == 2) obj["daerah_name"] = header.daerah_name;
    this.prosesDiagram.emit(obj);
  }
}
