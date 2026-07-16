package ra.edu.shoesphere.model.dto.response;
import lombok.*; import java.math.BigDecimal;
@Data @Builder @AllArgsConstructor public class CartItemResponseDTO { private Long id; private Long shoeId; private String name; private String imageUrl; private BigDecimal price; private Integer size; private Integer quantity; private Integer stockQuantity; }
