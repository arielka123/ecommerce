import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  theCartService: CartService;
  
  storage: Storage = localStorage;


  private purchaseUrl = environment.luv2ShopApiUrl + "/checkout/purchase";

  constructor(private httpClient: HttpClient, cartService: CartService) {
    this.theCartService = cartService;
   }

  placeOrder(purchase: Purchase): Observable<any> {
    // this.theCartService.cartItems = [];
    this.storage.clear();
    
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
