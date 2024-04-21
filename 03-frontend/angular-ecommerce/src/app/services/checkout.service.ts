import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  theCartService: CartService;


  private purchaseUrl = "http://localhost:8080/api/checkout/purchase";

  constructor(private httpClient: HttpClient, cartService: CartService) {
    this.theCartService = cartService;
   }

  placeOrder(purchase: Purchase): Observable<any> {
    this.theCartService.cartItems = [];
    
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
