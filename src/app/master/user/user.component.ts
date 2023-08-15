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
    private userservice: UserService,
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
    this.userservice.getAllUser().subscribe(
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
      message: "Are you sure you want to delete the selected users?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.users = this.users.filter(
          (val) => !this.selectedUsers.includes(val)
        );
        this.selectedUsers = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Users Deleted",
          life: 3000,
        });
      },
    });
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User) {
    // this.confirmationService.confirm({
    //   message: "Are you sure you want to delete " + user.name + "?",
    //   header: "Confirm",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.users = this.users.filter((val) => val.id !== user.id);
    //     this.user = {};
    //     this.messageService.add({
    //       severity: "success",
    //       summary: "Successful",
    //       detail: "User Deleted",
    //       life: 3000,
    //     });
    //   },
    // });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    console.log(this.user);
    // this.submitted = true;
    // if (this.user.name.trim()) {
    //   if (this.user.id) {
    //     this.users[this.findIndexById(this.user.id)] = this.user;
    //     this.messageService.add({
    //       severity: "success",
    //       summary: "Successful",
    //       detail: "User Updated",
    //       life: 3000,
    //     });
    //   } else {
    //     this.user.id = this.createId();
    //     this.user.image = "user-placeholder.svg";
    //     this.users.push(this.user);
    //     this.messageService.add({
    //       severity: "success",
    //       summary: "Successful",
    //       detail: "User Created",
    //       life: 3000,
    //     });
    //   }
    //   this.users = [...this.users];
    //   this.userDialog = false;
    //   this.user = {};
    // }
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
