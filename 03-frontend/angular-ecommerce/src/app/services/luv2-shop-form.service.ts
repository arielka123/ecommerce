import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor() { }

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
