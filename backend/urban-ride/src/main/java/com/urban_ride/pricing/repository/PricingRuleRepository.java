package com.urban_ride.pricing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.pricing.model.PricingRule;

public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {
}
