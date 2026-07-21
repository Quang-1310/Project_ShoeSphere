package ra.edu.shoesphere.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ra.edu.shoesphere.model.dto.request.CreateOrderRequestDTO;
import ra.edu.shoesphere.model.dto.response.*;
import ra.edu.shoesphere.model.entity.*;
import ra.edu.shoesphere.repository.OrderItemRepository;
import ra.edu.shoesphere.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

 private final OrderService service;
 private final OrderItemRepository items;

 private OrderResponseDTO map(Order o) {
  return OrderResponseDTO.builder()
          .id(o.getId())
          .receiverName(o.getReceiverName())
          .receiverPhone(o.getReceiverPhone())
          .deliveryAddress(o.getDeliveryAddress())
          .totalAmount(o.getTotalAmount())
          .status(o.getStatus().name())
          .createdAt(o.getCreatedAt())
          .items(
                  items.findByOrder(o)
                          .stream()
                          .map(i -> OrderItemResponseDTO.builder()
                                  .id(i.getId())
                                  .shoeName(i.getShoeName())
                                  .imageUrl(i.getShoe() != null ? i.getShoe().getImageUrl() : null)

                                  .unitPrice(i.getUnitPrice())
                                  .size(i.getSize())
                                  .quantity(i.getQuantity())
                                  .build())
                          .toList()
          )
          .build();
 }

 @PostMapping
 public ResponseEntity<ApiDataResponse<OrderResponseDTO>> create(
         Authentication a,
         @Valid @RequestBody CreateOrderRequestDTO r
 ) {
  return ResponseEntity.status(HttpStatus.CREATED)
          .body(
                  new ApiDataResponse<>(
                          true,
                          "Order created.",
                          map(service.create(a.getName(), r)),
                          null,
                          HttpStatus.CREATED
                  )
          );
 }

 @GetMapping
 public ResponseEntity<ApiDataResponse<List<OrderResponseDTO>>> mine(
         Authentication a
 ) {
  return ResponseEntity.ok(
          new ApiDataResponse<>(
                  true,
                  "Orders retrieved.",
                  service.mine(a.getName())
                          .stream()
                          .map(this::map)
                          .toList(),
                  null,
                  HttpStatus.OK
          )
  );
 }

 @GetMapping("/{id}")
 public ResponseEntity<ApiDataResponse<OrderResponseDTO>> detail(
         Authentication a,
         @PathVariable Long id
 ) {
  return ResponseEntity.ok(
          new ApiDataResponse<>(
                  true,
                  "Order retrieved.",
                  map(service.detail(a.getName(), id)),
                  null,
                  HttpStatus.OK
          )
  );
 }

 @PatchMapping("/{id}/cancel")
 public ResponseEntity<ApiDataResponse<OrderResponseDTO>> cancel(
         Authentication a,
         @PathVariable Long id
 ) {
  return ResponseEntity.ok(
          new ApiDataResponse<>(
                  true,
                  "Order cancelled.",
                  map(service.cancel(a.getName(), id)),
                  null,
                  HttpStatus.OK
          )
  );
 }

}