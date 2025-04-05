package com.market.financial.wallet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.market.financial.wallet.model.Wallet;
import com.market.financial.wallet.repository.WalletRepository;
import com.market.user.model.User;

import jakarta.transaction.Transactional;

@Service
public class WalletService {
    
    private static final Logger logger = LoggerFactory.getLogger(WalletService.class);
    
    @Autowired
    private WalletRepository walletRepository;

    @Transactional
    public Wallet createWallet(User user) {
        try {
            logger.info("Criando wallet para o usuário: {} (ID: {})", user.getName(), user.getId());
            
            // Verifica se o usuário já possui uma wallet
            if (walletRepository.existsByUser(user)) {
                logger.info("Usuário {} já possui uma wallet", user.getName());
                return walletRepository.findByUserWithoutPageable(user);
            }
            
            Wallet wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(0.0);
            wallet.setCurrency("BRL");
            wallet.setStatus("ACTIVE");
            
            wallet = walletRepository.save(wallet);
            logger.info("Wallet criada com sucesso para o usuário {} (ID: {})", user.getName(), wallet.getId());
            
            return wallet;
        } catch (Exception e) {
            logger.error("Erro ao criar wallet para o usuário {}: {}", user.getName(), e.getMessage(), e);
            throw new RuntimeException("Erro ao criar wallet: " + e.getMessage());
        }
    }
}