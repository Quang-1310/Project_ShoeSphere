package ra.edu.shoesphere.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ra.edu.shoesphere.model.entity.OrderItem;
public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
    java.util.List<OrderItem> findByOrder(ra.edu.shoesphere.model.entity.Order order);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.order.status != ra.edu.shoesphere.model.entity.enums.OrderStatus.CANCELLED")
    Long sumTotalProductsSold();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(oi.shoe.id, 0), oi.shoeName, COALESCE(oi.shoe.imageUrl, ''), COALESCE(oi.shoe.brand, 'ShoeSphere'), COALESCE(oi.shoe.price, oi.unitPrice), SUM(oi.quantity), SUM(oi.unitPrice * oi.quantity) FROM OrderItem oi WHERE oi.order.status != ra.edu.shoesphere.model.entity.enums.OrderStatus.CANCELLED GROUP BY oi.shoe.id, oi.shoeName, oi.shoe.imageUrl, oi.shoe.brand, oi.shoe.price, oi.unitPrice ORDER BY SUM(oi.quantity) DESC")
    java.util.List<Object[]> findTopSellingProducts(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(oi.shoe.brand, 'Khác'), SUM(oi.quantity), SUM(oi.unitPrice * oi.quantity) FROM OrderItem oi WHERE oi.order.status != ra.edu.shoesphere.model.entity.enums.OrderStatus.CANCELLED GROUP BY COALESCE(oi.shoe.brand, 'Khác') ORDER BY SUM(oi.unitPrice * oi.quantity) DESC")
    java.util.List<Object[]> findSalesByBrand();
}


