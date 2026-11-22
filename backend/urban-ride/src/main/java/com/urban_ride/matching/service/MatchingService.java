package com.urban_ride.matching.service;

import com.urban_ride.common.utils.GeoUtils;
import com.urban_ride.driver.model.Driver;
import com.urban_ride.driver.repository.DriverRepository;
import com.urban_ride.trip.model.Trip;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final DriverRepository driverRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Optional<Driver> findBestCandidate(Trip trip) {
        List<Driver> availableDrivers = driverRepository.findAvailableDrivers();

        // Filter and rank drivers by proximity to pickup location
        return availableDrivers.stream()
                .filter(driver -> driver.getCurrentLatitude() != null && driver.getCurrentLongitude() != null)
                .min(Comparator.comparingDouble(d ->
                        GeoUtils.calculateDistanceKm(
                                trip.getPickupLatitude(), trip.getPickupLongitude(),
                                d.getCurrentLatitude(), d.getCurrentLongitude()
                        )
                ));
    }

    public void broadcastOfferToDriver(Driver driver, Trip trip) {
        log.info("Dispatching trip offer {} to driver {}", trip.getId(), driver.getId());
        try {
            messagingTemplate.convertAndSend("/topic/drivers/" + driver.getId() + "/offers", trip);
        } catch (Exception e) {
            log.warn("WebSocket dispatch notification failed: {}", e.getMessage());
        }
    }
}
