package com.market.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {
    
    @NotBlank(message = "O nome do produto é obrigatório")
    private String name;
    
    private String description;
    
    @NotNull(message = "O preço é obrigatório")
    @Min(value = 0, message = "O preço deve ser maior que zero")
    private Double price;
    
    @NotNull(message = "A quantidade em estoque é obrigatória")
    @Min(value = 0, message = "A quantidade em estoque deve ser maior ou igual a zero")
    private Integer stock;
    
    @NotBlank(message = "A categoria é obrigatória")
    private String category;
    
    private String imageUrl;
} 