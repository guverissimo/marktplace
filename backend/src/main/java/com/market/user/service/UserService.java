package com.market.user.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.market.user.dto.Update;
import com.market.user.model.User;
import com.market.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;

@Service
public class UserService {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Update update(Update dto) {
        try {
            User user = repository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

            // Verifica se o email já está em uso por outro usuário
            if (!user.getEmail().equals(dto.getEmail())) {
                if (repository.existsByEmail(dto.getEmail())) {
                    throw new ValidationException("Email já está em uso");
                }
                user.setEmail(dto.getEmail());
            }

            user.setName(dto.getNome());

            // Atualiza a senha apenas se uma nova for fornecida
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }

            user = repository.save(user);
            
            // Retorna um novo DTO com os dados atualizados
            return new Update(user.getId(), user.getName(), user.getEmail(), null);
        } catch (EntityNotFoundException e) {
            throw new ValidationException(e.getMessage());
        } catch (Exception e) {
            throw new ValidationException("Erro ao atualizar usuário: " + e.getMessage());
        }
    }
}
