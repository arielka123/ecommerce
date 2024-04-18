package com.azet.ecommerce.service;

import com.azet.ecommerce.dao.CustomerRepository;
import com.azet.ecommerce.dto.Purchase;
import com.azet.ecommerce.dto.PurchaseResponse;
import com.azet.ecommerce.entity.Address;
import com.azet.ecommerce.entity.Customer;
import com.azet.ecommerce.entity.Order;
import com.azet.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(final Purchase purchase) {

        //retrieve the order from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billingAddress and shippingAddress
        Address billingAddress = purchase.getBillingAddress();
        order.setBillingAddress(billingAddress);

        Address shippingAddress = purchase.getShippingAddress();
        order.setShippingAddress(shippingAddress);

        //populate customer with order
        Customer customer = purchase.getCustomer();

        //check if this is an existing customer
        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);

        if(customerFromDB != null){
            customer = customerFromDB;
        }

        //  order.setCustomer(customer);
        customer.add(order);

        //save to database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        //generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
