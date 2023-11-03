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
import { Daerahs } from "app/model/daerahs";
import { Daerah } from "app/model/daerah";
@Injectable({
  providedIn: "root",
})
export class DaerahService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getAllDaerah(): Observable<Daerahs> {
    return this.http.get<Daerahs>(`${this.appConfig.apiUrl}/daerah`);
  }

  delete(id): Observable<any> {
    var API_URL = `${this.appConfig.apiUrl}/daerah/${id}`;
    return this.http.delete(API_URL).pipe(catchError(this.errorMgmt));
  }

  update(data: Daerah): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/daerah/${data.daerah_id}`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  create(data: Daerah): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/daerah`;
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
