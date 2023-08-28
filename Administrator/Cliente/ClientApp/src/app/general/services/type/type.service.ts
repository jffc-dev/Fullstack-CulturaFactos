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

  public read(): Observable<DTOType[]> {
    return this.http.get<DTOType[]>(this.urlApi + "read")
    .pipe(
      map(response => { return response }),
      catchError(error => { return throwError('Something went wrong. Please try again later.'); })
    );
  }

  public create(itemType: DTOType): Observable<any> {
    const objetoJSON = {
      "DTOType": itemType
    };

    return this.http.post<number>(this.urlApi + "create", objetoJSON )
    .pipe(
      map(response => { return response }),
      catchError(error => {
        console.log(error)
        return throwError('Something went wrong. Please try again later.' + error.toString());
      })
    );
  }


  public update(itemType: DTOType): Observable<any> {
    var objetoJSON = { DTOType: itemType };

    return this.http.post<number>(this.urlApi + "update", objetoJSON)
      .pipe(
        map(response => { return response }),
        catchError(error => { return throwError('Something went wrong. Please try again later.' + error.toString()); })
      );
  }
}
