import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie-service";
import { LoginResponse } from "app/model/login-response";
import { AppComponentBase } from "shared/app-component-base";
import Swal from "sweetalert2";
import { AppConfig } from "app/model/app-config";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService extends AppComponentBase {
  headers = new HttpHeaders().set("Content-Type", "application/json");
  private loggedUserSubject: BehaviorSubject<LoginResponse>;
  public loggedInUser: Observable<LoginResponse>;
  getLoggedUser;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private injector: Injector,
    private appConfig: AppConfig
  ) {
    super(injector);
    this.getLoggedUser = JSON.parse(localStorage.getItem("user"));
    this.loggedUserSubject = new BehaviorSubject(this.getLoggedUser);
    this.loggedInUser = this.loggedUserSubject.asObservable();
    // this.loggedUserSubject = new BehaviorSubject<LoginResponse>(JSON.parse(localStorage.getItem('userMe')));
    if (this.cookieService.check("userMe")) {
      this.cookieService.get("userMe");
      this.loggedUserSubject = new BehaviorSubject<LoginResponse>(
        JSON.parse(this.cookieService.get("userMe"))
      );
      this.loggedInUser = this.loggedUserSubject.asObservable();
    } else {
      this.loggedUserSubject = new BehaviorSubject<LoginResponse>(null);
    }
  }

  public get userValue(): LoginResponse {
    return this.loggedUserSubject.getValue();
  }

  login(username: string, password: string) {
    console.log("login", environment.apiUrl);
    return this.http
      .post<any>(`${this.appConfig.apiUrl}/user/login`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('userMe', JSON.stringify(user));
          if (!user.success) {
            // this.showNotification("top", "right", user.msg, "danger");
            this.showMessage("Eror!", user.msg, "error");
          } else {
            this.loggedUserSubject.next(user.result);
            this.cookieService.set(
              "userMe",
              JSON.stringify(user.result),
              new Date(new Date().getTime() + 1 * 86400000) // 1 day
            );
            localStorage.setItem("user", JSON.stringify(user.result));
            this.showNotification("top", "right", "Login sukses", "success");
          }
          return user.result;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    this.cookieService.delete("userMe");
    this.loggedUserSubject.next(null);
    this.router.navigate(["/login"]);
  }
}
