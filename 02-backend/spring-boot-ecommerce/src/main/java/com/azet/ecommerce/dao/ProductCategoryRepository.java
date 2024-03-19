package com.azet.ecommerce.dao;

import com.azet.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
