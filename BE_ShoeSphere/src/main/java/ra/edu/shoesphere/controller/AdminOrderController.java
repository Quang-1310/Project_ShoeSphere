package ra.edu.shoesphere.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ra.edu.shoesphere.model.entity.Order;
import ra.edu.shoesphere.model.entity.enums.OrderStatus;
import ra.edu.shoesphere.repository.OrderRepository;
import ra.edu.shoesphere.model.dto.response.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class AdminOrderController {

    private final OrderRepository orders;

    @GetMapping
    public ResponseEntity<ApiDataResponse<PageResponseDTO<OrderResponseDTO>>> list(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Long orderId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Order> orderPage;
        
        if (status != null && orderId != null) {
            orderPage = orders.findByStatusAndIdEquals(status, orderId, pageable);
        } else if (status != null) {
            orderPage = orders.findByStatus(status, pageable);
        } else if (orderId != null) {
            orderPage = orders.findByIdEquals(orderId, pageable);
        } else {
            orderPage = orders.findAllBy(pageable);
        }
        
        List<OrderResponseDTO> content = orderPage.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        
        PageResponseDTO<OrderResponseDTO> pageResponse = PageResponseDTO.<OrderResponseDTO>builder()
                .content(content)
                .pageNumber(orderPage.getNumber() + 1)
                .pageSize(orderPage.getSize())
                .totalElements((int) orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .isLast(orderPage.isLast())
                .build();
                
        ApiDataResponse<PageResponseDTO<OrderResponseDTO>> response = new ApiDataResponse<>(
                true,
                "Lấy danh sách đơn hàng thành công",
                pageResponse,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ApiDataResponse<OrderResponseDTO>> confirm(@PathVariable Long id) {
        Order o = orders.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (o.getStatus() != OrderStatus.PENDING_CONFIRMATION) {
            return ResponseEntity.badRequest().build(); // Let GlobalExceptionHandler handle this if we threw Exception, but this is fine.
        }
        o.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orders.save(o);
        
        ApiDataResponse<OrderResponseDTO> response = new ApiDataResponse<>(
                true,
                "Duyệt đơn hàng thành công",
                toDTO(savedOrder),
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }
    
    private OrderResponseDTO toDTO(Order o) {
        return OrderResponseDTO.builder()
                .id(o.getId())
                .receiverName(o.getReceiverName())
                .receiverPhone(o.getReceiverPhone())
                .deliveryAddress(o.getDeliveryAddress())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus() != null ? o.getStatus().name() : null)
                .createdAt(o.getCreatedAt())
                .items(o.getOrderItems().stream().map(i -> OrderItemResponseDTO.builder()
                        .id(i.getId())
                        .shoeName(i.getShoeName())
                        .unitPrice(i.getUnitPrice())
                        .quantity(i.getQuantity())
                        .size(i.getSize())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiDataResponse<String>> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiDataResponse<>(false, "Internal Server Error: " + e.getMessage(), e.toString(), null, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}
