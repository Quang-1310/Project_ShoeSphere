package ra.edu.shoesphere.model.dto.request;
import jakarta.validation.constraints.*; import lombok.Data;
@Data public class CartItemRequestDTO { @NotNull private Long shoeId; @NotNull private Integer size; @Min(1) private Integer quantity=1; }
