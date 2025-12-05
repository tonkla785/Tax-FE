import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Detail, Header } from '../interface/taxinterface';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/tax-service';

  createTax(details: Detail[]): Observable<ApiResponse<Header>> {
    return this.http.post<ApiResponse<Header>>(
      `${this.apiUrl}/create`,
      details
    );
  }

  updateTax(
    vdtNo: number,
    detailList: Detail[]
  ): Observable<ApiResponse<Header>> {
    return this.http.put<ApiResponse<Header>>(
      `${this.apiUrl}/update/${vdtNo}`,
      detailList
    );
  }

  searchHeader(
    vdtNo?: number,
    createDate?: string
  ): Observable<ApiResponse<any>> {
    let params = new HttpParams();

    if (vdtNo !== undefined && vdtNo !== null) {
      params = params.set('vdtNo', vdtNo.toString());
    }
    if (createDate) {
      params = params.set('createDate', createDate);
    }

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/search`, { params });
  }

  deleteTax(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  printReport(payload: any) {
    return this.http.post(`${this.apiUrl}/pdf`, payload, {
      responseType: 'blob',
    });
  }
}
