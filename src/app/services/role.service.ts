import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "environments/environment";
import { AppConfig } from "app/model/app-config";
import { Roles } from "app/model/roles";
import { Role } from "app/model/role";
@Injectable({
  providedIn: "root",
})
export class RoleService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getAllRole(): Observable<Roles> {
    return this.http.get<Roles>(`${this.appConfig.apiUrl}/role`);
  }

  delete(id): Observable<any> {
    var API_URL = `${this.appConfig.apiUrl}/role/${id}`;
    return this.http.delete(API_URL).pipe(catchError(this.errorMgmt));
  }

  update(data: Role): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/role/${data.role_id}`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  create(data: Role): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/role`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(error.error);
  }
}
