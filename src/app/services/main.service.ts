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
@Injectable({
  providedIn: "root",
})
export class MainService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  // getSanitasi(id): Observable<any> {
  //   let API_URL = `${this.appConfig.apiUrlKrs}/master/sanitasi/${id}`;
  //   return this.http.get(API_URL, { headers: this.headers }).pipe(
  //     map((res: Response) => {
  //       return res || {};
  //     }),
  //     catchError(this.errorMgmt)
  //   );
  // }

  // // Update sanitasi
  // updateSanitasi(id, data): Observable<any> {
  //   let API_URL = `${this.appConfig.apiUrlKrs}/master/sanitasi/${id}`;
  //   return this.http
  //     .put(API_URL, data, { headers: this.headers })
  //     .pipe(catchError(this.errorMgmt));
  // }

  // // Delete sanitasi
  // deleteSanitasi(id): Observable<any> {
  //   var API_URL = `${this.appConfig.apiUrlKrs}/master/sanitasi/${id}`;
  //   return this.http.delete(API_URL).pipe(catchError(this.errorMgmt));
  // }

  // getAllTahun(): Observable<TahunAkademik> {
  //   return this.http.get<TahunAkademik>(
  //     `${this.appConfig.apiUrlKrs}/dropdown/tahun`
  //   );
  // }

  // getAllSemester(): Observable<Semester> {
  //   return this.http.get<Semester>(
  //     `${this.appConfig.apiUrlKrs}/dropdown/semester`
  //   );
  // }
  // getAllProdi(): Observable<Prodi> {
  //   return this.http.get<Prodi>(`${this.appConfig.apiUrlKrs}/dropdown/prodi`);
  // }
  // getAllJenjang(): Observable<Jenjang> {
  //   return this.http.get<Jenjang>(
  //     `${this.appConfig.apiUrlKrs}/dropdown/jenjang`
  //   );
  // }

  // getKrs(
  //   jenis_aplikasi,
  //   nim,
  //   tahun_akademik,
  //   status_semester,
  //   id_master_jenjang,
  //   kode_prodi,
  //   id_master_kelas?
  // ): Observable<KrsResponse> {
  //   let params = new HttpParams();
  //   params = params.append("jenis_aplikasi", jenis_aplikasi);
  //   params = params.append("nim", nim);
  //   params = params.append("tahun_akademik", tahun_akademik);
  //   params = params.append("status_semester", status_semester);
  //   params = params.append("id_master_jenjang", id_master_jenjang);
  //   params = params.append("kode_prodi", kode_prodi);
  //   // params = params.append("id_master_kelas", id_master_kelas);
  //   return this.http.get<KrsResponse>(
  //     `${this.appConfig.apiUrlKrs}/krs/mahasiswa`,
  //     {
  //       params: params,
  //     }
  //   );
  // }

  // getKrs2(jenis_aplikasi, nim, semester): Observable<KrsResponse> {
  //   let params = new HttpParams();
  //   params = params.append("jenis_aplikasi", jenis_aplikasi);
  //   params = params.append("nim", nim);
  //   params = params.append("semester", semester);
  //   return this.http.get<KrsResponse>(
  //     `${this.appConfig.apiUrlKrs}/krs/mahasiswa`,
  //     {
  //       params: params,
  //     }
  //   );
  // }

  // getKrsBody(jenis_aplikasi, nim, semester): Observable<KrsPrintResponse> {
  //   let params = new HttpParams();
  //   params = params.append("jenis_aplikasi", jenis_aplikasi);
  //   params = params.append("nim", nim);
  //   params = params.append("semester", semester);
  //   return this.http.get<KrsPrintResponse>(
  //     `${this.appConfig.apiUrlKrs}/krs/mahasiswa/body`,
  //     {
  //       params: params,
  //     }
  //   );
  // }

  // getKrsHeader(nim): Observable<KrsHeaderResponse> {
  //   let params = new HttpParams();
  //   params = params.append("nim", nim);
  //   return this.http.get<KrsHeaderResponse>(
  //     `${this.appConfig.apiUrlKrs}/krs/mahasiswa/header`,
  //     {
  //       params: params,
  //     }
  //   );
  // }

  // getAllMain(): Observable<Main> {
  //   return this.http.get<Main>(`${this.appConfig.apiUrl}/Main`);
  // }

  // localhost/s2/kmean-dinkes/main?pilihan=penyakit&baris=daerah&kolom=tahun
  getMain(pilihan, baris, kolom): Observable<any> {
    let params = new HttpParams();
    params = params.append("pilihan", pilihan);
    params = params.append("baris", baris);
    params = params.append("kolom", kolom);
    return this.http.get<any>(`${this.appConfig.apiUrl}/main`, {
      params: params,
    });
  }

  processClustering(data: any): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/main/clustering`;
    const params = new HttpParams().set("body", data);
    let options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      }),
      withCredentials: true,
      // params: params,
    };
    return this.http
      .post(API_URL, data, options)
      .pipe(catchError(this.errorMgmt));
  }

  processPrediksi(data: any): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/main/prediksi`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  createInput(data: any): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/main/createsingle`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  createBulk(data: any): Observable<any> {
    let API_URL = `${this.appConfig.apiUrl}/main/createmulti`;
    return this.http.post(API_URL, data).pipe(catchError(this.errorMgmt));
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    console.error(error);
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
