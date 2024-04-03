import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {


  private countriesURL = 'http://localhost:8080/api/countries';
  private statesURL = 'http://localhost:8080/api/states';


  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonths: number): Observable<number[]>{
    let data: number[] = [];

    //build and array for "month" dropdown list

    for(let theMonth = startMonths; theMonth <=12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }


  getCreditCardYear(): Observable<number[]>{
    let data: number[]=[];

    //build an arrray for "Year" dropdown list
    // - start at current uear and loop for next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear<= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }

}
