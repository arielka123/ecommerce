package com.azet.ecommerce.dto;

import com.azet.ecommerce.entity.Address;
import com.azet.ecommerce.entity.Customer;
import com.azet.ecommerce.entity.Order;
import com.azet.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
