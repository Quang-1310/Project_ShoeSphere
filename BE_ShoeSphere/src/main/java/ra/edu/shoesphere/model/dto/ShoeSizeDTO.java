package ra.edu.shoesphere.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoeSizeDTO {
    @NotNull(message = "Size không được để trống")
    @Min(value = 1, message = "Size không hợp lệ")
    private Integer size;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer stockQuantity;
}
