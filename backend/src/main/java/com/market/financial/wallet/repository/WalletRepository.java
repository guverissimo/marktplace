package com.market.financial.wallet.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.market.financial.wallet.model.Wallet;
import com.market.user.model.User;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Page<Wallet> findByUser(User user, Pageable pageable);
    
    @Query("SELECT w FROM Wallet w WHERE w.user = :user")
    Wallet findByUserWithoutPageable(@Param("user") User user);
    
    boolean existsByUser(User user);
}
