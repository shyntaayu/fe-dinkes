import { Component, Injector, OnInit } from "@angular/core";
import { Daerah } from "app/model/daerah";
import { Daerahs } from "app/model/daerahs";
import { DaerahService } from "app/services/daerah.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-daerah",
  templateUrl: "./daerah.component.html",
  styleUrls: ["./daerah.component.css"],
})
export class DaerahComponent extends AppComponentBase implements OnInit {
  daerahDialog: boolean;

  daerahs: Daerahs;

  daerah: Daerah;

  selectedDaerahs: Daerahs;

  submitted: boolean;
  loading = true;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private injector: Injector,
    private _daerahService: DaerahService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getDaerah();
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

  openNew() {
    this.daerah = {};
    this.submitted = false;
    this.daerahDialog = true;
  }

  deleteSelectedDaerahs() {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus daerah yang dipilih?",
      header: "Konfirmasi",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      accept: () => {
        this.selectedDaerahs.map((daerah) => {
          this._daerahService.delete(daerah.daerah_id).subscribe(
            (data) => {
              this.showMessage(
                "Selected daerah was deleted",
                undefined,
                "success"
              );
              this.getDaerah();
            },
            (err) => {
              console.error(err);
              this.showMessage("Eror!", err.message, "error");
            }
          );
        });
        this.selectedDaerahs = null;
      },
    });
  }

  editDaerah(daerah: Daerah) {
    this.daerah = { ...daerah };
    this.daerahDialog = true;
  }

  deleteDaerah(daerah: Daerah) {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus " + daerah.daerah_name + "?",
      header: "Konfirmasi",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      accept: () => {
        this._daerahService.delete(daerah.daerah_id).subscribe(
          (data) => {
            this.showMessage(data.message, undefined, "success");
            this.getDaerah();
          },
          (err) => {
            console.error(err);
            this.showMessage("Eror!", err.message, "error");
          }
        );
        this.daerah = {};
      },
    });
  }

  hideDialog() {
    this.daerahDialog = false;
    this.submitted = false;
  }

  saveDaerah() {
    console.log(this.daerah);
    this.submitted = true;
    if (this.daerah.daerah_name.trim()) {
      if (this.daerah.daerah_id) {
        this._daerahService.update(this.daerah).subscribe(
          (data) => {
            this.showMessage(data.message, undefined, "success");
            this.afterCreateUpdate();
          },
          (err) => {
            console.error(err);
            this.showMessage("Eror!", err.message, "error");
          }
        );
      } else {
        this._daerahService.create(this.daerah).subscribe(
          (data) => {
            this.showMessage(data.message, undefined, "success");
            this.afterCreateUpdate();
          },
          (err) => {
            console.error(err);
            this.showMessage("Eror!", err.message, "error");
          }
        );
      }
    }
  }

  afterCreateUpdate() {
    this.getDaerah();
    this.daerahDialog = false;
    this.daerah = {};
  }

  findIndexById(id: string): number {
    let index = -1;
    // for (let i = 0; i < this.daerahs.length; i++) {
    //   if (this.daerahs[i].id === id) {
    //     index = i;
    //     break;
    //   }
    // }

    return index;
  }

  createId(): string {
    let id = "";
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
