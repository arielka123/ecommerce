package com.azet.ecommerce.controller;

import com.azet.ecommerce.dto.Purchase;
import com.azet.ecommerce.dto.PurchaseResponse;
import com.azet.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
class CheckoutController {
    private CheckoutService checkoutService;

    private CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }
}
