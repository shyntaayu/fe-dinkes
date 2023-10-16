import { Component, Injector, OnInit } from "@angular/core";
import { DaerahService } from "app/services/daerah.service";
import { JumlahService } from "app/services/jumlah.service";
import { PenyakitService } from "app/services/penyakit.service";
import * as Chartist from "chartist";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent extends AppComponentBase implements OnInit {
  constructor(
    private _daerahService: DaerahService,
    private _jumlahService: JumlahService,
    private injector: Injector,
    private _penyakitService: PenyakitService
  ) {
    super(injector);
  }
  daerahs = [];
  penyakits = [];
  penduduks = [];
  jumlahDaerah = 0;
  jumlahPenyakit = 0;
  jumlahData = 0;
  basicData: any;basicOptions: any;
  ngOnInit() {
    this.getJumlahDaerah();
    this.getJumlahData();
    this.getJumlahPenyakit();
    this.getPenyakit();
    this.getDaerah();
    this.getJumlahPenduduk();
  }

  getDaerah() {
    this._daerahService.getAllDaerah().subscribe(
      (data) => {
        console.log(data);
        this.daerahs = data;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  getJumlahDaerah() {
    this._jumlahService.getJumlahDaerah().subscribe(
      (data) => {
        console.log(data);
        this.jumlahDaerah = data.total;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  getJumlahPenyakit() {
    this._jumlahService.getJumlahPenyakit().subscribe(
      (data) => {
        console.log(data);
        this.jumlahPenyakit = data.total;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  getJumlahData() {
    this._jumlahService.getJumlahData().subscribe(
      (data) => {
        console.log(data);
        this.jumlahData = data.total;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  getPenyakit() {
    this._penyakitService.getAllPenyakit().subscribe(
      (data) => {
        console.log(data);
        this.penyakits = data;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  getJumlahPenduduk() {
    this._jumlahService.getJumlahPenduduk().subscribe(
      (data) => {
        console.log(data);
        this.penduduks = data;
        let label = [];
        let seri = [];
        data.map((e) => {
          label.push(e.tahun);
          seri.push(+e.total_jumlah);
        });

        this.basicData = {
          labels: label,
          datasets: [
            {
              label: "",
              data: seri,
              fill: false,
              borderColor: "#ffffff",
              tension: 0.4,
            },
          ],
        };
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }
}
