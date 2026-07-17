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
}
