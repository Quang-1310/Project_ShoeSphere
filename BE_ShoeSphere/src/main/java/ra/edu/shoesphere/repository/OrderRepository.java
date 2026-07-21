package ra.edu.shoesphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ra.edu.shoesphere.model.entity.Order;
import ra.edu.shoesphere.model.entity.User;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

    List<Order> findByStatusOrderByCreatedAtDesc(ra.edu.shoesphere.model.entity.enums.OrderStatus status);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"orderItems"})
    org.springframework.data.domain.Page<Order> findByStatus(ra.edu.shoesphere.model.entity.enums.OrderStatus status, org.springframework.data.domain.Pageable pageable);
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"orderItems"})
    org.springframework.data.domain.Page<Order> findByIdEquals(Long id, org.springframework.data.domain.Pageable pageable);
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"orderItems"})
    org.springframework.data.domain.Page<Order> findByStatusAndIdEquals(ra.edu.shoesphere.model.entity.enums.OrderStatus status, Long id, org.springframework.data.domain.Pageable pageable);
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"orderItems"})
    org.springframework.data.domain.Page<Order> findAllBy(org.springframework.data.domain.Pageable pageable);

    List<Order> findByStatusInOrderByCreatedAtDesc(List<ra.edu.shoesphere.model.entity.enums.OrderStatus> statuses);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != ra.edu.shoesphere.model.entity.enums.OrderStatus.CANCELLED")
    java.math.BigDecimal sumTotalRevenue();

    Long countByStatus(ra.edu.shoesphere.model.entity.enums.OrderStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT MONTH(o.createdAt) as month, COALESCE(SUM(o.totalAmount), 0) as revenue, COUNT(o.id) as orderCount FROM Order o WHERE YEAR(o.createdAt) = :year AND o.status != ra.edu.shoesphere.model.entity.enums.OrderStatus.CANCELLED GROUP BY MONTH(o.createdAt) ORDER BY MONTH(o.createdAt)")
    List<Object[]> getMonthlyRevenueByYear(@org.springframework.data.repository.query.Param("year") int year);
}

