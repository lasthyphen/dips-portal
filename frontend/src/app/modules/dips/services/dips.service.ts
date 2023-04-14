import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import FilterData from '../components/filter/filter.data';
import { Language } from 'src/app/data-types/languages';
import { IDip } from '../types/dip';

@Injectable({
  providedIn: 'root',
})
export class DipsService {
  filter: FilterData;
  dipsData: any[];
  total = 1;
  includeSubproposals = false;

  constructor(private http: HttpClient) {
    this.clearFilter();
  }

  searchDips(
    limit: number,
    page: number,
    order: string,
    search: string,
    filter?: any,
    select?: string
  ): Observable<any> {
    let params = new HttpParams({
      fromObject: { limit: limit.toString(), page: page.toString() },
    });

    if (select !== undefined && select != null && select !== '') {
      params = params.append('select', select);
    }

    if (order !== undefined && order != null && order !== '') {
      const patt = /\b-?dip\b|\b-?dip\s|\s-?dip\s|\s-?dip\b/;

      if (!patt.test(order)) {
        order += ' dip dipCodeNumber';
      }

      order += ' _id';
      params = params.append('order', order);
    }
    if (search !== undefined && search != null && search !== '') {
      params = params.append('search', search);
    }
    let urlFilter = '';
    let enter = false;

    if (filter !== undefined && filter != null) {

      Object.keys(filter).forEach((key) => {
        if (key === 'inarray' && filter[key].length > 0) {
          filter[key].forEach((final, index) => {
            const character = urlFilter === '' ? '?' : '&';
            urlFilter += `${character}filter[${key}][${index}][field]=${filter[key][index].field}`;

            final.value.forEach((value, indexValue) => {
              urlFilter += `&filter[${key}][${index}][value][${indexValue}]=${value}`;
            });
          });
        } else {
          let index = 0;
          Object.keys(filter[key]).forEach((subkey) => {
            Object.keys(filter[key][subkey]).forEach((final) => {
              const character = urlFilter === '' ? '?' : '&';

              urlFilter += `${character}filter[${key}][${index}][${[final]}]=${
                filter[key][subkey][final]
              }`;
            });
            index++;
          });
        }
      });
    }

    return this.http.get(`${environment.apiUrl}/dips/findall${urlFilter}`, {
      params,
    });
  }

  getDip(name?: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/dips/findone?dipName=${name}`);
  }

  getDipWithLanguage(name: string, lang: Language): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/dips/findone?dipName=${name}&lang=${lang}`
    );
  }

  getDipByFilename(filename?: string, field?: string): Observable<any> {

    return this.http.get(
      `${environment.apiUrl}/dips/findone-by?field=${field}&value=${filename}`
    );

  }

  getDipBy(field: string, value: string): Observable<any> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        field,
        value,
      },
    });

    return this.http.get(`${environment.apiUrl}/dips/findone-by`, {
      params,
    });
  }

  sendFeedBack(subject: string, description: string): Observable<any> {
    return this.http.post(`${environment.feedBackFormUrl}`, {
      subject,
      description,
    });
  }

  getFilter(): FilterData {
    return this.filter;
  }

  setFilter(filter: FilterData): void {
    this.filter = filter;
  }

  getDipsData(): any[] {
    return this.dipsData;
  }

  setDipsData(data: any[]): void {
    this.dipsData = data;
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(value: number): void {
    this.total = value;
  }

  clearFilter(): void {
    this.filter = {
      status: '',
      type: '',
      posStatus: -1,
      posType: -1,
      arrayStatus: [0, 0, 0, 0, 0, 0],
    };
  }

  setFilterArrayStatus(index: number, value: number) {
    this.filter.arrayStatus[index] = value;
  }

  checkDependencies(deps: string[]) {
    const params = [`filter[inarray][0][field]=dipName`];
    params.push(...deps.map((dep, index) => `filter[inarray][0][value][${index}]=${dep.split(' ').shift().replace('-', '')}`));
    params.push('select=dipName');

    const url = `${environment.apiUrl}/dips/findall?${params.join('&')}`;

    return this.http.get<{ items: IDip[] }>(url);
  }
}
