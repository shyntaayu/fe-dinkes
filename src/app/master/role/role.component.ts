import { Component, Injector, OnInit } from "@angular/core";
import { Role } from "app/model/role";
import { Roles } from "app/model/roles";
import { DaerahService } from "app/services/daerah.service";
import { RoleService } from "app/services/role.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.css"],
})
export class RoleComponent extends AppComponentBase implements OnInit {
  roleDialog: boolean;

  roles: Roles;

  role: Role;

  selectedRoles: Roles;

  submitted: boolean;
  loading = true;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private injector: Injector,
    private _daerahService: DaerahService,
    private _roleService: RoleService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getRole();
  }
  getRole() {
    this._roleService.getAllRole().subscribe(
      (data) => {
        console.log(data);
        this.roles = data;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  openNew() {
    this.role = {};
    this.submitted = false;
    this.roleDialog = true;
  }

  deleteSelectedRoles() {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus role yang dipilih?",
      header: "Konfirmasi",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.selectedRoles.map((role) => {
          this._roleService.delete(role.role_id).subscribe(
            (data) => {
              this.showMessage(
                "Selected role was deleted",
                undefined,
                "success"
              );
              this.getRole();
            },
            (err) => {
              console.error(err);
              this.showMessage("Eror!", err.message, "error");
            }
          );
        });
        this.selectedRoles = null;
      },
    });
  }

  editRole(role: Role) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  deleteRole(role: Role) {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus " + role.role_name + "?",
      header: "Konfirmasi",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      accept: () => {
        this._roleService.delete(role.role_id).subscribe(
          (data) => {
            this.showMessage(data.message, undefined, "success");
            this.getRole();
          },
          (err) => {
            console.error(err);
            this.showMessage("Eror!", err.message, "error");
          }
        );
        this.role = {};
      },
    });
  }

  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }

  saveRole() {
    console.log(this.role);
    this.submitted = true;
    if (this.role.role_name.trim()) {
      if (this.role.role_id) {
        this._roleService.update(this.role).subscribe(
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
        this._roleService.create(this.role).subscribe(
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
    this.getRole();
    this.roleDialog = false;
    this.role = {};
  }

  findIndexById(id: string): number {
    let index = -1;
    // for (let i = 0; i < this.roles.length; i++) {
    //   if (this.roles[i].id === id) {
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
