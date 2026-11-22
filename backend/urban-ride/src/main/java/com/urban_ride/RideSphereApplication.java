package com.urban_ride;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@SpringBootApplication
@RestController
public class RideSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(RideSphereApplication.class, args);
    }

    @GetMapping("/")
    public Map<String, Object> root() {
        return Map.of(
                "application", "Urban Ride (RideSphere) Enterprise Platform",
                "version", "1.0.0",
                "status", "UP",
                "docs", "/swagger-ui.html"
        );
    }
}
