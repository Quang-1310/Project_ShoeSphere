package ra.edu.shoesphere.model.dto.response;
import lombok.*; import java.math.BigDecimal; import java.time.LocalDateTime; import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor public class OrderResponseDTO { private Long id; private String receiverName; private String receiverPhone; private String deliveryAddress; private BigDecimal totalAmount; private String status; private LocalDateTime createdAt; private List<OrderItemResponseDTO> items; }
