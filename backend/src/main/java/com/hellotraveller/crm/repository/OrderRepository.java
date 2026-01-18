package com.hellotraveller.crm.repository;

import com.hellotraveller.crm.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNo(String orderNo);

    Optional<Order> findByOrderNoAndGuestName(String orderNo, String guestName);
}
