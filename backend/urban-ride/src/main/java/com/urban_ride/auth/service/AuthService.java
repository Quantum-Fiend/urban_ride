package com.urban_ride.auth.service;

import com.urban_ride.auth.dto.LoginRequest;
import com.urban_ride.auth.dto.RegisterRequest;
import com.urban_ride.auth.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
