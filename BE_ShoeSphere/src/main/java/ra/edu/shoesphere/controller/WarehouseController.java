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
@RequestMapping("/api/v1/warehouse")
@PreAuthorize("hasRole('WAREHOUSE_MANAGEMENT')")
@RequiredArgsConstructor
public class WarehouseController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    // Lấy danh sách đơn hàng CONFIRMED cần đóng gói
    @GetMapping("/orders")
    public ResponseEntity<ApiDataResponse<List<OrderResponseDTO>>> listConfirmed() {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.CONFIRMED);
        List<OrderResponseDTO> dtos = orders.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiDataResponse<>(true, "Lấy danh sách thành công", dtos, null, HttpStatus.OK));
    }

    // Chuyển trạng thái đơn hàng từ CONFIRMED -> PACKED
    @PatchMapping("/orders/{id}/pack")
    @Transactional
    public ResponseEntity<ApiDataResponse<OrderResponseDTO>> pack(@PathVariable Long id) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        if (o.getStatus() != OrderStatus.CONFIRMED) {
            return ResponseEntity.badRequest().body(
                    new ApiDataResponse<>(false, "Đơn hàng không ở trạng thái CONFIRMED.", null, null, HttpStatus.BAD_REQUEST));
        }
        o.setStatus(OrderStatus.PACKED);
        Order saved = orderRepository.save(o);
        return ResponseEntity.ok(new ApiDataResponse<>(true, "Đã đóng gói đơn hàng thành công", toDTO(saved), null, HttpStatus.OK));
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
