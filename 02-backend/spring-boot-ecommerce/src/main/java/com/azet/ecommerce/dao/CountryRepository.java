package com.azet.ecommerce.dao;

import com.azet.ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(collectionResourceRel ="countries", path = "countries")
interface CountryRepository extends JpaRepository<Country, Integer> {

}
