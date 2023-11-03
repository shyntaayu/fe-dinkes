import { Component, Injector, OnInit } from "@angular/core";
import { User } from "app/model/user";
import { Users } from "app/model/users";
import { DaerahService } from "app/services/daerah.service";
import { RoleService } from "app/services/role.service";
import { UserService } from "app/services/user.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppComponentBase } from "shared/app-component-base";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent extends AppComponentBase implements OnInit {
  userDialog: boolean;

  users: Users;

  user: User;

  selectedUsers: Users;

  submitted: boolean;
  listRole = [];
  listDaerah = [];
  loading = true;

  constructor(
    private _userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private injector: Injector,
    private _daerahService: DaerahService,
    private _roleService: RoleService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getUser();
    this.getDaerah();
    this.getRole();
  }

  getDaerah() {
    this._daerahService.getAllDaerah().subscribe(
      (data) => {
        console.log(data);
        this.listDaerah = data;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }
  getRole() {
    this._roleService.getAllRole().subscribe(
      (data) => {
        console.log(data);
        this.listRole = data;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }
  getUser() {
    this._userService.getAllUser().subscribe(
      (data) => {
        console.log(data);
        this.users = data;
      },
      (err) => {
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus pengguna yang dipilih?",
      header: "Konfirmasi",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      accept: () => {
        this.selectedUsers.map((user) => {
          this._userService.delete(user.user_id).subscribe(
            (data) => {
              this.showMessage(
                "Selected user was deleted",
                undefined,
                "success"
              );
              this.getUser();
            },
            (err) => {
              console.error(err);
              this.showMessage("Eror!", err.message, "error");
            }
          );
        });
        this.selectedUsers = null;
      },
    });
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: "Apakah Anda yakin ingin menghapus " + user.user_name + "?",
      header: "Konfirmasi",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this._userService.delete(user.user_id).subscribe(
          (data) => {
            this.showMessage(data.message, undefined, "success");
            this.getUser();
          },
          (err) => {
            console.error(err);
            this.showMessage("Eror!", err.message, "error");
          }
        );
        this.user = {};
      },
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    console.log(this.user);
    this.submitted = true;
    delete this.user.email;
    if (this.user.user_name.trim()) {
      if (this.user.user_id) {
        if (this.user.password == 12345) delete this.user.password;
        this._userService.update(this.user).subscribe(
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
        this._userService.register(this.user).subscribe(
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
    this.getUser();
    this.userDialog = false;
    this.user = {};
  }

  findIndexById(id: string): number {
    let index = -1;
    // for (let i = 0; i < this.users.length; i++) {
    //   if (this.users[i].id === id) {
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
