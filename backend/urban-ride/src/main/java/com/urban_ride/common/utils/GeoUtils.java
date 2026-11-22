package com.urban_ride.common.utils;

public class GeoUtils {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calculates great-circle distance between two GPS coordinates using Haversine formula.
     */
    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((EARTH_RADIUS_KM * c) * 100.0) / 100.0;
    }

    /**
     * Estimates transit duration in minutes assuming average urban traffic speed (25 km/h).
     */
    public static int estimateDurationMinutes(double distanceKm) {
        double hours = distanceKm / 25.0;
        int minutes = (int) Math.ceil(hours * 60.0);
        return Math.max(minutes, 3); // minimum 3 minutes
    }
}
