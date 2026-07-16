package ra.edu.shoesphere.service; import ra.edu.shoesphere.model.dto.request.CreateOrderRequestDTO; import ra.edu.shoesphere.model.entity.Order;
public interface OrderService { Order create(String email, CreateOrderRequestDTO request); java.util.List<Order> mine(String email); Order cancel(String email,Long id); }
