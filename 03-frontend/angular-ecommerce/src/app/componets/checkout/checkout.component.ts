import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopValidators } from 'src/app/valdators/luv2-shop-validators';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { JsonPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQunatity: number = 0;

  creditCardYears: number[] =[];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  //initialize stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;

  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder, 
              private Luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    //setup stripe payment form
    this.setupStripePaymentForm();

    this.reviewCardDetails(); 

    //read user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    
    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
                                [Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,
                                [Validators.required, 
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({

        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                     Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                  Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Luv2ShopValidators.notOnlyWhitespace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                  Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                     Luv2ShopValidators.notOnlyWhitespace])
      }),

      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
        //                                 Luv2ShopValidators.notOnlyWhitespace]),
        // cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        // securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        // expirationMonth: [''],
        // expirationYear: ['']
      })
    });

    /*
    //populate credit card months
    const startMonth : number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.Luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      } 
    );

    //populate the credit card years
      this.Luv2ShopFormService.getCreditCardYear().subscribe(
        data => {
          console.log("Retrieved credit card years: " + JSON.stringify(data));
          this.creditCardYears = data;
        }
      );
      */

      //populate countries
      this.Luv2ShopFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved cuntries: " + JSON.stringify(data));
          this.countries = data;
        }
      );
    
  }

  setupStripePaymentForm() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();

    //crerate card element .. and hide zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    //add an instance of card ui component into the card-element div
    this.cardElement.mount('#card-element');

    //add event binding for the change event on card element
    this.cardElement.on('change', (event: any) => {

      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');


      if(event.complete){
        this.displayError.textContent = "";
      }
      else if(event.error){
        //show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });
  }

  reviewCardDetails() {

    //subscrive card service totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQunatity = data;
      }
    )

    //subscrive card service totalPrice

    this.cartService.totalPrice.subscribe(
      data=> {
        this.totalPrice = data;
      }
    )
  }


  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode () { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAdressToBillingAdress(event: any){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;


    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log("Handlink the submit button");
    console.log("test ->");
    console.log("shippingAddress: ");
    console.log( this.checkoutFormGroup.controls['shippingAddress'].value);
    console.log("billingAdress: ");
    console.log( this.checkoutFormGroup.controls['billingAddress'].value);


    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //set up order
    let order = new Order;
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQunatity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    //-long way
    /*

    
    let orderItems = [];
    
    for(let i=0; i <cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    //- short way
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));


    //set up purchase 
    let purchase = new Purchase();

    //populate purchase- customer, addresses, order and orderItems
    //-customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    //-addresses
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    //-order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;


    //if valid for then
    //-create payment intent
    //-confirm card payment
    //-place order

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name : `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry?.value.code
                    }

                  }
                }
            }, { handleActions: false })
            .then((result:any) => {
              if(result.error){
                //inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              }
              else {
                //call rest api via the checkoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                    next: (response: any) => {
                      alert(`Your order has been received. \nOrder Tracking number: ${response.orderTrackingNumber}`);

                      //reset cart

                      this.resetCart();
                      this.isDisabled = false;
                    },
                    error: (err: any) => {
                      alert(`There was an error: ${err.message}`);
                      this.isDisabled = false;
                    }
                  }
                )
              }
            });
         }
      );
    } else{
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

/*
    //call rest api via checkoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => { 
          alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber} `)
        
          //reset cart
          this.resetCart();
        },

        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    
    );
  */

    // console.log(this.checkoutFormGroup.get('customer')?.value);
    // console.log("The email address is  " + this.checkoutFormGroup.get('customer')?.value.email);

    // console.log("The shipping address country is  " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    // console.log("The shipping address state is  " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.cartService.persisCartItems();

    //reset form data
    this.checkoutFormGroup.reset();

    //navigate to product page
    this.router.navigateByUrl("/products")
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
  }
  else {
    startMonth = 1;
  }

  this.Luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
    data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    }
  );
}

getStates(formGroupName: string){

  const formGroup = this.checkoutFormGroup.get(formGroupName);

  const countryCode = formGroup?.value.country.code;
  const countryName = formGroup?.value.country.name;

  console.log(`${formGroupName} country code: ${countryCode}`);
  console.log(`${formGroupName} country name: ${countryName}`);

  this.Luv2ShopFormService.getStates(countryCode).subscribe(
    data => {

      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      }
      else {
        this.billingAddressStates = data;
      }

      //select the first item as default
      formGroup?.get('state')?.setValue(data[0]);
      
    }
  )
}

}
