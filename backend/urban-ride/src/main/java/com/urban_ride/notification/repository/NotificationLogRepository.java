package com.urban_ride.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.notification.model.NotificationLog;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
}
