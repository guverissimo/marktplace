package com.market.user.service;

import com.market.user.dto.AuthResponse;
import com.market.user.dto.LoginRequest;
import com.market.user.dto.RegisterRequest;
import com.market.user.model.User;
import com.market.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email já cadastrado");
            }
            
            var user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            userRepository.save(user);
            
            var jwtToken = jwtService.generateToken(user);
            
            return new AuthResponse(jwtToken, user.getName(), user.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao registrar usuário: " + e.getMessage());
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            var jwtToken = jwtService.generateToken(user);
            
            return new AuthResponse(jwtToken, user.getName(), user.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Email ou senha inválidos");
        }
    }
} 