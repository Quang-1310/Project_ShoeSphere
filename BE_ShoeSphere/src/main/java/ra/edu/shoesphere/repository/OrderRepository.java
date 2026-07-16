package ra.edu.shoesphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ra.edu.shoesphere.model.entity.Order;
import ra.edu.shoesphere.model.entity.User;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

}