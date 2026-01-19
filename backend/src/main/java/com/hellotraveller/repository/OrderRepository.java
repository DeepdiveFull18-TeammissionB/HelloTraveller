package com.hellotraveller.repository;

import com.hellotraveller.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNo(String orderNo);

    Optional<Order> findByOrderNoAndGuestNameAndGuestEmail(String orderNo, String guestName, String guestEmail);

    Optional<Order> findTopByGuestEmailAndProductNameAndCreatedAtAfter(String guestEmail, String productName,
            java.time.LocalDateTime timestamp);
}
