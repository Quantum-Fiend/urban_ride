package com.urban_ride;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class UrbanRideApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrbanRideApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "hello this is my app of spring boot";
	}

}
