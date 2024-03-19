package com.azet.ecommerce.dao;

import com.azet.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "product")
interface ProductRepository extends JpaRepository<Product, Long> {
}
