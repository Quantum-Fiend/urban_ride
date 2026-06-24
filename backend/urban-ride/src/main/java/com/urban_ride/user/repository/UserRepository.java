package com.urban_ride.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.user.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
