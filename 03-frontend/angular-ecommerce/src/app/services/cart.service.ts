import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[]= [];

  totalPrice: Subject<number> = new Subject<number>();  //subclass of obsevervable. Publish events
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length>0){
       //find the item in the cart based on item id

       for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
       }

      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }
    else{
      //just add to array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();

  }


  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuntityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuntityValue += currentCartItem.quantity;
    }

    //public the new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuntityValue);

    //log cart data for debugging
    this.logCartData(totalPriceValue, totalQuntityValue);
  }


  logCartData(totalPriceValue: number, totalQuntityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`)
    }

    console.log(`totalPrice:${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuntityValue}`)
    console.log("-------");
  }
}
