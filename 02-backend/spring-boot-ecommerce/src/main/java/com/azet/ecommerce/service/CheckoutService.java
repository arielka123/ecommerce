package com.azet.ecommerce.service;

import com.azet.ecommerce.dto.PaymentInfo;
import com.azet.ecommerce.dto.Purchase;
import com.azet.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
