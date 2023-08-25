import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DTOType } from '../../domain/type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private urlApi: string = "https://localhost:7203/api/Types/";

  constructor(private http: HttpClient) { }

  public read(): Observable<any> {
    return this.http.get<DTOType>(this.urlApi + "read")
    .pipe(
      map(response => { return response }),
      catchError(error => { return throwError('Something went wrong. Please try again later.'); })
    );
  }
}
