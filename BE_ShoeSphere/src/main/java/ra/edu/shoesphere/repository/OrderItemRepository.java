package ra.edu.shoesphere.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ra.edu.shoesphere.model.entity.OrderItem;
public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
    java.util.List<OrderItem> findByOrder(ra.edu.shoesphere.model.entity.Order order);
}
