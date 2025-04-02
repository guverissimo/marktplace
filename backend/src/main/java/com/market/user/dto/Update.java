package com.market.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Update {
    private Long id;
    private String nome;
    private String email;
    private String password;
}
