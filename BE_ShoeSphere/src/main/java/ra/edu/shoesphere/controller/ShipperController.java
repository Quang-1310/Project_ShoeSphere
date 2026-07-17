package ra.edu.shoesphere.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.OrderItemResponseDTO;
import ra.edu.shoesphere.model.dto.response.OrderResponseDTO;
import ra.edu.shoesphere.model.entity.Order;
import ra.edu.shoesphere.model.entity.enums.OrderStatus;
import ra.edu.shoesphere.repository.OrderItemRepository;
import ra.edu.shoesphere.repository.OrderRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/shipper")
@PreAuthorize("hasRole('SHIPPER')")
@RequiredArgsConstructor
public class ShipperController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    // Lấy danh sách đơn hàng theo trạng thái (mặc định: tất cả đơn shipper cần xử lý)
    @GetMapping("/orders")
    public ResponseEntity<ApiDataResponse<List<OrderResponseDTO>>> listOrders(
            @RequestParam(required = false) OrderStatus status) {

        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            // Mặc định hiển thị tất cả đơn shipper cần xử lý
            orders = orderRepository.findByStatusInOrderByCreatedAtDesc(
                    List.of(OrderStatus.PACKED, OrderStatus.PICKED_UP, OrderStatus.SHIPPING));
        }

        List<OrderResponseDTO> dtos = orders.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiDataResponse<>(true, "Lấy danh sách thành công", dtos, null, HttpStatus.OK));
    }

    // Nhận đơn: PACKED -> PICKED_UP
    @PatchMapping("/orders/{id}/pickup")
    @Transactional
    public ResponseEntity<ApiDataResponse<OrderResponseDTO>> pickup(@PathVariable Long id) {
        return advanceStatus(id, OrderStatus.PACKED, OrderStatus.PICKED_UP, "Đã nhận đơn hàng");
    }

    // Bắt đầu giao: PICKED_UP -> SHIPPING
    @PatchMapping("/orders/{id}/ship")
    @Transactional
    public ResponseEntity<ApiDataResponse<OrderResponseDTO>> ship(@PathVariable Long id) {
        return advanceStatus(id, OrderStatus.PICKED_UP, OrderStatus.SHIPPING, "Đã bắt đầu giao hàng");
    }

    // Giao thành công: SHIPPING -> DELIVERED
    @PatchMapping("/orders/{id}/deliver")
    @Transactional
    public ResponseEntity<ApiDataResponse<OrderResponseDTO>> deliver(@PathVariable Long id) {
        return advanceStatus(id, OrderStatus.SHIPPING, OrderStatus.DELIVERED, "Đã giao hàng thành công");
    }

    private ResponseEntity<ApiDataResponse<OrderResponseDTO>> advanceStatus(
            Long id, OrderStatus required, OrderStatus next, String message) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        if (o.getStatus() != required) {
            return ResponseEntity.badRequest().body(
                    new ApiDataResponse<>(false, "Trạng thái đơn hàng không hợp lệ để thực hiện thao tác này.", null, null, HttpStatus.BAD_REQUEST));
        }
        o.setStatus(next);
        Order saved = orderRepository.save(o);
        return ResponseEntity.ok(new ApiDataResponse<>(true, message, toDTO(saved), null, HttpStatus.OK));
    }

    private OrderResponseDTO toDTO(Order o) {
        return OrderResponseDTO.builder()
                .id(o.getId())
                .receiverName(o.getReceiverName())
                .receiverPhone(o.getReceiverPhone())
                .deliveryAddress(o.getDeliveryAddress())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus().name())
                .createdAt(o.getCreatedAt())
                .items(orderItemRepository.findByOrder(o).stream()
                        .map(i -> OrderItemResponseDTO.builder()
                                .id(i.getId())
                                .shoeName(i.getShoeName())
                                .unitPrice(i.getUnitPrice())
                                .quantity(i.getQuantity())
                                .size(i.getSize())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
