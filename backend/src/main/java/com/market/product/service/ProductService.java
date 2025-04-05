package com.market.product.service;

import com.market.product.dto.ProductRequest;
import com.market.product.dto.ProductResponse;
import com.market.product.model.Product;
import com.market.product.repository.ProductRepository;
import com.market.user.model.User;
import com.market.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProductResponse create(ProductRequest request, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setUser(user);

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(this::mapToResponse);
    }

    public Page<ProductResponse> findByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        
        return productRepository.findByUser(user, pageable)
            .map(this::mapToResponse);
    }

    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
        
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request, Long userId) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        if (!product.getUser().getId().equals(userId)) {
            throw new ValidationException("Você não tem permissão para atualizar este produto");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        if (!product.getUser().getId().equals(userId)) {
            throw new ValidationException("Você não tem permissão para excluir este produto");
        }

        productRepository.delete(product);
    }

    public Page<ProductResponse> findByCategory(String category, Pageable pageable) {
        return productRepository.findByCategory(category, pageable)
            .map(this::mapToResponse);
    }

    public Page<ProductResponse> searchByName(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable)
            .map(this::mapToResponse);
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStock(),
            product.getCategory(),
            product.getImageUrl(),
            product.getUser().getId(),
            product.getUser().getName(),
            product.getCreatedAt()
        );
    }
} 