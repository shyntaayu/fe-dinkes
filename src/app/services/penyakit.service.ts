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
import { Penyakits } from "app/model/penyakits";
import { Penyakit } from "app/model/penyakit";
@Injectable({
  providedIn: "root",
})
export class PenyakitService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getAllPenyakit(): Observable<Penyakits> {
    console.log("getAllPenyakit", this.appConfig.apiUrl);
    return this.http.get<Penyakits>(`${this.appConfig.apiUrl}/penyakit`);
  }

  delete(id): Observable<any> {
    var API_URL = `${this.appConfig.apiUrl}/penyakit/${id}`;
    return this.http.delete(API_URL).pipe(catchError(this.errorMgmt));
  }

  update(data: Penyakit): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/penyakit/${data.penyakit_id}`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  create(data: Penyakit): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/penyakit`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  // Error handling
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
