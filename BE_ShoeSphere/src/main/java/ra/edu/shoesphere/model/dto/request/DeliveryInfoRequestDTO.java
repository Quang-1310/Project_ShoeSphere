package ra.edu.shoesphere.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DeliveryInfoRequestDTO {
    @NotBlank(message = "Full name is required.")
    @Size(max = 50, message = "Full name must not exceed 50 characters.")
    private String fullName;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Phone number is invalid.")
    private String phone;

    @NotBlank(message = "Delivery address is required.")
    @Size(max = 255, message = "Delivery address must not exceed 255 characters.")
    private String address;
}
