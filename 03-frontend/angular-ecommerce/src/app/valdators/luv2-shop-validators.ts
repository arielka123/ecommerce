import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //whitepace validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors {

        //check if string only containts whitespace
        if((control.value != null) && (control.value.trim().length === 0)){
            
            //invalid, return error objects
            return {'notOnlyWhitespace': true};
        }
        else{
            //valid, return error object
            return null!;
        }

    }

}
