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
  @Output() prosesClustering: EventEmitter<any> = new EventEmitter<any>();
  @Output() prosesDiagram: EventEmitter<any> = new EventEmitter<any>();
  years: string[];

  constructor(injector: Injector) {
    super(injector);
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
    // if (this.type == 1) {
    //   if (this.data[index].list_table.hasOwnProperty("cluster")) {
    //     this.prosesEmit(index);
    //   } else {
    //     this.showMessage(
    //       "Eror!",
    //       "Silahkan lakukan proses klustering dulu",
    //       "error"
    //     );
    //   }
    // } else {
    //   if (this.data[index].list_table.hasOwnProperty("2022")) {
    //     this.prosesEmit(index);
    //   } else {
    //     this.showMessage(
    //       "Eror!",
    //       "Silahkan lakukan proses prediksi dulu",
    //       "error"
    //     );
    //   }
    // }
    this.prosesEmit(index);
  }

  prosesEmit(index) {
    this.prosesDiagram.emit({
      idx: index,
      data: this.data[index].list_table,
      title: this.data[index].penyakit_name,
    });
  }
}
