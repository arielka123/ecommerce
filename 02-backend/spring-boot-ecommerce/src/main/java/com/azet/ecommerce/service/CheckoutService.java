package com.azet.ecommerce.service;

import com.azet.ecommerce.dto.Purchase;
import com.azet.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
