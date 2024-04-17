import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[]= [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0.00);  //subclass of obsevervable. Publish events
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() { 
    //read the data for storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem){
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length>0){
       //find the item in the cart based on item id

      existingCartItem = this.cartItems.find(item => item.id === theCartItem.id)!;  //kopiowanie przez referenję

      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;      //in js passing by reference
    }
    else{
      //just add to array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem){
    
     if(theCartItem.quantity>0){
      theCartItem.quantity--;      //in js passing by reference
    }

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
    
  }

  remove(theCartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(item=> theCartItem.id === item.id)

    if(itemIndex >-1){
      this.cartItems.splice(itemIndex, 1) //delete one item
      this.computeCartTotals();

    }
    
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

    //persist cast data
    this.persisCartItems();
  }

  persisCartItems(){
   this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
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
