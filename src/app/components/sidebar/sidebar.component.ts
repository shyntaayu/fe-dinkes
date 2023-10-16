import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/services/authentication.service";
import { CookieService } from "ngx-cookie-service";
import { AppMenuItem } from "./app-menu-item";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  { path: "/data", title: "Clustering", icon: "table_chart", class: "" },
  // {
  //   path: "/hasil",
  //   title: "Hasil Clustering",
  //   icon: "bubble_chart",
  //   class: "",
  // },
  {
    path: "/prediksi",
    title: "Prediksi",
    icon: "cast",
    class: "",
  },
  {
    path: "/grafik",
    title: "Grafik",
    icon: "show_chart",
    class: "",
  },
  {
    path: "/diagram",
    title: "Diagram Cluster",
    icon: "pie_chart",
    class: "",
  },
  {
    path: "/input",
    title: "Input Data",
    icon: "input",
    class: "",
  },
  {
    path: "/upload-bulk",
    title: "Upload Bulk Data",
    icon: "publish",
    class: "",
  },
  {
    path: "/user",
    title: "Master User",
    icon: "badge",
    class: "",
  },
  {
    path: "/role",
    title: "Master Role",
    icon: "lock",
    class: "",
  },
  // { path: "/user-profile", title: "User Profile", icon: "person", class: "" },
  // {
  //   path: "/table-list",
  //   title: "Table List",
  //   icon: "content_paste",
  //   class: "",
  // },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "library_books",
  //   class: "",
  // },
  // { path: "/icons", title: "Icons", icon: "bubble_chart", class: "" },
  // { path: "/maps", title: "Maps", icon: "location_on", class: "" },
  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   icon: "notifications",
  //   class: "",
  // },
  // {
  //   path: "/upgrade",
  //   title: "Upgrade to PRO",
  //   icon: "unarchive",
  //   class: "active-pro",
  // },
];
export const menu: AppMenuItem[] = [
  new AppMenuItem("Dashboard", "1,2", "dashboard", "/dashboard"),
  new AppMenuItem("Clustering", "1", "table_chart", "/data"),
  // new AppMenuItem("Hasil Clustering", "1", "bubble_chart", "/hasil"),
  new AppMenuItem("Prediksi", "1", "cast", "/prediksi"),
  new AppMenuItem("Grafik", "1", "show_chart", "/grafik"),
  new AppMenuItem("Diagram Cluster", "1", "pie_chart", "/diagram"),
  new AppMenuItem("Input Data", "1,2", "input", "/input"),
  new AppMenuItem("Upload Bulk Data", "1", "publish", "/upload-bulk"),
  // new AppMenuItem("Transkrip Nilai", "1", "school", "/transkrip-nilai"),
  // new AppMenuItem("Input Nilai", "1,8", "edit_note", "/add-nilai"),
  // new AppMenuItem("Paket KRS", "1", "post_add", "/paket-krs"),
  new AppMenuItem("Master", "1", "apps", "", [
    new AppMenuItem("User", "1", "badge", "/user"),
    new AppMenuItem("Role", "1", "lock", "/role"),
    new AppMenuItem("Penyakit", "1", "ac_unit", "/penyakit"),
    new AppMenuItem("Daerah", "1", "place", "/daerah"),
  ]),
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  menuDashboard;
  menuNone;
  menuNew: any[];
  userFromApi;

  constructor(
    private authenticationService: AuthenticationService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    // this.menuItems = ROUTES.filter((menuItem) => menuItem);
    // console.log("menuItems", this.authenticationService.userValue["role_id"]);
    this.menuNew = menu;
    let a = JSON.parse(this.cookieService.get("userMe"));
    this.userFromApi = a ? a.user_name : null;
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  showMenuItem(menuItem): boolean {
    if (menuItem.permissionName) {
      let permission = menuItem.permissionName.split(",");
      let f = permission.find((x) => {
        // return x == this.authenticationService.userValue["role_id"];
        return true;
      });
      return f;
    }
    return true;
  }

  logout() {
    this.authenticationService.logout();
  }
}
