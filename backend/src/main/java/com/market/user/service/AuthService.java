package com.market.user.service;

import com.market.financial.wallet.service.WalletService;
import com.market.user.dto.AuthResponse;
import com.market.user.dto.LoginRequest;
import com.market.user.dto.RegisterRequest;
import com.market.user.model.User;
import com.market.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final WalletService walletService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            logger.info("Iniciando registro de usuário: {}", request.getEmail());
            
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.warn("Tentativa de registro com email já cadastrado: {}", request.getEmail());
                throw new RuntimeException("Email já cadastrado");
            }
            
            var user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            logger.info("Salvando usuário no banco de dados: {}", request.getEmail());
            user = userRepository.save(user);
            logger.info("Usuário salvo com sucesso. ID: {}", user.getId());

            try {
                logger.info("Criando wallet para o usuário: {}", user.getId());
                walletService.createWallet(user);
                logger.info("Wallet criada com sucesso para o usuário: {}", user.getId());
            } catch (Exception e) {
                logger.error("Erro ao criar wallet para o usuário {}: {}", user.getId(), e.getMessage(), e);
                // Não interrompemos o registro do usuário se a criação da wallet falhar
            }
            
            var jwtToken = jwtService.generateToken(user);
            logger.info("Token JWT gerado para o usuário: {}", user.getId());
            
            return new AuthResponse(jwtToken, user.getId(), user.getName(), user.getEmail());
        } catch (Exception e) {
            logger.error("Erro ao registrar usuário {}: {}", request.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Erro ao registrar usuário: " + e.getMessage());
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            logger.info("Tentativa de login para o usuário: {}", request.getEmail());
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            var jwtToken = jwtService.generateToken(user);
            logger.info("Login bem-sucedido para o usuário: {}", user.getId());
            
            return new AuthResponse(jwtToken, user.getId(), user.getName(), user.getEmail());
        } catch (Exception e) {
            logger.error("Erro no login para o usuário {}: {}", request.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Email ou senha inválidos");
        }
    }
} 