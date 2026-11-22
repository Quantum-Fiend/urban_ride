package com.urban_ride;

/**
 * Backward compatibility alias for main application entrypoint
 */
public class UrbanRideApplication extends RideSphereApplication {
    public static void main(String[] args) {
        RideSphereApplication.main(args);
    }
}
