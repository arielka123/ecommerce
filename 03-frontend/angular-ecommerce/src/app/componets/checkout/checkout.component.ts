import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

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


  constructor(private formBuilder: FormBuilder, 
              private Luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: ['']
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: ['']
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

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

      //populate countries
      this.Luv2ShopFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved cuntries: " + JSON.stringify(data));
          this.countries = data;
        }
      );

      //populate states
      // this.Luv2ShopFormService.getStates().subscribe(
      //   data => {
      //     console.log("Retrieved cuntries: " + JSON.stringify(data));
      //     this.countries = data;
      //   }
      // );


  }

  copyShippingAdressToBillingAdress(event: any){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit(){
    console.log("Handlink the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email adress is  " + this.checkoutFormGroup.get('customer')?.value.email);

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

  console.log(`{formGroupName} country code: ${countryCode}`);
  console.log(`{formGroupName} country name: ${countryName}`);

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
