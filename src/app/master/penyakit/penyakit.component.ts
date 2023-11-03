import { Component, Injector, OnInit } from "@angular/core";
import { Penyakit } from "app/model/penyakit";
import { Penyakits } from "app/model/penyakits";
import { DaerahService } from "app/services/daerah.service";
import { PenyakitService } from "app/services/penyakit.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-penyakit",
  templateUrl: "./penyakit.component.html",
  styleUrls: ["./penyakit.component.css"],
})
export class PenyakitComponent extends AppComponentBase implements OnInit {
  penyakitDialog: boolean;

  penyakits: Penyakits;

  penyakit: Penyakit;

  selectedPenyakits: Penyakits;

  submitted: boolean;
  loading = true;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private injector: Injector,
    private _penyakitService: PenyakitService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getPenyakit();
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

  openNew() {
    this.penyakit = {};
    this.submitted = false;
    this.penyakitDialog = true;
  }

  deleteSelectedPenyakits() {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus penyakit yang dipilih?",
      header: "Konfirmasi",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      accept: () => {
        this.selectedPenyakits.map((penyakit) => {
          this._penyakitService.delete(penyakit.penyakit_id).subscribe(
            (data) => {
              this.showMessage(
                "Selected penyakit was deleted",
                undefined,
                "success"
              );
              this.getPenyakit();
            },
            (err) => {
              console.error(err);
              this.showMessage("Eror!", err.message, "error");
            }
          );
        });
        this.selectedPenyakits = null;
      },
    });
  }

  editPenyakit(penyakit: Penyakit) {
    this.penyakit = { ...penyakit };
    this.penyakitDialog = true;
  }

  deletePenyakit(penyakit: Penyakit) {
    this.confirmationService.confirm({
      message:
        "Apakah Anda yakin ingin menghapus " + penyakit.penyakit_name + "?",
      header: "Konfirmasi",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this._penyakitService.delete(penyakit.penyakit_id).subscribe(
          (data) => {
            this.showMessage(data.message, undefined, "success");
            this.getPenyakit();
          },
          (err) => {
            console.error(err);
            this.showMessage("Eror!", err.message, "error");
          }
        );
        this.penyakit = {};
      },
    });
  }

  hideDialog() {
    this.penyakitDialog = false;
    this.submitted = false;
  }

  savePenyakit() {
    console.log(this.penyakit);
    this.submitted = true;
    if (this.penyakit.penyakit_name.trim()) {
      if (this.penyakit.penyakit_id) {
        this._penyakitService.update(this.penyakit).subscribe(
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
        this._penyakitService.create(this.penyakit).subscribe(
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
    this.getPenyakit();
    this.penyakitDialog = false;
    this.penyakit = {};
  }

  findIndexById(id: string): number {
    let index = -1;
    // for (let i = 0; i < this.penyakits.length; i++) {
    //   if (this.penyakits[i].id === id) {
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
