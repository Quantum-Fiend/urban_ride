package com.urban_ride.auth.service;

import com.urban_ride.auth.dto.AuthResponse;
import com.urban_ride.auth.dto.LoginRequest;
import com.urban_ride.auth.dto.RefreshTokenRequest;
import com.urban_ride.auth.dto.RegisterRequest;
import com.urban_ride.auth.model.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    User getCurrentAuthenticatedUser();
}
