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
  @Input() iterasi = 0;
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
    if (
      this.type == 1 &&
      header.list_table.length > 0 &&
      header.list_table[0].hasOwnProperty("cluster")
    ) {
      this.doDiagram(index, header);
    } else if (
      this.type == 2 &&
      header.list_table.length > 0 &&
      header.list_table[0].hasOwnProperty("2022")
    ) {
      this.doDiagram(index, header);
    } else {
      let proses = this.type == 1 ? "clustering" : "prediksi";
      this.showMessage(
        "Peringatan!",
        "Silakan klik tombol " + proses + " terlebih dahulu",
        "warning"
      );
    }
  }
  doDiagram(index, header) {
    localStorage.setItem("pilihan", this.pilihan);
    console.log(header);
    let obj = {
      idx: index,
      data: this.data[index].list_table,
      title:
        this.pilihan == 1
          ? this.data[index].penyakit_name
          : this.data[index].daerah_name,
    };
    if (this.pilihan == 1) obj["penyakit_name"] = header.penyakit_name;
    if (this.pilihan == 2) obj["daerah_name"] = header.daerah_name;
    this.prosesDiagram.emit(obj);
  }
}
