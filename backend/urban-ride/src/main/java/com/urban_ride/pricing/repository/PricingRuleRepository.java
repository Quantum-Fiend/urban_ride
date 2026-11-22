package com.urban_ride.pricing.repository;

import com.urban_ride.driver.model.Driver;
import com.urban_ride.pricing.model.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {
    Optional<PricingRule> findByVehicleType(Driver.VehicleType vehicleType);
}
