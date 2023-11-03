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
import { Jumlah } from "app/model/jumlah";
import { Penduduks } from "app/model/penduduk";
@Injectable({
  providedIn: "root",
})
export class JumlahService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getJumlahDaerah(): Observable<Jumlah> {
    return this.http.get<Jumlah>(`${this.appConfig.apiUrl}/jumlah/daerah`);
  }

  getJumlahPenyakit(): Observable<Jumlah> {
    return this.http.get<Jumlah>(`${this.appConfig.apiUrl}/jumlah/penyakit`);
  }
  getJumlahData(): Observable<Jumlah> {
    return this.http.get<Jumlah>(`${this.appConfig.apiUrl}/jumlah/data`);
  }

  getJumlahPenduduk(): Observable<Penduduks> {
    return this.http.get<Penduduks>(
      `${this.appConfig.apiUrl}/penduduk?pilihan=tahun`
    );
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
