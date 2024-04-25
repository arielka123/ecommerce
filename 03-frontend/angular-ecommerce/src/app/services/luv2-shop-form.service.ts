import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {


  private countriesURL = environment.luv2ShopApiUrl + '/countries';
  private statesURL = environment.luv2ShopApiUrl + '/states';


  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesURL).pipe(
      map(reponse => reponse._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{

   //search url
    const searchStatesUrl = `${this.statesURL}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(rep => rep._embedded.states)
    );
  }

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


interface GetResponseCountries {
  _embedded:{
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded:{
    states: State[];
  }
}
