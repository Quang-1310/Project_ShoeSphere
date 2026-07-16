package ra.edu.shoesphere.service;

import ra.edu.shoesphere.model.dto.request.CreateOrderRequestDTO;
import ra.edu.shoesphere.model.entity.Order;

import java.util.List;

public interface OrderService {

    Order create(String email, CreateOrderRequestDTO request);

    List<Order> mine(String email);

    Order detail(String email, Long id);

    Order cancel(String email, Long id);

}