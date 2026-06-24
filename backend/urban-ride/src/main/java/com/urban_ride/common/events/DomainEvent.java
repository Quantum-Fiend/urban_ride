package com.urban_ride.common.events;

import java.time.LocalDateTime;

public interface DomainEvent {
    LocalDateTime getOccurredOn();
}
