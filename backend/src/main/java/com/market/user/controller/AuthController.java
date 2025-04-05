package com.market.user.controller;

import com.market.user.dto.AuthResponse;
import com.market.user.dto.LoginRequest;
import com.market.user.dto.RegisterRequest;
import com.market.user.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            logger.info("Recebendo solicitação de registro para o usuário: {}", request.getEmail());
            AuthResponse response = authService.register(request);
            logger.info("Registro bem-sucedido para o usuário: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erro no registro do usuário {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.info("Recebendo solicitação de login para o usuário: {}", request.getEmail());
            AuthResponse response = authService.login(request);
            logger.info("Login bem-sucedido para o usuário: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erro no login do usuário {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 