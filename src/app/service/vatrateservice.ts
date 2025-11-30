import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interface/taxinterface';

@Injectable({
  providedIn: 'root',
})
export class VatRateService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/vat-rate-service';

  getVatRate(): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/vat-rate`)
      .pipe(map((res) => res.data));
  }
}
