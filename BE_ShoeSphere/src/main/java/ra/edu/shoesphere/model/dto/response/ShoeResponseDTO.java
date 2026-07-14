package ra.edu.shoesphere.model.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ShoeResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String brand;
    private Integer stockQuantity;
    private String imageUrl;
    private Boolean status;

}
