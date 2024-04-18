package com.azet.ecommerce.dao;

import com.azet.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(collectionResourceRel = "products")
interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product>findByCategoryId(@Param("id") Long id, Pageable pageable);
    //http://localhost:8080/api/products/search/findByCategoryId?id=1

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
