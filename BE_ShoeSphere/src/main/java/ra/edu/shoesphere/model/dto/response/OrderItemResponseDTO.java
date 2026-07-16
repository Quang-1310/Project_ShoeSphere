package ra.edu.shoesphere.model.dto.response;
import lombok.*; import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor public class OrderItemResponseDTO { private Long id; private String shoeName; private String imageUrl; private BigDecimal unitPrice; private Integer size; private Integer quantity; }
