package com.market.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.market.user.dto.Update;
import com.market.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService service;
	
    @PutMapping
    public ResponseEntity<?> update(@RequestBody @Valid Update dto, Authentication authentication) {
        try {
            // Verifica se o usuário está tentando atualizar seu próprio perfil
            if (!dto.getId().equals(((com.market.user.model.User) authentication.getPrincipal()).getId())) {
                return ResponseEntity.status(403).body("Você não tem permissão para atualizar este perfil");
            }
            
            Update userUpdate = service.update(dto);
            return ResponseEntity.ok(userUpdate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
