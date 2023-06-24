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
import { Daerah } from "app/model/daerah";
@Injectable({
  providedIn: "root",
})
export class DaerahService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getAllDaerah(): Observable<Daerah> {
    return this.http.get<Daerah>(`${this.appConfig.apiUrl}/daerah`);
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
    return throwError(errorMessage);
  }
}
