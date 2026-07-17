package ra.edu.shoesphere.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ra.edu.shoesphere.model.dto.request.CreateOrderRequestDTO;
import ra.edu.shoesphere.model.entity.*;
import ra.edu.shoesphere.model.entity.enums.OrderStatus;
import ra.edu.shoesphere.repository.*;
import ra.edu.shoesphere.service.OrderService;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

 private final UserRepository users;
 private final CartItemRepository carts;
 private final OrderRepository orders;
 private final OrderItemRepository orderItems;

 @Override
 public Order create(String email, CreateOrderRequestDTO r) {
  User u = users.findByEmail(email)
          .orElseThrow(() -> new IllegalArgumentException("User not found."));

  if (u.getAddress() == null || u.getAddress().isBlank()) {
   throw new IllegalArgumentException("Delivery information is required.");
  }

  // Lấy danh sách các sản phẩm trong giỏ hàng được chọn để thanh toán
  List<CartItem> items = r.getCartItemIds().stream()
          .map(id -> carts.findByIdAndUser(id, u)
                  .orElseThrow(() -> new IllegalArgumentException("Cart item not found.")))
          .toList();

  // Khởi tạo đơn hàng mới
  Order o = new Order();
  o.setUser(u);
  o.setReceiverName(u.getFullName());
  o.setReceiverPhone(u.getPhone());
  o.setDeliveryAddress(u.getAddress());
  o.setStatus(OrderStatus.PENDING_CONFIRMATION);
  o.setTotalAmount(BigDecimal.ZERO);

  // Kiểm tra tồn kho và tính tổng tiền đơn hàng
  for (CartItem c : items) {
   Shoe s = c.getShoe();
   ShoeSize shoeSize = s.getSizes().stream()
           .filter(sz -> sz.getSize().equals(c.getSize()))
           .findFirst()
           .orElseThrow(() -> new IllegalArgumentException("Size not found for shoe: " + s.getName()));

   if (shoeSize.getStockQuantity() < c.getQuantity()) {
    throw new IllegalArgumentException("Insufficient stock for " + s.getName() + " size " + c.getSize());
   }
   // Trừ số lượng tồn kho của size giày
   shoeSize.setStockQuantity(shoeSize.getStockQuantity() - c.getQuantity());

   // Cộng dồn vào tổng tiền đơn hàng
   o.setTotalAmount(o.getTotalAmount().add(
           s.getPrice().multiply(BigDecimal.valueOf(c.getQuantity()))
   ));
  }

  // Lưu đơn hàng trước để lấy Order ID cho OrderItem
  orders.save(o);

  // Tạo và lưu danh sách chi tiết đơn hàng (OrderItem)
  for (CartItem c : items) {
   OrderItem i = new OrderItem();
   i.setOrder(o);
   i.setShoe(c.getShoe());
   i.setShoeName(c.getShoe().getName());
   i.setUnitPrice(c.getShoe().getPrice());
   i.setSize(c.getSize());
   i.setQuantity(c.getQuantity());
   orderItems.save(i);
  }

  // Xóa các sản phẩm này khỏi giỏ hàng sau khi đã đặt hàng thành công
  carts.deleteAll(items);

  return o;
 }

 @Override
 public List<Order> mine(String email) {
  return orders.findByUserOrderByCreatedAtDesc(u(email));
 }

 @Override
 public Order detail(String email, Long id) {
  return orders.findByIdAndUser(id, u(email))
          .orElseThrow(() -> new IllegalArgumentException("Order not found."));
 }

 @Override
 public Order cancel(String email, Long id) {
  Order o = orders.findByIdAndUser(id, u(email))
          .orElseThrow(() -> new IllegalArgumentException("Order not found."));

  if (o.getStatus() != OrderStatus.PENDING_CONFIRMATION && o.getStatus() != OrderStatus.CONFIRMED) {
   throw new IllegalArgumentException("Only pending or confirmed orders can be cancelled.");
  }

  o.setStatus(OrderStatus.CANCELLED);
  return orders.save(o);
 }

 // Helper method tìm kiếm User bằng email để tái sử dụng
 private User u(String e) {
  return users.findByEmail(e)
          .orElseThrow(() -> new IllegalArgumentException("User not found."));
 }
}
